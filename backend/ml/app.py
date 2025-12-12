#test avec swagger
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import pickle
from typing import Dict

app = FastAPI(title="Test - Questions")

# Charger modèle et encoders séparément
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

with open("encoders.pkl", "rb") as f:
    encoders = pickle.load(f)

# Questions
QUESTIONS = [
    {
        "Question_ID": 1,
        "Question": "Quand j'apprends quelque chose de nouveau, je préfère :",
        "Option_A": "Regarder des vidéos ou des diagrammes",
        "Option_B": "Écouter des explications",
        "Option_C": "Lire des textes détaillés",
        "Option_D": "Pratiquer immédiatement",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 2,
        "Question": "Pour mémoriser un numéro de téléphone, je :",
        "Option_A": "Le visualise mentalement",
        "Option_B": "Le répète à voix haute",
        "Option_C": "L'écris plusieurs fois",
        "Option_D": "Le compose sur un clavier",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 3,
        "Question": "Lors d'une présentation, je retiens mieux quand :",
        "Option_A": "Il y a des graphiques et images",
        "Option_B": "L'orateur explique clairement",
        "Option_C": "Je peux prendre des notes",
        "Option_D": "Je peux manipuler des objets ou faire des exercices",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 4,
        "Question": "Pour assembler un meuble, je préfère :",
        "Option_A": "Suivre les schémas illustrés",
        "Option_B": "Demander conseil à quelqu'un",
        "Option_C": "Lire attentivement les instructions",
        "Option_D": "Essayer directement sans instructions",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 5,
        "Question": "Quand je dois retrouver mon chemin, j'utilise surtout :",
        "Option_A": "Des repères visuels (bâtiments, couleurs)",
        "Option_B": "Les indications verbales données",
        "Option_C": "Une carte ou un plan écrit",
        "Option_D": "Mon sens de l'orientation et mes déplacements",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 6,
        "Question": "Pour réviser un examen, je :",
        "Option_A": "Utilise des cartes mentales et surligneurs colorés",
        "Option_B": "Discute du sujet avec d'autres ou m'enregistre",
        "Option_C": "Relis mes notes et fais des fiches",
        "Option_D": "Fais des exercices pratiques et simulations",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 7,
        "Question": "En réunion ou en cours, je suis plus concentré quand :",
        "Option_A": "Je vois des supports visuels projetés",
        "Option_B": "J'écoute activement la discussion",
        "Option_C": "Je prends des notes détaillées",
        "Option_D": "Je peux bouger ou manipuler quelque chose",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 8,
        "Question": "Pour apprendre une langue étrangère, je préfère :",
        "Option_A": "Regarder des films sous-titrés",
        "Option_B": "Écouter des podcasts et conversations",
        "Option_C": "Étudier la grammaire et le vocabulaire écrit",
        "Option_D": "Pratiquer en parlant avec des natifs",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 9,
        "Question": "Quand quelqu'un m'explique un concept, je comprends mieux si :",
        "Option_A": "Il dessine un schéma ou montre un exemple",
        "Option_B": "Il me l'explique verbalement",
        "Option_C": "Il m'envoie un document écrit à lire",
        "Option_D": "Il me laisse l'expérimenter moi-même",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 10,
        "Question": "Pour me détendre, je préfère :",
        "Option_A": "Regarder un film ou des images",
        "Option_B": "Écouter de la musique ou des podcasts",
        "Option_C": "Lire un livre ou un article",
        "Option_D": "Faire du sport ou une activité manuelle",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 11,
        "Question": "Quand j'explique quelque chose aux autres, je :",
        "Option_A": "Fais des dessins ou montre des exemples",
        "Option_B": "Explique verbalement avec des mots",
        "Option_C": "Écris ou envoie des instructions détaillées",
        "Option_D": "Montre comment faire en pratiquant",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 12,
        "Question": "Pour me souvenir d'une expérience passée, je me rappelle surtout :",
        "Option_A": "Les images et les scènes visuelles",
        "Option_B": "Les sons et les conversations",
        "Option_C": "Les détails et descriptions précises",
        "Option_D": "Les sensations et mouvements physiques",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 13,
        "Question": "Lors d'un débat ou discussion, je suis convaincu par :",
        "Option_A": "Des graphiques et données visuelles",
        "Option_B": "Des arguments bien articulés à l'oral",
        "Option_C": "Des preuves et textes écrits",
        "Option_D": "Des démonstrations concrètes",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 14,
        "Question": "Pour résoudre un problème complexe, je :",
        "Option_A": "Dessine un diagramme ou schéma",
        "Option_B": "Discute avec d'autres pour trouver des idées",
        "Option_C": "Liste par écrit les étapes et solutions",
        "Option_D": "Teste différentes approches pratiques",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    },
    {
        "Question_ID": 15,
        "Question": "Quand j'utilise un nouvel appareil ou logiciel, je :",
        "Option_A": "Regarde un tutoriel vidéo",
        "Option_B": "Demande à quelqu'un de m'expliquer",
        "Option_C": "Lis le manuel d'utilisation",
        "Option_D": "Explore en cliquant et essayant",
        "Profil_A": "Visuel",
        "Profil_B": "Auditif",
        "Profil_C": "Lecture/Écriture",
        "Profil_D": "Kinesthésique"
    }
]


@app.get("/quiz")
def get_quiz():
    return {"questions": QUESTIONS}

class QuizInput(BaseModel):
    answers: Dict[int, str]

@app.post("/predict")
def predict(quiz: QuizInput):
    ans = quiz.answers
    if len(ans) != 15:
        raise HTTPException(status_code=400, detail="Il faut 15 réponses (1..15)")

    df = pd.DataFrame([{f"Q{i}": ans[i] for i in range(1,16)}])

    # Encoder
    for col in df.columns:
        if df[col][0] not in encoders[col].classes_:
            raise HTTPException(status_code=400, detail=f"Réponse invalide pour {col}: {df[col][0]}")
        df[col] = encoders[col].transform(df[col])

    # Prédiction
    pred = model.predict(df)[0]
    probas = model.predict_proba(df)[0]
    proba_dict = dict(zip(model.classes_, probas))
    proba_dict = {profil: round(p*100, 2) for profil, p in zip(model.classes_, probas)}

    return {
        "profil_dominant": pred,
        "statistiques en pourcentage": proba_dict
    }
