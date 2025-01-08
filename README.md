# STEG API

A Flask-based API for the Société Tunisienne de l'Électricité et du Gaz (STEG) to provide energy consumption insights, recommendations, predictions, and environmental impact calculations. The project includes a React frontend for user interaction.

## Main Features

- **Energy Consumption Tracking**: Visulaize energy consumption data.
- **Predictions**: Forecast future energy usage based on historical data using an LSTM model
- **Outages**: Visualize current outages on an interactive map using Google Maps API and provide a dedicated section for reporting outages. 
- **Environmental Impact Analysis**: Calculate carbon footprints and trees saved.
- **User-Friendly Frontend**: React-based interface for seamless user interaction.

## Tech Stack

### Backend
- **Framework**: Flask
- **Database**: SQLite
- **Containerization**: Docker

### Frontend
- **Framework**: React

### Deployment
- **Platform**: Render

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- Docker

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mohamed-achek/STEG_API.git
   cd steg-api
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Run the Flask application:
     ```bash
     flask run
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React application:
     ```bash
     npm start
     ```

4. **Docker Setup** (Optional):
   - Build and run the Docker container:
     ```bash
     docker-compose up --build
     ```

## API Endpoints

### Energy Data
- `POST /api/energy` - Upload energy consumption data.
- `GET /api/energy` - Retrieve energy consumption data.

### Predictions
- `GET /api/predictions` - Get energy usage predictions.

### Recommendations
- `GET /api/recommendations` - Get energy-saving recommendations.

### Environmental Impact
- `GET /api/environment` - Calculate carbon footprints and trees saved.


## Contribution

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature-name'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or suggestions, feel free to contact:
- **Name**: Mohamed Achek
- **Email**: mohamedachek5@gmail.com
- **GitHub**: [mohamed-achek](https://github.com/mohamed-achek)

---

Thank you for using the STEG API! Together, we can create a sustainable energy future.

