from flask import Blueprint, request, jsonify
from datetime import date
from models import db, ConsumptionData
import numpy as np

consumption_bp = Blueprint('consumption', __name__)

# Endpoint to add consumption data
@consumption_bp.route('/consumption/add', methods=['POST'])
def add_consumption():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        # Check if data is a list (batch) or a single entry
        if isinstance(data, list):
            # Process each entry in the batch
            for entry in data:
                new_consumption = ConsumptionData(
                    user_id=entry['user_id'],
                    consumption=entry['consumption'],
                    date=date.fromisoformat(entry['date'])
                )
                db.session.add(new_consumption)
            db.session.commit()
            return jsonify({"message": "Batch consumption data added successfully!"}), 201
        else:
            # Process a single entry
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

@consumption_bp.route('/predict', methods=['POST'])
def predict():
    from . import model, scaler
    try:
        # Get JSON data from the request
        data = request.get_json()
        if not data or 'input_data' not in data:
            return jsonify({"error": "Invalid input. Provide 'input_data' in the request."}), 400
        
        # Extract input data
        input_data = np.array(data['input_data']).reshape(-1, 1)  # Ensure correct shape

        # Preprocess input data using the scaler
        scaled_data = scaler.transform(input_data)  # Ensure scaler is used here

        # Prepare data for the LSTM model
        lstm_input = scaled_data.reshape(1, scaled_data.shape[0], scaled_data.shape[1])

        # Make prediction
        prediction = model.predict(lstm_input)
        
        # Inverse transform the prediction to the original scale
        prediction_original_scale = scaler.inverse_transform(prediction)

        # Return the prediction
        return jsonify({"prediction": prediction_original_scale.tolist()})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
