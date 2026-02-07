import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def send_verification_email(to_email, code):
    msg = EmailMessage()
    msg["Subject"] = "Code de confirmation"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg.set_content(f"""
Bonjour ,

Bienvenue sur FlexiLearn 

Merci de t’être inscrit sur notre plateforme.
Pour confirmer ton adresse email, merci d’entrer le code suivant dans l’application :

========================
   CODE DE CONFIRMATION
        {code}
========================

⏳ Ce code est valable pour une courte durée.
Si tu n’es pas à l’origine de cette inscription, tu peux ignorer ce message.

À très bientôt sur FlexiLearn !
L’équipe FlexiLearn 
""")


    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)

