# app/services/users/user.py
from werkzeug.exceptions import InternalServerError, NotFound, Unauthorized
from ..users.service import User, hash_password, check_password
from .tools import generate_token, decode_token
import random

def generate_reset_code():
    reset_code = random.randint(100000, 999999)  # Generate a random 6-digit number
    return reset_code

class Auth:
    def login(email, password):
        try: 
            user = User.get_user_by_email(email)
            if not user:
                raise NotFound("User not found")
            if not check_password(password, user['password']):
                raise Unauthorized("Invalid password")
            access_token = generate_token(user['id'])
            return {"access_token": str(access_token)}, 200
        except InternalServerError as e:
            return {"message": e.description}, 500

    
    def register(fields):
        try:
            user = User.get_user_by_email(fields['email'])
            if user:
                raise InternalServerError("User already exists")
            user = User.create_user(fields)
            return user, 201
        except InternalServerError as e:
            return {"message": e.description}, 500
        except Exception as e:
            return {"message": e}, 500
        
    def reset_password(email):
        try:
            code = generate_reset_code()
            user = User.get_user_by_email(email)
            if not user:
                raise NotFound("User not found")
            User.update_user(user['id'], {"code": code})
            return {"message": "Reset code is valid", "code" : code}, 200
        except Exception as e:
            return {"message": str(e)}, 500
        
    def change_password(email, code,password):
        user = User.get_user_by_email(email)
        if not user:
            raise NotFound("User not found")
        print(user['code'], code)
        if user['code'] != str(code):
            raise Unauthorized("Invalid reset code")
        User.update_user(user['id'], {"password": hash_password(password)})
        return {"message": "Password updated successfully"}, 200