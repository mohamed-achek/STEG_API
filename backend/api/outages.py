from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, Outage, ReportedOutage  # Import Outage

outages_bp = Blueprint('outages', __name__)

# Endpoint to add a new outage to the ReportedOutage table
@outages_bp.route('/outages/add', methods=['POST'])
def add_outage():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        outage_type = data.get('outage_type')
        start_time = data.get('start_time')
        region = data.get('region')  # Add region field

        # Validate required fields
        if outage_type is None or start_time is None or region is None:
            return jsonify({"error": "Missing required fields: 'outage_type', 'start_time', 'region'"}), 400

        new_outage = ReportedOutage(  # Store in ReportedOutage table
            outage_type=outage_type,
            start_time=datetime.fromisoformat(start_time),
            description=data.get('description', ''),
            status=data.get('status', 'Ongoing'),
            region=region  # Add region field
        )
        db.session.add(new_outage)
        db.session.commit()
        return jsonify({"message": "New outage reported successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Endpoint to add a new outage to the Outage table
@outages_bp.route('/outages/add_to_outage', methods=['POST'])
def add_outage_to_outage():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        outage_type = data.get('outage_type')
        start_time = data.get('start_time')
        region = data.get('region')  # Add region field
        heatmapdata = data.get('heatmapdata', {})  # Add heatmapdata field

        # Validate required fields
        if outage_type is None or start_time is None or region is None:
            return jsonify({"error": "Missing required fields: 'outage_type', 'start_time', 'region'"}), 400

        new_outage = Outage(  # Store in Outage table
            outage_type=outage_type,
            start_time=datetime.fromisoformat(start_time),
            description=data.get('description', ''),
            status=data.get('status', 'Ongoing'),
            region=region,  # Add region field
            heatmapdata=heatmapdata  # Add heatmapdata field
        )
        db.session.add(new_outage)
        db.session.commit()
        return jsonify({"message": "New outage added to Outage table successfully!"}), 201
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
                'heatmapdata': outage.heatmapdata,
                'region': outage.region  # Add region field
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
        outages = Outage.query.filter_by(status='Ongoing').all()  # Filter by 'Ongoing' status
        heatmap_data = [
            {
                'latitude': outage.heatmapdata['latitude'],
                'longitude': outage.heatmapdata['longitude'],
                'weight': outage.heatmapdata.get('weight', 1),
                'region': outage.region  # Add region field
            }
            for outage in outages
            if outage.heatmapdata and 'latitude' in outage.heatmapdata and 'longitude' in outage.heatmapdata
        ]
        return jsonify(heatmap_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Endpoint to delete an outage
@outages_bp.route('/outages/delete/<int:outage_id>', methods=['DELETE'])
def delete_outage(outage_id):
    try:
        print(f"Attempting to delete outage with ID: {outage_id}")
        outage = ReportedOutage.query.get(outage_id)
        if not outage:
            print(f"Outage with ID {outage_id} not found")
            return jsonify({"error": "Outage not found"}), 404

        db.session.delete(outage)
        db.session.commit()
        print(f"Outage with ID {outage_id} deleted successfully")
        return jsonify({"message": "Outage deleted successfully!"}), 200
    except Exception as e:
        print(f"Error occurred while deleting outage with ID {outage_id}: {str(e)}")
        return jsonify({"error": str(e)}), 400

# Endpoint to delete all outages
@outages_bp.route('/outages/delete_all', methods=['DELETE'])
def delete_all_outages():
    try:
        print("Attempting to delete all outages")
        num_deleted = db.session.query(Outage).delete()
        db.session.commit()
        print(f"Deleted {num_deleted} outages successfully")
        return jsonify({"message": f"Deleted {num_deleted} outages successfully!"}), 200
    except Exception as e:
        print(f"Error occurred while deleting all outages: {str(e)}")
        return jsonify({"error": str(e)}), 400
