from passlib.context import CryptContext 

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# """_hashage de mot de passe_
# """
# def hash_password(password : str ):
#     return pwd_context.hash(password)

# """_vérifier si les mots de passe correspondent_
# """
# def verify_password(plain_password,hashed_password):
#     return pwd_context.verify(plain_password,hashed_password)

"""_utilisation de passlib[argon2] """

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)