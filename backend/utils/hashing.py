from passlib.context import CryptContext 
import dns.resolver

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

"""_hashage de mot de passe_
"""
def hash_password(password : str ):
    return pwd_context.hash(password)

"""_vérifier si les mots de passe correspondent_
"""
def verify_password(plain_paswword,hashed_password):
    return pwd_context.verify(plain_paswword,hashed_password) 

"""_verfiier si le mail existe vraiment 
"""
def check_email_domain(email: str):
    domain = email.split("@")[1]
    try:
        dns.resolver.resolve(domain, "MX")
        return True
    except:
        return False