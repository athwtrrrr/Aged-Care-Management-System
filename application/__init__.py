import os
from flask import Flask
from .config import Config
import pymysql
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

# Database setup
def get_db():
    return pymysql.connect(
        host='localhost',
        user=os.getenv('MYSQL_USER'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DATABASE'),
        port=3307,
        cursorclass=pymysql.cursors.DictCursor
    )

# Import blueprints
from .auth import auth_bp
from .routes import routes_bp

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(routes_bp)

# Import models after app creation to avoid circular imports
from . import models