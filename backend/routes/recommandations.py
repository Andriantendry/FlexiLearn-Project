import os
import json
import requests
from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from typing import Dict, List

app = FastAPI()
router = APIRouter()

API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = "https://api.generativeai.googleapis.com/v1beta2/models/text-bison-001:generateText"


# --------- MODELE ---------
class RecommendationRequest(BaseModel):
    user_answers: Dict[str, List[str]]
    style_result: Dict[str, int]


# --------- FALLBACK METHODES ---------
METHODS_BY_STYLE = {
    "visuel": [
        "Faire des schémas et cartes mentales",
        "Utiliser des images et des couleurs",
        "Regarder des vidéos explicatives"
    ],
    "auditif": [
        "Écouter des explications audio",
        "Répéter à voix haute",
        "Discuter avec quelqu’un"
    ],
    "kinesthesique": [
        "Apprendre en pratiquant",
        "Faire des exercices concrets",
        "Bouger ou manipuler"
    ]
}


@router.post("/recommendation")
def get_recommendation(payload: RecommendationRequest):

    # ---------- 1️⃣ SOURCE DE VÉRITÉ ----------
    final_scores = {
        "visuel": payload.style_result.get("visuel", 0),
        "auditif": payload.style_result.get("auditif", 0),
        "kinesthesique": payload.style_result.get("kine", 0),
    }

    # sécurité si test cassé
    if sum(final_scores.values()) == 0:
        final_scores = {
            "visuel": 40,
            "auditif": 30,
            "kinesthesique": 30
        }

    dominant_style = max(final_scores, key=final_scores.get)

    # ---------- 2️⃣ GEMINI (OPTIONNEL) ----------
    methods = METHODS_BY_STYLE[dominant_style]

    if API_KEY:
        prompt = f"""
Tu es un expert en pédagogie.
Style dominant : {dominant_style}

Retourne UNIQUEMENT une liste JSON de 3 méthodes adaptées.
Exemple :
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
                    "maxOutputTokens": 200
                },
                timeout=10
            )

            response.raise_for_status()
            content = response.json()["candidates"][0]["content"]
            parsed = json.loads(content)

            if isinstance(parsed, list) and len(parsed) >= 2:
                methods = parsed

        except Exception:
            pass  # fallback auto

    # ---------- 3️⃣ REPONSE FINALE ----------
    return {
        "dominant_style": dominant_style,
        "final_style_percent": final_scores,
        "methods": methods
    }


app.include_router(router)
