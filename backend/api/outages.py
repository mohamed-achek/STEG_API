from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, Outage

outages_bp = Blueprint('outages', __name__)

# Endpoint to add a new outage
@outages_bp.route('/outages/add', methods=['POST'])
def add_outage():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        outage_type = data.get('outage_type')
        start_time = data.get('start_time')
        heatmapdata = data.get('heatmapdata')

        # Validate required fields
        if outage_type is None or start_time is None:
            return jsonify({"error": "Missing required fields: 'outage_type', 'start_time'"}), 400

        new_outage = Outage(
            outage_type=outage_type,
            start_time=datetime.fromisoformat(start_time),
            end_time=datetime.fromisoformat(data['end_time']) if data.get('end_time') else None,
            description=data.get('description', ''),
            status=data.get('status', 'Ongoing'),
            heatmapdata=heatmapdata
        )
        db.session.add(new_outage)
        db.session.commit()
        return jsonify({"message": "New outage added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Endpoint to get all outages
@outages_bp.route('/outages', methods=['GET'])
def get_outages():
    try:
        outages = Outage.query.all()
        outages_list = [
            {
                'id': outage.id,
                'outage_type': outage.outage_type,
                'start_time': outage.start_time.isoformat(),
                'end_time': outage.end_time.isoformat() if outage.end_time else None,
                'description': outage.description,
                'status': outage.status,
                'heatmapdata': outage.heatmapdata
            }
            for outage in outages
        ]
        return jsonify(outages_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Endpoint to get heatmap data
@outages_bp.route('/outages/heatmap', methods=['GET'])
def get_heatmap_data():
    try:
        outages = Outage.query.all()
        heatmap_data = [
            {
                'latitude': outage.heatmapdata['latitude'],
                'longitude': outage.heatmapdata['longitude'],
                'weight': outage.heatmapdata.get('weight', 1)
            }
            for outage in outages
            if outage.heatmapdata and 'latitude' in outage.heatmapdata and 'longitude' in outage.heatmapdata
        ]
        return jsonify(heatmap_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
