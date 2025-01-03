from tensorflow.keras.models import load_model
import joblib

def load_model_and_scaler():
    model = load_model("./MLmodel/lstm_model.h5")
    scaler = joblib.load("./MLmodel/scaler.pkl")
    return model, scaler
