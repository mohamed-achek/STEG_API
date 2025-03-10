from flask import Blueprint, request, jsonify
from datetime import date
from models import db, User, Bill

billing_bp = Blueprint('billing', __name__)

# Endpoint to add a new bill
@billing_bp.route('/bills/add', methods=['POST'])
def add_bill():
    try:
        req_data = request.get_json()

        _user_id = req_data.get("user_id")
        _amount = req_data.get("amount")
        _due_date = req_data.get("due_date")
        _paid = req_data.get("paid", False)
        _payment_date = req_data.get("payment_date")

        # Check if the user exists
        user_exists = User.query.filter_by(id=_user_id).first()
        if not user_exists:
            return jsonify({"success": False, "msg": "User not found"}), 400

        # Create the new bill
        new_bill = Bill(
            user_id=_user_id,
            amount=_amount,
            due_date=date.fromisoformat(_due_date),
            paid=_paid,
            payment_date=date.fromisoformat(_payment_date) if _payment_date else None
        )

        # Save the new bill to the database
        db.session.add(new_bill)
        db.session.commit()

        return jsonify({
            "success": True,
            "billID": new_bill.id,
            "msg": "The bill was successfully created"
        }), 201
    except Exception as e:
        return jsonify({"success": False, "msg": str(e)}), 500


# Endpoint to get all bills
@billing_bp.route('/bills', methods=['GET'])
def get_bills():
    try:
        bills = Bill.query.all()
        bills_list = [
            {
                'id': bill.id,
                'user_id': bill.user_id,
                'amount': float(bill.amount),
                'due_date': bill.due_date.isoformat(),
                'paid': bill.paid,
                'payment_date': bill.payment_date.isoformat() if bill.payment_date else None
            }
            for bill in bills
        ]
        return jsonify(bills_list), 200
    except Exception as e:
        return jsonify({"success": False, "msg": str(e)}), 500

# Endpoint to pay a bill
@billing_bp.route('/bills/<int:bill_id>/pay', methods=['POST'])
def pay_bill(bill_id):
    try:
        req_data = request.get_json()
        card_number = req_data.get('cardNumber')
        expiry_date = req_data.get('expiryDate')
        cvv = req_data.get('cvv')

        
        bill = Bill.query.get(bill_id)
        if not bill:
            return jsonify({"success": False, "msg": "Bill not found"}), 404

        bill.paid = True
        bill.payment_date = date.today()
        db.session.commit()

        return jsonify({"success": True, "msg": "Bill paid successfully"}), 200
    except Exception as e:
        return jsonify({"success": False, "msg": str(e)}), 500
