from dotenv import load_dotenv
load_dotenv()

import os

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

# Create the app and enable cross referencing for API calls
app = Flask(__name__)
CORS(app)

# Configurations to set up the database (using sqlite)
app.config["JWT_SECRET_KEY"] = os.environ["SECRET_KEY"]
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE"]
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins="*")
jwt = JWTManager(app)
db = SQLAlchemy(app)