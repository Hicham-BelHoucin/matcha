#type: ignore
# app/services/users/user.py
from ..query_builder import Model
from werkzeug.exceptions import InternalServerError, NotFound, BadRequest, Forbidden
import secrets
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()
import geocoder
from geopy.distance import geodesic
from flask import request
from ..notifications.service import NotificationService
from ..users.service import UserService


message_model = Model("Message")
dm_model = Model("Dm")
notification_service = NotificationService()
users_service = UserService()

class ChatService:
    def __init__(self):
        pass
    
    def find_dm(self, user_id, receiver_id):
        dm = dm_model.select().where(f"\"senderId\" = {user_id} AND \"receiverId\" = {receiver_id}").build().execute()
        if dm:
            return dm[0] if len(dm) > 0 else None
    
    def find_dm_by_id(self, dm_id):
        dm = dm_model.select().where(f"\"id\" = {dm_id}").build().execute()
        if dm:
            return dm[0] if len(dm) > 0 else None
    
    def find_or_create_dm(self, user_id, receiver_id):
        dm = self.find_dm(user_id, receiver_id)
        if dm:
            return dm
        else:
            return dm_model.insert({
                'senderId': user_id,
                'receiverId': receiver_id
            }).execute()[0]
    
    def create_message(self, user_id, receiver_id, message):
        user = users_service.get_user_by_id(receiver_id, user_id)
        if not user:
            raise NotFound('User not found!')
        if user['connected'] == False:
            raise BadRequest('You cannot send a message to a user that is not connected to you!')
        dm = self.find_or_create_dm(user_id, receiver_id)
        message = message_model.insert({
            'dmId': dm['id'],
            'content': message,
        }).execute()
        print('message:', user)
        username = user['username']
        notification_service.send_notification(receiver_id, f'You have a new message from {username}', "message")
        return message
    
    def get_messages(self, user_id, dm_id, limit, offset):
        dm = self.find_dm_by_id(dm_id)
        if not dm:
            raise NotFound('Direct message not found!')
        if user_id not in [dm['senderId'], dm['receiverId']]:
            raise Forbidden('You are not allowed to view this message!')
        include = [
            "id",
            "email",
            "username",
            "profilePictureUrl",
            "lastSeen",
        ]
        include_sender = ', '.join([f'\'{key}\', sender."{key}"' for key in include])
        include_receiver = ', '.join([f'\'{key}\', receiver."{key}"' for key in include])
        messages = message_model.select(
            "content",
            "sentAt",
            f'COALESCE(jsonb_agg(jsonb_build_object({include_sender})) FILTER (WHERE sender."id" IS NOT NULL), \'[]\') AS "sender"',
            f'COALESCE(jsonb_agg(jsonb_build_object({include_receiver})) FILTER (WHERE receiver."id" IS NOT NULL), \'[]\') AS "receiver"',
            ).where(f"m.\"dmId\" = {dm['id']}")\
            .join("Dm", "m.\"dmId\" = d.\"id\"", "LEFT")\
            .join("User", "d.\"senderId\" = sender.\"id\"", "LEFT", "sender")\
            .join("User", "d.\"receiverId\" = receiver.\"id\"", "LEFT", "receiver")\
            .limit(limit).offset(offset).group_by("m.\"id\"").build().execute()
        return messages
    
    def get_dms(self, user_id, limit, offset):
        include = [
            "id",
            "email",
            "username",
            "profilePictureUrl",
            "lastSeen",
        ]
        include_sender = ', '.join([f'\'{key}\', sender."{key}"' for key in include])
        include_receiver = ', '.join([f'\'{key}\', receiver."{key}"' for key in include])
        
        dms = dm_model.select(
            "id",
            "sentAt",
            f'COALESCE(jsonb_agg(jsonb_build_object({include_sender})) FILTER (WHERE sender."id" IS NOT NULL), \'[]\') AS "sender"',
            f'COALESCE(jsonb_agg(jsonb_build_object({include_receiver})) FILTER (WHERE receiver."id" IS NOT NULL), \'[]\') AS "receiver"',    
        )\
        .join("User", "d.\"senderId\" = sender.\"id\"", "LEFT", "sender")\
        .join("User", "d.\"receiverId\" = receiver.\"id\"", "LEFT", "receiver")\
        .group_by("d.\"id\"")\
        .where(f"\"senderId\" = {user_id} OR \"receiverId\" = {user_id}").limit(limit).offset(offset).build().execute()
        return dms