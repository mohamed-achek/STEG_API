# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os, json

from flask import Flask, jsonify
from flask_cors import CORS
from .auth import rest_api
from models import db
from flask_migrate import Migrate
from api.billing import billing_bp
from api.consumption import consumption_bp
from api.outages import outages_bp
from api.payment import payment_bp

app = Flask(__name__)

app.config.from_object('api.config.BaseConfig')

db.init_app(app)
migrate = Migrate(app, db)
rest_api.init_app(app)
CORS(app)

app.register_blueprint(billing_bp, url_prefix='/api')
app.register_blueprint(consumption_bp, url_prefix='/api')
app.register_blueprint(outages_bp, url_prefix='/api')
app.register_blueprint(payment_bp, url_prefix='/api')

# Setup database
@app.before_request
def initialize_database():
    try:
        db.create_all()
    except Exception as e:

        print('> Error: DBMS Exception: ' + str(e) )

        # fallback to SQLite
        BASE_DIR = os.path.abspath(os.path.dirname(__file__))
        app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')

        print('> Fallback to SQLite ')
        db.create_all()

"""
   Custom responses
"""

@app.after_request
def after_request(response):
    """
       Sends back a custom error with {"success", "msg"} format
    """
    if int(response.status_code) >= 400:
        response_data = response.get_data(as_text=True)
        if response_data:
            try:
                response_data = json.loads(response_data)
                if "errors" in response_data:
                    response_data = {"success": False,
                                     "msg": list(response_data["errors"].items())[0][1]}
                    response.set_data(json.dumps(response_data))
                response.headers.add('Content-Type', 'application/json')
            except json.JSONDecodeError:
                pass  # Handle the case where response data is not JSON
    return response

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({"message": "Test endpoint is working"}), 200
