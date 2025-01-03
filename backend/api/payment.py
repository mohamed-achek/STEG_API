from flask import Blueprint, request, jsonify, send_file
from models import db, Payment, Bill, User
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

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

# Endpoint to get all payments
@payment_bp.route('/payments', methods=['GET'])
def get_payments():
    payments = Payment.query.all()
    payments_list = [
        {
            'id': payment.id,
            'user_id': payment.user_id,
            'bill_id': payment.bill_id,
            'amount': float(payment.amount),
            'payment_date': payment.payment_date.isoformat(),
            'payment_method': payment.payment_method,
            'status': payment.status
        }
        for payment in payments
    ]
    return jsonify({"payments": payments_list}), 200

# Endpoint to download receipt
@payment_bp.route('/payments/receipt/<int:payment_id>', methods=['GET'])
def download_receipt(payment_id):
    try:
        payment = Payment.query.get(payment_id)
        if not payment:
            return jsonify({"error": "Payment not found"}), 404

        # Generate a PDF receipt
        receipt_file = io.BytesIO()
        c = canvas.Canvas(receipt_file, pagesize=letter)
        c.drawString(100, 750, "Receipt for Payment")
        c.drawString(100, 735, f"Payment ID: {payment.id}")
        c.drawString(100, 720, f"User ID: {payment.user_id}")
        c.drawString(100, 705, f"Bill ID: {payment.bill_id}")
        c.drawString(100, 690, f"Amount: ${payment.amount}")
        c.drawString(100, 675, f"Payment Date: {payment.payment_date}")
        c.drawString(100, 660, f"Payment Method: {payment.payment_method}")
        c.drawString(100, 645, f"Status: {payment.status}")
        c.showPage()
        c.save()

        receipt_file.seek(0)

        return send_file(receipt_file, as_attachment=True, download_name=f'receipt_{payment.id}.pdf', mimetype='application/pdf')
    except Exception as e:
        return jsonify({"error": str(e)}), 500
