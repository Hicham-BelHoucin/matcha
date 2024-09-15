from flask import Blueprint, request
from werkzeug.exceptions import NotFound
from marshmallow import ValidationError
from server.schemas.auth_schema import LoginSchema, RegisterSchema, ResetPasswordSchema, ChangePasswordSchema
from server.services.auth.service import Auth

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    schema = LoginSchema()
    try:
        data = schema.load(request.json)
        return Auth.login(data['email'], data['password'])
    except ValidationError as e:
        custom_errors = {field: f"Invalid value for {field}: {', '.join(messages)}" 
                             for field, messages in e.messages.items()}
        return {'errors': custom_errors}, 400
    
@auth.route('/register', methods=['POST'])
def register():
    schema = RegisterSchema()
    try:
        data = schema.load(request.json)
        return Auth.register(data)
    except ValidationError as e:
        custom_errors = {field: f"Invalid value for {field}: {', '.join(messages)}" 
                             for field, messages in e.messages.items()}
        return {'errors': custom_errors}, 400
    
@auth.route('/reset-password', methods=['POST'])
def reset_password():
    schema = ResetPasswordSchema()
    try:
        data = schema.load(request.json)
        return Auth.reset_password(email=data['email'])
    except ValidationError as e:
        custom_errors = {field: f"Invalid value for {field}: {', '.join(messages)}" 
                             for field, messages in e.messages.items()}
        return {'errors': custom_errors}, 400
    
    
@auth.route('/change-password', methods=['POST'])
def change_password():
    schema = ChangePasswordSchema()
    try:
        data = schema.load(request.json)
        return Auth.change_password(data['email'], data['code'], data['password'])
    except ValidationError as e:
        custom_errors = {field: f"Invalid value for {field}: {', '.join(messages)}" 
                             for field, messages in e.messages.items()}
        return {'errors': custom_errors}, 400