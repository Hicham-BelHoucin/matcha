from flask import Blueprint, request, current_app
from server.services.users.service import User, verify_token, generate_verification_link
from server.schemas.user_schema import UserSchema
from werkzeug.exceptions import NotFound
from marshmallow import ValidationError
from flask_bcrypt import Bcrypt

users = Blueprint('users', __name__)

@users.route('/', methods=['GET'])
def get_all_users():
    try:
        return User.get_users()
    except Exception as e:
        return {"message": e.description}, 500

@users.route('/', methods=['POST'])
def create_user():
    schema = UserSchema()
    try:
        data = schema.load(request.json)
        return User.create_user(data)
    except ValidationError as e:
        custom_errors = {field: f"Invalid value for {field}: {', '.join(messages)}" 
                             for field, messages in e.messages.items()}
        return {'errors': custom_errors}, 400
    except Exception as e:
        return {"message": e.description}, 500
    
@users.route('/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    try:
        return User.get_user_by_id(user_id)
    except NotFound as e:
        return {"message": e.description}, 404
    except Exception as e:
        return {"message": e.description}, 500
    
@users.route('/verify/<token>', methods=['GET'])
def verify_account(token):
    print(token)
    
    user_id = 1
    
    # print(user_id)
    # if user_id:
    #     # Mark user as verified in the database
    #     return "Account verified successfully!"
    # else:
    #     return "Verification link is invalid or expired."
    return verify_token(user_id ,token)
    
@users.route('/token', methods=['GET'])
def generate_token():
    # user_id = request.args.get('user_id')
    user_id = 1
    return generate_verification_link(user_id,"http://127.0.0.1:5000", current_app.config['JWT_SECRET_KEY'])