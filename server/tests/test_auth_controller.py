# type: ignore
import pytest
from server import create_app
import logging
from faker import Faker


logger = logging.getLogger(__name__)
fake = Faker()
email = fake.email()


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

def test_auth_register_empty(client):
    response = client.post('/auth/register', json={
    })
    assert response.status_code == 400
    assert 'Missing data for required field.' in response.json['errors']['email']

def test_auth_register(client):
    response = client.post('/auth/register', json={
        'username': fake.user_name(),
        'email': email,
        "lastName": "Miller",
        "firstName": "Alex",
        "password": "password",
        "gender": "Non-binary",
        "sexualPreferences": "Bisexual",
        "biography": "Many online providers such as Google & Bing have geocoding services, these providers do not include Python libraries and have different JSON responses between each other.",
        "profilePictureUrl": "https://randomuser.me/api/portraits/neutral/3.jpg",
        "location": "London, UK",
        "gpsLatitude": 51.5074,
        "gpsLongitude": -0.1278,
        "birthDate": "1995-07-23"
    })
    assert response.status_code == 201

def test_auth_login(client):
    response = client.post('/auth/login', json={
        'email': email,
        'password': 'password'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json