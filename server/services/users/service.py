# app/services/users/user.py
from ..query_builder import Model
from werkzeug.exceptions import InternalServerError, NotFound
import secrets
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()

user_model = Model("User")

# Generate a unique token
def generate_token(user_id, secret_key):
    token = secrets.token_urlsafe()
    User.update_user(user_id, {"verification_token": token})
    # genrate a token using the user_id and secret_key
    return token

# Create a verification link
def generate_verification_link(user_id, base_url, secret_key):
    # # to do: add the user_id to the link
    return f"{base_url}/users/verify/{generate_token(user_id, secret_key)}"
    
# Function to verify the token
def verify_token(user_id, token):
    user = User.get_user_by_id(user_id)
    print(user)
    if not user or user['verification_token'] != token:
        return {"message": "Verification link is invalid."}, 400
    User.update_user(user_id, {"isVerified": 'true'})
    return {"message": "Account verified successfully!"}, 200

def hash_password(password):
    # Hash the password using bcrypt
    return bcrypt.generate_password_hash(password).decode('utf-8')

def check_password(password, hashed_password):
    # Check if the password matches the hashed password
    return bcrypt.check_password_hash(hashed_password, password)

class User:
    def get_users():
        users = user_model.select(
            "id",
            "email",
            "username",
            "lastName",
            "firstName",
            "gender",
            "sexualPreferences",
            "profilePictureUrl",
            "biography",
            "location",
            "fameRating",
            "gpsLatitude",
            "gpsLongitude",
            "lastSeen",
            "birthDate",
        ).build().execute()
        return users
    
    def get_user_by_id(user_id):
        user = user_model.select("*").where(f'u."id" = {user_id}').build().execute()
        if (len(user) == 0): 
            raise NotFound(f"user with id {user_id} not found")
        return user[0] if len(user) > 0 else None
    
    def get_user_by_email(email):
        user = user_model.select("*").where(f'u."email" = \'{email}\'').build().execute()
        return user[0] if len(user) > 0 else None
    
    def get_user_by_username(username):
        user = user_model.select("*").where(f'u."username" = {username}').build().execute()
        return user[0] if len(user) > 0 else None
    
    def create_user(fields):
        fields["password"] = hash_password(fields["password"])
        user = user_model.insert(fields).execute()
        return user
    
    def update_user(user_id, fields):
        user = user_model.update(fields).where(f'"id" = {user_id}').build().execute()
        print('updated user', user)
        return user
    
    def delete_user(user_id):
        user = user_model.delete().where(f'u."id" = {user_id}').build().execute()
        return user
    
    def verify_user(user_id):
        user = user_model.update({"verified": True}).where(f'u."id" = {user_id}').build().execute()
        return user
    
    
    
    # def like_user(user_id, liked_user_id):
    #     user = user_model.insert("user_id", "liked_user_id").values(user_id, liked_user_id).build().execute()
    #     return user
    
    # def unlike_user(user_id, liked_user_id):
    #     user = user_model.delete().where(f'u."user_id" = {user_id} AND u."liked_user_id" = {liked_user_id}').build().execute()
    #     return user
    