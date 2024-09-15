import jwt
import functools
from datetime import datetime, timedelta
from flask import current_app
from jwt import ExpiredSignatureError, InvalidTokenError  # Correct import
import pytz

def generate_token(user_id):
    """Generate a new JWT token."""
    expiration = datetime.utcnow() + timedelta(hours=24)  # Use utcnow() for UTC time
    return jwt.encode({
        'user_id': user_id,
        'exp': expiration
    }, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

def decode_token(token):
    """Decode JWT token."""
    try:
        return jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
    except ExpiredSignatureError:
        return {'message': 'Token has expired!'}, 401
    except InvalidTokenError:
        return {'message': 'Invalid token!'}, 401

# def login_required(func):
#     @functools.wraps(func)
#     def secure_function(*args, **kwargs):
#         # Extract token from header and strip "Bearer " if present
#         auth_header = request.headers.get('Authorization')
#         if auth_header and auth_header.startswith('Bearer '):
#             token = auth_header[len('Bearer '):]
#         else:
#             return {'message': 'Token is missing or malformed!'}, 401
        
#         decoded = decode_token(token)
#         if isinstance(decoded, dict) and 'message' in decoded:
#             return decoded
        
#         # Token is valid; pass control to the protected function
#         return func(*args, **kwargs)

#     return secure_function