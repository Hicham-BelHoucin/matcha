`export PYTHONPATH=/Users/hbel-hou/Desktop/matcha`

### API Design

#### 1. **User Registration and Authentication**

**POST /api/auth/register**

- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "firstName": "First",
    "lastName": "Last",
    "password": "password",
    "birthDate": "1990-01-01",
    "gender": "Male",
    "sexualPreference": "----",
    "location": "------",
    "biography": "------",
    "profilePictureUrl": "------",
    "sexualPreferences": "------",
    "gpsLatitude": 1245,
    "gpsLongitude": 1245
  }
  ```
- **Response**:
  - **201 Created**: `{ "message": "Registration successful. Please check your email for verification." }`
  - **400 Bad Request**: `{ "error": "Validation error message" }`

**POST /api/auth/login**

- **Description**: Log in an existing user.
- **Request Body**:
  ```json
  {
    "email": "email",
    "password": "password"
  }
  ```
- **Response**:
  - **200 OK**: `{ "token": "JWT_TOKEN" }`
  - **401 Unauthorized**: `{ "error": "Invalid credentials" }`

**POST /api/logout**

- **Description**: Log out the user.
- **Request Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**:
  - **200 OK**: `{ "message": "Logout successful" }`
  - **401 Unauthorized**: `{ "error": "Unauthorized" }`

**POST /api/auth/password-reset**

- **Description**: Request a password reset email.
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  - **200 OK**: `{ "message": "Password reset email sent" }`
  - **400 Bad Request**: `{ "error": "Validation error message" }`

**POST /api/auth/change-password**

- **Description**: Confirm the password reset with a new password.
- **Request Body**:
  ```json
  {
    "email": "email",
    "code": "reset_code",
    "password": "new_password"
  }
  ```
- **Response**:
  - **200 OK**: `{ "message": "Password updated successfully" }`
  - **400 Bad Request**: `{ "error": "Validation error message" }`
