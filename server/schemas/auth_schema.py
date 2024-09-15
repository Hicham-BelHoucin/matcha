from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import datetime

# Define the validation schema
class LoginSchema(Schema):
    # check if email and password are provided and are not empty also check if email is valid
    email = fields.Email(required=True, validate=validate.Length(min=1))
    password = fields.Str(required=True, validate=validate.Length(min=1))
    
    
class RegisterSchema(Schema):
    # check if email, username, password, first name, last name and birth date are provided and are not empty also check if email is valid
    email = fields.Email(required=True, validate=validate.Length(min=1))
    username = fields.Str(required=True, validate=validate.Length(min=1))
    password = fields.Str(required=True, validate=validate.Length(min=1))
    firstName = fields.Str(required=True, validate=validate.Length(min=1))
    lastName = fields.Str(required=True, validate=validate.Length(min=1))
    birthDate = fields.Date(required=True)
    # gender should be either Male or Famele or other
    gender = fields.Str(required=True)
    location = fields.Str()
    biography = fields.Str()
    profilePictureUrl = fields.Str()
    sexualPreferences = fields.Str()
    gpsLatitude = fields.Float()
    gpsLongitude = fields.Float()

class ResetPasswordSchema(Schema):
    # check if email is provided and is not empty also check if email is valid
    email = fields.Email(required=True, validate=validate.Length(min=1))
    
class ChangePasswordSchema(Schema):
    # check if email, code and password are provided and are not empty also check if email is valid
    email = fields.Email(required=True, validate=validate.Length(min=1))
    code = fields.Int(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=1))