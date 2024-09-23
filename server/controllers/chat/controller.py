# type: ignore
from flask import Blueprint, request, current_app
from server.services.chat.service import ChatService
from server.schemas.chat_schema import DmSchema, MessageSchema
from werkzeug.exceptions import NotFound
from marshmallow import ValidationError
from flask_bcrypt import Bcrypt
from server.services.auth.tools import decode_token, generate_token, login_required

chat = Blueprint('chat', __name__)
chat_service = ChatService()

@chat.route('/message', methods=['POST'])
@login_required
def create_message(user_id):
    schema = MessageSchema()
    data = schema.load(request.json)
    return chat_service.create_message(user_id, data['receiverId'], data['content'])

@chat.route('/dm', methods=['GET'])
@login_required
def get_dms(user_id):
    limit = request.args.get('limit', default=50, type=int)
    offset = request.args.get('offset', default=0, type=int)
    return chat_service.get_dms(user_id, limit, offset)

@chat.route('/dm/<int:dm_id>/messages', methods=['GET'])
@login_required
def get_messages(user_id, dm_id):
    limit = request.args.get('limit', default=50, type=int)
    offset = request.args.get('offset', default=0, type=int)
    return chat_service.get_messages(user_id, dm_id, limit, offset)