# app/services/users/user.py
from ..query_builder import Model
from werkzeug.exceptions import InternalServerError, NotFound
import secrets
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()

user_model = Model("User")
like_model = Model("Like")
report_model = Model("Report")
block_model = Model("Block")
visit_model = Model("Visit")

class UserService:
    def __init__(self):
        pass
    
    @staticmethod
    def hash_password(password):
        # Hash the password using bcrypt
        return bcrypt.generate_password_hash(password).decode('utf-8')
    
    @staticmethod
    def check_password(password, hashed_password):
        # Check if the password matches the hashed password
        return bcrypt.check_password_hash(hashed_password, password)
    
    # Generate a unique token
    def generate_token(self, user_id, secret_key):
        token = secrets.token_urlsafe()
        self.update_user(user_id, {"verification_token": token})
        # genrate a token using the user_id and secret_key
        return token

    # Create a verification link
    def generate_verification_link(self, user_id, base_url, secret_key):
        # # to do: add the user_id to the link
        return f"{base_url}/users/verify/{self.generate_token(user_id, secret_key)}"
        
    # Function to verify the token
    def verify_token(self, user_id, token):
        user = self.get_user_by_id(user_id)
        print(user)
        if not user or user['verification_token'] != token:
            return {"message": "Verification link is invalid."}, 400
        self.update_user(user_id, {"isVerified": 'true'})
        return {"message": "Account verified successfully!"}, 200

    

    def get_users(self):
        users = user_model.select(
            "id",
            "email",
            "username",
            "lastName",
            "firstName",
            "gender",
            "sexualPreferences",
            "profilePictureUrl",
            "biography",
            "location",
            "fameRating",
            "gpsLatitude",
            "gpsLongitude",
            "lastSeen",
            "birthDate",
            "interests",
        ).build().execute()
        return users
    
    def get_user_by_id(self, user_id):
        user = user_model.select("id",
            "email",
            "username",
            "lastName",
            "firstName",
            "gender",
            "sexualPreferences",
            "profilePictureUrl",
            "biography",
            "location",
            "fameRating",
            "gpsLatitude",
            "gpsLongitude",
            "lastSeen",
            "birthDate",
            "interests",
            f'COALESCE(jsonb_agg(jsonb_build_object(\'pictureId\', p."id", \'url\', p."url", \'isProfile\',p."isProfile")) FILTER (WHERE p."id" IS NOT NULL), \'[]\') AS "pictures"'
            ).join("Picture", "u.id = p.\"userId\"", "LEFT").where(f'u."id" = {user_id}').group_by("u.\"id\"").build().execute()
        # visits = visit_model.select("*").where(f'v."userId" = {user_id}').join("\"User\" u", "v.visitedBy = u.id").build().execute()
        if (len(user) == 0): 
            raise NotFound(f"user with id {user_id} not found")
        return user[0] if len(user) > 0 else None
        
    
    def get_user_by_email(self, email):
        user = user_model.select("*").where(f'u."email" = \'{email}\'').build().execute()
        return user[0] if len(user) > 0 else None
    
    def get_user_by_username(self, username):
        user = user_model.select("*").where(f'u."username" = {username}').build().execute()
        return user[0] if len(user) > 0 else None
    
    def format_interests(self, interests):
        # Handle empty or None interests
        if not interests:
            return 'ARRAY[]::TEXT[]'
        
        # Format interests as a PostgreSQL array
        interests_str = ', '.join(f"'{i}'" for i in interests)
        return f"ARRAY[{interests_str}]"
    
    def create_user(self, fields):
        fields["password"] = self.hash_password(fields["password"])
        fields["interests"] = self.format_interests(fields.get("interests"))
        user = user_model.insert(fields).execute()
        return user
    
    def update_user(self, user_id, fields):
        user = user_model.update(fields).where(f'"id" = {user_id}').build().execute()
        print('updated user', user)
        return user
    
    def delete_user(self, user_id):
        user = user_model.delete().where(f'u."id" = {user_id}').build().execute()
        return user
    
    def verify_user(self, user_id):
        user = user_model.update({"verified": True}).where(f'u."id" = {user_id}').build().execute()
        return user
    
    def like_user(self, user_id, liked_user_id):
        like = user_model.select("*").where(f'"userId" = {user_id} AND "likedUserId" = {liked_user_id}').build().execute()
        if like:
            return "User already liked"
        like_model.insert({"userId": user_id, "likedUserId": liked_user_id}).execute()
        return "User liked successfully"
    
    def unlike_user(self, user_id, liked_user_id):
        like_model.delete().where(f'"userId" = {user_id} AND "likedUserId" = {liked_user_id}').build().execute()        
        return "User unliked successfully"
    
    def report_user(self, user_id, reported_user_id, reason):
        report = report_model.select("*").where(f'"reporterId" = {user_id} AND "reportedUserId" = {reported_user_id}').build().execute()
        if report:
            return "User already reported"
        report_model.insert({"reporterId": user_id, "reportedUserId": reported_user_id, "reason": reason}).execute()
        return "User reported successfully"
    
    def block_user(self, user_id, blocked_user_id):
        block = block_model.select("*").where(f'"blockerId" = {user_id} AND "blockedId" = {blocked_user_id}').build().execute()
        if block:
            return "User already blocked"
        block_model.insert({"blockerId": user_id, "blockedId": blocked_user_id}).execute()
        return "User blocked successfully"
    
    def unblock_user(self, user_id, blocked_user_id):
        block_model.delete().where(f'"blockerId" = {user_id} AND "blockedId" = {blocked_user_id}').build().execute()
        return "User unblocked successfully"
    
    
    def visit_user(self, user_id, visited_user_id):
        now = datetime.utcnow()  # Use UTC for consistency
        visit = visit_model.select("*").where(f'v."userId" = {user_id} AND v."visitedBy" = {visited_user_id}').build().execute()
        print(visit)
        if visit or now - visit['visitedAt'] < timedelta(hours=24):
            return "User already visited within the last 24 hours"
        visit_model.insert({"userId": user_id, "visitedBy": visited_user_id}).execute()
        return "User visited successfully"
    
    def get_user_likes(self, user_id):
        likes = like_model.select("*").where(f'"userId" = {user_id}').build().execute()
        return likes
    
    def get_user_reports(self, user_id):
        reports = report_model.select("*").where(f'"reporterId" = {user_id}').build().execute()
        return reports
    
    def get_user_blocks(self, user_id):
        blocks = block_model.select("*").where(f'"blockerId" = {user_id}').build().execute()
        return blocks
    
    def get_user_visits(self, user_id):
        visits = visit_model.select("*").where(f'v."userId" = {user_id}').join("\"User\" u", "v.visitedBy = u.id").build().execute()
        return visits
    
    def search(self,user_id, username, min_age, max_age, location, fame_rating, common_tags):
        # Search for users based on the specified criteria
        users = user_model.select("*")\
            .where(f'"birthDate" BETWEEN \'{datetime.now().year - max_age}-01-01\' AND \'{datetime.now().year - min_age}-01-01\'')\
            .where(f'"fameRating" >= {fame_rating}')\
            .where(f'"id" != {user_id}')\
            .where(f'"interests" && ARRAY{common_tags}::varchar[]')\
            .where(f'"id" NOT IN (SELECT "blockedId" FROM "Block" WHERE "blockerId" = {user_id})')\
            .build().execute()
            # .where(f'"gpsLatitude" BETWEEN {coordinate[0]} AND {coordinate[1]}')\
            # .where(f'"gpsLongitude" BETWEEN {coordinate[2]} AND {coordinate[3]}')\
        return users
    
    def find_nearby_users(self, this_lat, this_lon, distance_km):
        """
        Find nearby users within a certain distance (in kilometers) based on latitude and longitude.
        
        :param conn: SQLite or other DB connection object
        :param this_lat: Latitude of the current user
        :param this_lon: Longitude of the current user
        :param distance_km: Desired distance in kilometers to search for nearby users
        :return: List of nearby users
        """
        # Convert the desired distance in kilometers to degrees of latitude and longitude
        # These constants are approximations for converting km to degrees
        phi = distance_km / 110.574  # Latitude degree ~110.574 km
        omega = distance_km / (111.320 * abs(this_lat))  # Longitude degree varies with latitude
        # Execute query and fetch results
        params = (this_lat - phi, this_lat + phi, this_lon - omega, this_lon + omega)

        return params
    
    def suggestions(self, user_id, limit, offset, sort, filters):
        # match users based on interests, common tags , famerating, location
        # sort using age, location, fame rating and common tags
        # filter by age, location, fame rating and common tags
        user = self.get_user_by_id(user_id)
        if not user:
            raise NotFound("User not found")
        # Get users with common interests
        interests = user['interests'] or []
        fame_rating = user['fameRating'] or 0
        coordinate = self.find_nearby_users(user['gpsLatitude'], user['gpsLongitude'], 10)
        max_age = 45
        min_age = 18
        users = user_model.select(
            "email",
            "username",
            "lastName",
            "firstName",
            "gender",
            "sexualPreferences",
            "profilePictureUrl",
            "biography",
            "location",
            "fameRating",
            "gpsLatitude",
            "gpsLongitude",
            "lastSeen",
            "birthDate",
            "interests",
            f'COALESCE(jsonb_agg(jsonb_build_object(\'pictureId\', p."id", \'url\', p."url", \'isProfile\',p."isProfile")) FILTER (WHERE p."id" IS NOT NULL), \'[]\') AS "pictures"')\
            .join("Picture", "u.id = p.\"userId\"", "LEFT")\
            .where(f'u."id" != {user_id}')\
            .where(f'u."birthDate" BETWEEN \'{datetime.now().year - max_age}-01-01\' AND \'{datetime.now().year - min_age}-01-01\'')\
            .where(f'u."id" NOT IN (SELECT "blockedId" FROM "Block" WHERE "blockerId" = {user_id})')\
            .where(f'(\
                "fameRating" >= {fame_rating} OR interests && ARRAY{interests}::varchar[] \
                OR ( \
                    "gpsLatitude" BETWEEN {coordinate[0]} AND {coordinate[1]} \
                    AND "gpsLongitude" BETWEEN {coordinate[2]} AND {coordinate[3]} \
                ) \
            )')\
            .limit(limit)\
            .offset(offset)\
            .order_by("fameRating")\
            .group_by("u.\"id\"")\
            .build().execute()
        print(len(users))
        return users
