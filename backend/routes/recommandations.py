import os
import json
import requests
from fastapi import APIRouter
from schemas import RecommendationRequest

router = APIRouter()

API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = "https://api.generativeai.googleapis.com/v1beta2/models/text-bison-001:generateText"


# ---------- MÉTHODES ULTRA PERSONNALISÉES (FALLBACK SOLIDE) ----------
PERSONALIZED_METHODS = {
    "visuel": [
        "Transforme chaque leçon en carte mentale colorée : une couleur = une idée clé. "
        "Utilise des flèches, symboles et dessins simples pour relier les concepts.",

        "Résume tes cours sous forme de tableaux ou schémas visuels plutôt que du texte. "
        "Plus tu vois la structure, plus tu mémorises vite.",

        "Privilégie les vidéos avec animations, graphiques ou démonstrations visuelles. "
        "Après chaque vidéo, recrée le schéma de mémoire."
    ],
    "auditif": [
        "Explique les notions à voix haute comme si tu enseignais à quelqu’un. "
        "La verbalisation renforce fortement ta mémorisation.",

        "Enregistre-toi en train de résumer tes cours et réécoute-les pendant des moments calmes "
        "(marche, transport, repos).",

        "Apprends en dialoguant : pose des questions, débat, reformule oralement ce que tu viens d’apprendre."
    ],
    "kinesthesique": [
        "Apprends par l’action : applique immédiatement ce que tu étudies à travers des exercices ou mini-projets.",

        "Associe chaque notion à un geste, un mouvement ou une manipulation concrète "
        "pour ancrer l’information dans le corps.",

        "Travaille en sessions courtes et actives : écris, bouge, manipule, teste au lieu de rester passif."
    ]
}


@router.post("/recommendation")
def get_recommendation(payload: RecommendationRequest):

    # ---------- 1️⃣ SOURCE DE VÉRITÉ : 1ER TEST ----------
    final_scores = {
        "visuel": payload.style_result.get("visuel", 0),
        "auditif": payload.style_result.get("auditif", 0),
        "kinesthesique": payload.style_result.get("kine", 0),
    }

    # sécurité si jamais le test est vide
    if sum(final_scores.values()) == 0:
        final_scores = {
            "visuel": 40,
            "auditif": 30,
            "kinesthesique": 30
        }

    dominant_style = max(final_scores, key=final_scores.get)

    # ---------- 2️⃣ MÉTHODES PAR DÉFAUT ----------
    methods = PERSONALIZED_METHODS[dominant_style]

    # ---------- 3️⃣ GEMINI (ENRICHISSEMENT, PAS OBLIGATOIRE) ----------
    if API_KEY:
        prompt = f"""
Tu es un expert en pédagogie et neurosciences.
Profil d’apprentissage dominant : {dominant_style}

Propose EXACTEMENT 3 méthodes d’apprentissage :
- très concrètes
- adaptées à ce profil
- bien détaillées (1–2 phrases chacune)

Retourne UNIQUEMENT un JSON :
["méthode 1", "méthode 2", "méthode 3"]
"""

        try:
            response = requests.post(
                API_URL,
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "prompt": prompt,
                    "temperature": 0.6,
                    "maxOutputTokens": 300
                },
                timeout=10
            )

            response.raise_for_status()
            content = response.json()["candidates"][0]["content"]
            parsed = json.loads(content)

            if isinstance(parsed, list) and len(parsed) == 3:
                methods = parsed

        except Exception:
            pass  # fallback conservé, aucun crash

    # ---------- 4️⃣ RÉPONSE FINALE ----------
    return {
        "dominant_style": dominant_style,
        "final_style_percent": final_scores,
        "methods": methods
    }
