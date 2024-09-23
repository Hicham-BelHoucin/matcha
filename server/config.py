class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://username:password@db:5432/property_management_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'AZFFDHALfsgfads4897436htlk638748564h5nynydtlkfhjylikdfgy89076507654ojh7l'
    DB_PORT=5432
    DB_HOST='localhost'
    POSTGRES_USER="username"
    POSTGRES_PASSWORD="password"
    POSTGRES_DB="property_management_db"
    JWT_SECRET_KEY="09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611"