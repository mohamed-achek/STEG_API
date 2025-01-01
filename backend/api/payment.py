from flask import Blueprint, request, jsonify
from models import db, Payment, Bill, User

payment_bp = Blueprint('payment', __name__)

# Endpoint to add a new payment
@payment_bp.route('/payments/add', methods=['POST'])
def add_payment():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        user_id = data.get('user_id')
        bill_id = data.get('bill_id')
        amount = data.get('amount')
        payment_method = data.get('payment_method', 'Unknown')
        status = data.get('status', 'Pending')

        # Validate required fields
        if user_id is None or bill_id is None or amount is None:
            return jsonify({"error": "Missing required fields: 'user_id', 'bill_id', 'amount'"}), 400

        # Check if the user and bill exist
        user_exists = User.query.filter_by(id=user_id).first()
        bill_exists = Bill.query.filter_by(id=bill_id).first()
        if not user_exists:
            return jsonify({"error": "User not found"}), 400
        if not bill_exists:
            return jsonify({"error": "Bill not found"}), 400

        # Create the new payment
        new_payment = Payment(
            user_id=user_id,
            bill_id=bill_id,
            amount=amount,
            payment_method=payment_method,
            status=status
        )

        # Save the new payment to the database
        db.session.add(new_payment)
        db.session.commit()

        return jsonify({"message": "New payment added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
