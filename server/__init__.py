import os
from flask import Flask
from .services.query_builder import Model
from .controllers.users.controller import users
from .controllers.auth.controller import auth
from flask import Flask, request, jsonify
from .config import Config
from marshmallow import ValidationError

# create and configure the app
app = Flask(__name__, instance_relative_config=True)
app.config.from_object(Config)

app.register_blueprint(users, url_prefix='/users')
app.register_blueprint(auth, url_prefix='/auth')

@app.errorhandler(ValidationError)
def handle_validation_error(error):
    custom_errors = {field: f"Invalid value for {field}: {', '.join(messages)}" 
                             for field, messages in error.messages.items()}
    return {'errors': custom_errors}, 400

@app.errorhandler(401)
def unauthorized(error):
    return {
        'error': 'Unauthorized',
        'message': error.description,
    }, 401
    
@app.errorhandler(500)
def internal_server_error(error):
    return {
        "error": "Internal Server Error",
        "message": error.description
    }, 500
    
# # Handle any other Exception (optional)
# @app.errorhandler(Exception)
# def handle_exception(e):
#     # Handle specific known exceptions differently if you want
#     if isinstance(e, KeyError):
#         return {
#             "error": "KeyError",
#             "message": str(e)
#         }, 400
    
    
#     message = getattr(e, 'description', str(e))
#     error = str(e).split(":")[0]
#     # Generic catch-all for other unhandled exceptions
#     return {
#         "error": error,
#         "message": message
#     }, 500

if __name__ == '__main__':
    app.run(debug=True)