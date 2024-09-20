from flask_socketio import SocketIO, ConnectionRefusedError, join_room
from flask import request
from ..auth.tools import generate_token, decode_token

socketio = SocketIO()


@socketio.on('connect')
def handle_connect():
    token = request.headers.get('Authorization').split(' ')[1]  # Extract token from header
    if not token:
        return False  # Reject connection if token is missing

    payload = decode_token(token)

    print('User connected:', payload)
    
    # create a new room for the user
    room = payload['user_id']
    join_room(room)
    return True

def send_notification(user_id, message):
    socketio.emit('notification', {'message': message}, room=user_id)