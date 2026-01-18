from fastapi import APIRouter, HTTPException
import pandas as pd
import pickle
from pathlib import Path
from schemas import QuizInput
import json



router = APIRouter()

# Charger modèle et encoders au démarrage
BASE_DIR = Path(__file__).resolve().parent

with open(BASE_DIR / "model_vak.pkl", "rb") as f:
    model = pickle.load(f)

with open(BASE_DIR / "encoders_vak.pkl", "rb") as f:
    encoders = pickle.load(f)

with open(BASE_DIR / "quizz.json", "r", encoding="utf-8") as f:
    QUESTIONS = json.load(f)


@router.get("/quiz") #afaka antsoina any am front fotsiny
def get_quiz():
    return {"questions": QUESTIONS}


# Route de prédiction
@router.post("/predict")
def predict(quiz: QuizInput):
    ans = quiz.answers
    if len(ans) != 20:
        raise HTTPException(status_code=400, detail="Il faut 20 réponses (1..20)")

    df = pd.DataFrame([{f"Q{i}": ans[i] for i in range(1,21)}])

    # Encodage
    for col in df.columns:
        if df[col][0] not in encoders[col].classes_:
            raise HTTPException(status_code=400, detail=f"Réponse invalide pour {col}: {df[col][0]}")
        df[col] = encoders[col].transform(df[col])

    # Prédiction
    pred = model.predict(df)[0]
    probas = model.predict_proba(df)[0]
    proba_dict = {profil: round(p*100, 2) for profil, p in zip(model.classes_, probas)}

    return {
        "profile": pred,
        "statistiques": proba_dict
    }
