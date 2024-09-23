# type: ignore
from flask import Blueprint, request, current_app
from server.services.users.service import UserService
from server.schemas.user_schema import UserSchema, ReportUserSchema
from werkzeug.exceptions import NotFound
from marshmallow import ValidationError
from flask_bcrypt import Bcrypt
from server.services.auth.tools import decode_token, generate_token, login_required

users = Blueprint('users', __name__)
users_service = UserService()

@users.route('/', methods=['GET'])
@login_required
def get_all_users(user_id):
    limit = request.args.get('limit', default=50, type=int)
    offset = request.args.get('offset', default=0, type=int)
    return users_service.get_users(user_id, limit, offset)
    
    
@users.route('/<int:id>', methods=['GET'])
@login_required
def get_user_by_id(user_id, id):
    try:
        return users_service.get_user_by_id(id, viewed_by=user_id)
    except NotFound as e:
        return {"message": e.description}, 404
    
@users.route('/verify/<token>', methods=['GET'])
@login_required
def verify_account(token, user_id):
    return users_service.verify_token(user_id ,token)
    
@users.route('/token', methods=['GET'])
@login_required
def generate_token(user_id):
    return users_service.generate_verification_link(user_id,"http://127.0.0.1:5000", current_app.config['JWT_SECRET_KEY'])


@users.route('/profile', methods=['GET'])
@login_required
def get_profile(user_id):
    return users_service.get_user_by_id(user_id)

@users.route('/profile', methods=['PUT'])
@login_required
def update_profile(user_id):
    schema = UserSchema()
    try:
        data = schema.load(request.json)
        return users_service.update_user(user_id, data)
    except ValidationError as e:
        custom_errors = {field: f"Invalid value for {field}: {', '.join(messages)}" 
                             for field, messages in e.messages.items()}
        return {'errors': custom_errors}, 400
    
@users.route('/profile', methods=['DELETE'])
@login_required
def delete_profile(user_id):
    return users_service.delete_user(user_id)

@users.route('/<int:liked_user_id>/like', methods=['POST'])
@login_required
def like_user(user_id, liked_user_id):
    return users_service.like_user(user_id, liked_user_id)

@users.route('/<int:liked_user_id>/unlike', methods=['POST'])
@login_required
def unlike_user(user_id, liked_user_id):
    return users_service.unlike_user(user_id, liked_user_id)

@users.route('/<int:blocked_user_id>/block', methods=['POST'])
@login_required
def block_user(user_id, blocked_user_id):
    return users_service.block_user(user_id, blocked_user_id)

@users.route('/<int:blocked_user_id>/unblock', methods=['POST'])
@login_required
def unblock_user(user_id, blocked_user_id):
    return users_service.unblock_user(user_id, blocked_user_id)

@users.route('/<int:visited_user_id>/visit', methods=['POST'])
@login_required
def visit_user(user_id, visited_user_id):
    return users_service.visit_user(user_id, visited_user_id)

@users.route('/report', methods=['POST'])
@login_required
def report_user(user_id):
    schema = ReportUserSchema()
    try:
        data = schema.load(request.json)
        return users_service.report_user(user_id, data.get('reported_user_id'), data.get('reason'))
    except ValidationError as e:
        custom_errors = {field: f"Invalid value for {field}: {', '.join(messages)}" 
                             for field, messages in e.messages.items()}
        return {'errors': custom_errors}, 400
    
@users.route('/visit', methods=['GET'])
@login_required
def get_visits(user_id):
    limit = request.args.get('limit', default=50, type=int)
    offset = request.args.get('offset', default=0, type=int)
    return users_service.get_user_visits(user_id,   limit, offset)

@users.route('/like', methods=['GET'])
@login_required
def get_likes(user_id):
    return users_service.get_user_likes(user_id)

@users.route('/block', methods=['GET'])
@login_required
def get_blocks(user_id):
    limit = request.args.get('limit', default=50, type=int)
    offset = request.args.get('offset', default=0, type=int)
    return users_service.get_user_blocked(user_id, limit, offset)

@users.route('/report', methods=['GET'])
@login_required
def get_reports(user_id):
    limit = request.args.get('limit', default=50, type=int)
    offset = request.args.get('offset', default=0, type=int)
    return users_service.get_user_reports(user_id,  limit, offset)

@users.route('/search', methods=['GET'])
@login_required
def search_users(user_id):
    username = request.args.get('username', default='', type=str)
    sort = request.args.get('sort', default=None, type=str)
    fame_rating_filter = request.args.get('filter[fameRating]', default=None, type=str)
    tags_filter = request.args.get('filter[tags]', default=None, type=str)
    age_filter = request.args.get('filter[age]', default=None, type=str)
    location_filter = request.args.get('filter[location]', default=None, type=str)
    limit = request.args.get('limit', default=50, type=int)
    offset = request.args.get('offset', default=0, type=int)
    print('limit:', username)
    
    return users_service.search(user_id, username, limit, offset, str(sort).split(','), {
        'fame_rating': fame_rating_filter,
        'tags': tags_filter,
        'age': age_filter,
        'location': location_filter
    })
    

@users.route('/suggestoins', methods=['GET'])
@login_required
def get_suggestions(user_id):
    # Get query parameters
    sort = request.args.get('sort', default=None, type=str)
    fame_rating_filter = request.args.get('filter[fameRating]', default=None, type=str)
    tags_filter = request.args.get('filter[tags]', default=None, type=str)
    age_filter = request.args.get('filter[age]', default=None, type=str)
    location_filter = request.args.get('filter[location]', default=None, type=str)
    limit = request.args.get('limit', default=50, type=int)
    offset = request.args.get('offset', default=0, type=int)
    return users_service.suggestions(user_id, limit, offset, str(sort).split(','), {
        'fame_rating': fame_rating_filter,
        'tags': tags_filter,
        'age': age_filter,
        'location': location_filter
    })
    
@users.route('/notifications', methods=['GET'])
@login_required
def get_notifications(user_id):
    limit = request.args.get('limit', default=50, type=int)
    offset = request.args.get('offset', default=0, type=int)
    return users_service.get_user_notifications(user_id, limit, offset)