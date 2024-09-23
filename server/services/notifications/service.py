from flask_socketio import SocketIO, join_room
from flask import request
import jwt
from flask import current_app, request, jsonify
from jwt import ExpiredSignatureError, InvalidTokenError  # Correct import
import pytz
from server.services.query_builder import Model
from werkzeug.exceptions import InternalServerError, NotFound, Unauthorized

notification_model = Model("Notification")
socketio = SocketIO()

def decode_token(token):
    """Decode JWT token."""
    try:
        return jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
    except ExpiredSignatureError:
        raise Unauthorized('Token has expired!')
    except InvalidTokenError:
        raise Unauthorized('Invalid token!')

class NotificationService:
    def __init__(self):
        pass
    
    def get_notifications(self, user_id, limit, offset):
        notification = notification_model.select(
            "content",
            "createdAt",
            "id",
            "type",
            "u.\"firstName\"",
            "u.\"lastName\"",
            "u.\"email\"",
            "u.\"profilePictureUrl\"",
            "u.\"fameRating\"",
            ).where(f"\"userId\"= {user_id}")\
        .join("User", "n.\"userId\" = u.\"id\"", "LEFT")\
        .limit(limit).offset(offset).build().execute()
        return notification
    
    def create_notification(self, type, content, user_id):
        """
        Create a new notification.
        Args:
            type (str): Notification type.
            content (str): Notification content.
            user_id (int): User ID.

        Raises:
            InternalServerError: If an error occurs while inserting the notification.

        Returns:
            dict: The inserted notification
        """
        try:
            notification = notification_model.insert({
                'type': type,
                'content': content,
                'userId': user_id
                }).execute()
            return notification[0]
        except Exception as e:
            raise InternalServerError(str(e))

    def send_notification(self, user_id, message, type):
        """
        Send a notification to a user.
        Args:
            user_id (int): User ID.
            message (str): Notification message.
            type (str): Notification type.
            
        Returns:
            None
        """
        notification = self.create_notification(type, message, user_id)
        
        socketio.emit('notification', {'message': jsonify(notification).json}, to=user_id)
        
    
    @socketio.on('connect')
    def handle_connect():
        auth_header = request.headers.get('Authorization')
        token = auth_header.split(' ')[1] if auth_header and auth_header.find(' ') != -1 else None
        if not token:
            return False  # Reject connection if token is missing

        payload = decode_token(token)
        
        # create a new room for the user
        room = payload['user_id']
        join_room(room)
        return True