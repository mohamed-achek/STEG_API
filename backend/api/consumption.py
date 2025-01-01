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

        user_id = data.get('user_id')
        consumption = data.get('consumption')
        date_str = data.get('date')

        # Validate required fields
        if user_id is None or consumption is None or date_str is None:
            return jsonify({"error": "Missing required fields: 'user_id', 'consumption', 'date'"}), 400

        new_consumption = ConsumptionData(
            user_id=user_id,
            consumption=consumption,
            date=date.fromisoformat(date_str)
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