from datetime import datetime, timezone, timedelta

from functools import wraps

from flask import request
from flask_restx import Api, Resource, fields

import jwt

from models import db, User, JWTTokenBlocklist
from api.config import BaseConfig
import requests

rest_api = Api(version="1.0", title="STEG API", description="API for STEG application")


"""
    Flask-Restx models for api request and response data
"""

signup_model = rest_api.model('SignUpModel', {"username": fields.String(required=True, min_length=2, max_length=32),
                                              "email": fields.String(required=True, min_length=4, max_length=64),
                                              "password": fields.String(required=True, min_length=4, max_length=16)
                                              })

login_model = rest_api.model('LoginModel', {"email": fields.String(required=True, min_length=4, max_length=64),
                                            "password": fields.String(required=True, min_length=4, max_length=16)
                                            })

user_edit_model = rest_api.model('UserEditModel', {"userID": fields.String(required=True, min_length=1, max_length=32),
                                                   "username": fields.String(required=True, min_length=2, max_length=32),
                                                   "email": fields.String(required=True, min_length=4, max_length=64)
                                                   })


"""
   Helper function for JWT token required
"""

def token_required(f):

    @wraps(f)
    def decorator(*args, **kwargs):

        token = None

        if "authorization" in request.headers:
            token = request.headers["authorization"]
            if token.startswith("Bearer "):
                token = token[len("Bearer "):]

        if not token:
            print("Token is missing")
            return {"success": False, "msg": "Valid JWT token is missing"}, 400

        try:
            print(f"Decoding token: {token}")
            data = jwt.decode(token, BaseConfig.SECRET_KEY, algorithms=["HS256"])
            print(f"Token decoded: {data}")
            current_user = User.get_by_email(data["email"])

            if not current_user:
                print("User does not exist")
                return {"success": False,
                        "msg": "Sorry. Wrong auth token. This user does not exist."}, 400

            token_expired = db.session.query(JWTTokenBlocklist.id).filter_by(jwt_token=token).scalar()

            if token_expired is not None:
                print("Token revoked")
                return {"success": False, "msg": "Token revoked."}, 400

            if not hasattr(current_user, 'jwt_auth_active') or not current_user.check_jwt_auth_active():
                print("Token expired")
                return {"success": False, "msg": "Token expired."}, 400

        except jwt.ExpiredSignatureError:
            print("Token has expired")
            return {"success": False, "msg": "Token has expired"}, 400
        except jwt.InvalidTokenError:
            print("Token is invalid")
            return {"success": False, "msg": "Token is invalid"}, 400
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return {"success": False, "msg": f"An error occurred: {str(e)}"}, 400

        return f(current_user, *args, **kwargs)

    return decorator


"""
    Flask-Restx routes
"""


@rest_api.route('/api/users/register')
class Register(Resource):
    """
       Creates a new user by taking 'signup_model' input
    """

    @rest_api.expect(signup_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _username = req_data.get("username")
        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = User.get_by_email(_email)
        if user_exists:
            return {"success": False,
                    "msg": "Email already taken"}, 400

        new_user = User(username=_username, email=_email)

        new_user.set_password(_password)
        new_user.save()

        return {"success": True,
                "userID": new_user.id,
                "msg": "The user was successfully registered"}, 200


@rest_api.route('/api/users/login')
class Login(Resource):
    """
       Login user by taking 'login_model' input and return JWT token
    """

    @rest_api.expect(login_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = User.get_by_email(_email)

        if not user_exists:
            return {"success": False,
                    "msg": "This email does not exist."}, 400

        if not user_exists.check_password(_password):
            return {"success": False,
                    "msg": "Wrong credentials."}, 400

        # create access token using JWT
        token = jwt.encode({'email': _email, 'exp': datetime.utcnow() + timedelta(minutes=30)}, BaseConfig.SECRET_KEY)

        user_exists.set_jwt_auth_active(True)
        user_exists.save()

        return {"success": True,
                "token": token,
                "user": user_exists.toJSON()}, 200


@rest_api.route('/api/users/edit')
class EditUser(Resource):
    """
       Edits User's username or password or both using 'user_edit_model' input
    """

    @rest_api.expect(user_edit_model)
    @token_required
    def post(self, current_user):

        req_data = request.get_json()

        _new_username = req_data.get("username")
        _new_email = req_data.get("email")

        if _new_username:
            self.update_username(_new_username)

        if _new_email:
            self.update_email(_new_email)

        self.save()

        return {"success": True}, 200


@rest_api.route('/api/users/logout')
class LogoutUser(Resource):
    """
    Logs out User using 'logout_model' input
    """

    @token_required
    def post(self, current_user):
        try:
            # Extract the JWT token from the Authorization header
            auth_header = request.headers.get("authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {"error": "Authorization header is missing or malformed"}, 400

            _jwt_token = auth_header.split(" ")[1]

            # Add the token to the blocklist
            jwt_block = JWTTokenBlocklist(jwt_token=_jwt_token, created_at=datetime.now(timezone.utc))
            jwt_block.save()

            # Deactivate JWT authentication for the user
            current_user.set_jwt_auth_active(False)
            current_user.save()

            return {"success": True}, 200

        except Exception as e:
            return {"error": str(e)}, 500

