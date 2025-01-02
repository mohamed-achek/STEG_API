from flask import Blueprint, request, jsonify
from datetime import date
from models import db, ConsumptionData

consumption_bp = Blueprint('consumption', __name__)

# Endpoint to add consumption data
@consumption_bp.route('/consumption/add', methods=['POST'])
def add_consumption():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        new_consumption = ConsumptionData(
            user_id=data['user_id'],
            consumption=data['consumption'],
            date=date.fromisoformat(data['date'])
        )
        db.session.add(new_consumption)
        db.session.commit()
        return jsonify({"message": "New consumption data added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Endpoint to get all consumption data
@consumption_bp.route('/consumption', methods=['GET'])
def get_consumption():
    try:
        consumption_data = ConsumptionData.query.all()
        consumption_list = [
            {
                'id': data.id,
                'user_id': data.user_id,
                'consumption': float(data.consumption),
                'date': data.date.isoformat()
            }
            for data in consumption_data
        ]
        return jsonify(consumption_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400