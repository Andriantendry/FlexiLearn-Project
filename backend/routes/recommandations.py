from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from google import genai
import os
from schemas import RecommendationRequest, RecommendationResponse

# CONFIG GEMINI
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY non défini")
client = genai.Client(api_key=API_KEY)


# ROUTER
router = APIRouter(prefix="/recommendation", tags=["Recommandations"])

# PROMPT DE GENERATION
def build_recommendation_prompt(profile: str, answers: List[str]) -> str:
    formatted_answers = "\n".join([f"- Réponse {i+1}: {a}" for i, a in enumerate(answers)])
    return f"""
Tu es un expert en pédagogie et en styles d’apprentissage (VAK).

Profil détecté : {profile}

Réponses de l’apprenant :
{formatted_answers}

Analyse demandée :
1. Vérifie la cohérence entre le profil et les réponses.
2. Identifie les forces d’apprentissage.
3. Identifie les difficultés potentielles.
4. Propose une méthode d’apprentissage personnalisée.
5. Donne 5 recommandations concrètes et applicables.

Réponds sous forme de liste courte, claire et concise.
"""

# ENDPOINT
@router.post("/", response_model=RecommendationResponse)
def get_recommendations(req: RecommendationRequest):
    try:
        prompt = build_recommendation_prompt(req.profile.upper(), req.answers)

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )

        # Transformer la réponse en liste (séparation par sauts de ligne ou tirets)
        raw_text = response.text.strip()
        recommendations = [
            line.strip("- ").strip()
            for line in raw_text.split("\n")
            if line.strip()
        ]

        return RecommendationResponse(recommendations=recommendations)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur Gemini: {str(e)}")
