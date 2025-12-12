import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import pickle

# Charger dataset
df = pd.read_csv("dataset.csv")

# entree et sortie
X = df[[f"Q{i}" for i in range(1,16)]].copy()
y = df["Profil_Dominant"]

# Encoder les réponses
encoders = {}
for col in X.columns:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    encoders[col] = le

# Split train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Entraîner le modele
model = LogisticRegression(max_iter=1000, random_state=42)
model.fit(X_train, y_train)

# Évaluer modèle
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print(f"Precision: {precision_score(y_test, y_pred, average='macro'):.2f}")
print(f"Recall: {recall_score(y_test, y_pred, average='macro'):.2f}")
print(f"F1-score: {f1_score(y_test, y_pred, average='macro'): .2f}")


# Sauvegarder modèle et encoders séparément
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("encoders.pkl", "wb") as f:
    pickle.dump(encoders, f)

print("\nModèle sauvegardé")
