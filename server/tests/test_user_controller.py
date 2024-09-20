import pytest
from server import create_app
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


@pytest.fixture()
def app():
    app = create_app()
    
    app.config.update({
        "TESTING": True,
    })

    # other setup can go here

    yield app

    # clean up / reset resources here


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()

@pytest.fixture()
def auth_token(client):
    """Login and store the access token to reuse in future tests."""
    response = client.post('/auth/login', json={
        'email': 'hortonmichael@example.org',
        'password': 'password'
    })

    assert response.status_code == 200
    assert 'access_token' in response.json

    # Return the access token
    return response.json['access_token']

def test_user_profile(client, auth_token):
    """Test accessing a protected route using the stored access token."""
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    response = client.get('/users/profile', headers=headers)

    assert response.status_code == 200
    
    # If the response contains JSON, inspect its content
    response_json = response.get_json()  # equivalent to response.json
    
    # check if email == 'fhfdhs'
    assert response_json['email'] == 'hortonmichael@example.org'
    
def test_user_profile_by_id(client, auth_token):
    id = 732
    """Test accessing a protected route using the stored access token."""
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    response = client.get(f'/users/{id}', headers=headers)
    
    
    if response.status_code == 200:
        assert response.get_json()['id'] == id # Check if the user ID is 1
    else:
        assert response.status_code == 404

def test_suggest_matches(client, auth_token):
    """Test accessing a protected route using the stored access token."""
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    expected_tags = ['Music', 'Sport']
    response = client.get(f'/users/suggestoins?limit=10&sort=location&filter[tags]={expected_tags}', headers=headers)
    data = response.get_json()
    
    if len(data) > 0:
        assert response.status_code == 200
    
        distance = [user['distance'] for user in data]
        
        assert distance == sorted(distance), "Users are not sorted by location"

        for user in data:
            assert 'interests' in user, "User does not have tags"
            # Assuming you're filtering for the 'developer' tag
            user_tags = set(user['interests'])  # Convert user tags to a set for easier comparison
            assert any(tag in expected_tags for tag in user_tags), "User does not match any of the tag filters"
    
# Function to calculate age from date of birth string
def calculate_age(dob_str):
    # Parse the date string into a datetime object
    date_of_birth = datetime.strptime(dob_str, "%a, %d %b %Y %H:%M:%S %Z")
    
    # Get the current date
    today = datetime.today()
    
    # Calculate the age
    age = today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
    return age
    
def test_user_search(client, auth_token):
    """Test accessing a protected route using the stored access token."""
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    username = 'ant'
    age = 'range(18, 30)'
    
    response = client.get(f'/users/search?username={username}&limit=10&sort=age&filter[age]={age}', headers=headers)
    
    if response.status_code == 200:
        # check if all users have 'ant' in their username
        for user in response.get_json():
            assert username in user['username']
            
        # check if all users are between 18 and 30 years old
        for user in response.get_json():
            assert 18 <= calculate_age(user['birthDate']) <= 30
            
        # check if users are sorted by age
        ages = [calculate_age(user['birthDate']) for user in response.get_json()]
        
        assert ages == sorted(ages), "Users are not sorted by age"