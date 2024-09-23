from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import datetime
        
class DmSchema(Schema):
    receiverId = fields.Int(required=True, validate=validate.Range(min=1))

class MessageSchema(Schema):
    content = fields.Str(required=True, validate=validate.Length(min=1))
    receiverId = fields.Int(required=True, validate=validate.Range(min=1))