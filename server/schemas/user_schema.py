from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import datetime

# Define the validation schema
class UserSchema(Schema):
    id = fields.Int(dump_only=True)  # Primary key, read-only
    email = fields.Email(required=True, validate=validate.Length(max=255))  # Email validation
    username = fields.Str(required=True, validate=validate.Length(max=255))  # Username must be unique
    lastName = fields.Str(required=True, validate=validate.Length(max=255))  # Last name cannot be empty
    firstName = fields.Str(required=True, validate=validate.Length(max=255))  # First name cannot be empty
    password = fields.Str(required=True, validate=validate.Length(min=6))  # Ensure password has minimum length
    gender = fields.Str(validate=validate.OneOf(["Male", "Female", "Other"]), allow_none=True)  # Optional
    sexualPreferences = fields.Str(validate=validate.Length(max=255), allow_none=True)  # Optional
    biography = fields.Str(allow_none=True)  # Optional
    profilePictureUrl = fields.Url(validate=validate.Length(max=255), allow_none=True)  # Must be a valid URL, optional
    location = fields.Str(validate=validate.Length(max=255), allow_none=True)  # Optional
    fameRating = fields.Float(validate=validate.Range(min=0, max=5), allow_none=True)  # Fame rating between 0 and 5
    gpsLatitude = fields.Float(validate=validate.Range(min=-90, max=90), allow_none=True)  # Valid latitude range
    gpsLongitude = fields.Float(validate=validate.Range(min=-180, max=180), allow_none=True)  # Valid longitude range
    lastSeen = fields.DateTime(dump_only=True)  # Auto-generated, read-only
    birthDate = fields.Date(required=True)  # Must be a valid date

    @validates("birthDate")
    def validate_birth_date(self, value):
        """Ensure the birth date is in the past."""
        if value > datetime.now().date():
            raise ValidationError("Birth date cannot be in the future.")
