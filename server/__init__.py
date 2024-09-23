# server/__init__.py
import os
from flask import Flask
from .services.query_builder import Model
from .controllers.users.controller import users
from .controllers.auth.controller import auth
from .controllers.chat.controller import chat
from flask import Flask, request, jsonify
from .config import Config
from marshmallow import ValidationError
from server.services.notifications.service import socketio

def create_app(test_config=None):
    
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)


    if test_config:
        app.config.update(test_config)

    app.register_blueprint(users, url_prefix='/users')
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(chat, url_prefix='/chat')
    
    # Initialize socketio with the Flask app
    socketio.init_app(app)


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
    
    @app.errorhandler(404)
    def not_found(error):
        return {
            'error': 'Not Found',
            'message': error.description,
        }, 404
    
    @app.errorhandler(400)
    def bad_request(error):
        return {
            'error': 'Bad Request',
            'message': error.description,
        }, 400
        
    @app.errorhandler(403)
    def forbidden(error):
        return {
            'error': 'Forbidden',
            'message': error.description,
        }, 403
    
    return app

# Automatically run the app if this module is the entry point
if __name__ == "__main__":
    app = create_app()
    socketio.run(app)