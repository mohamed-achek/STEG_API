from training import *
import joblib
import numpy as np
import matplotlib.pyplot as plt

# Predict on the test set
y_pred = model.predict(X_test)

# Invert scaling to get the actual values
y_pred = scaler.inverse_transform(y_pred)
y_test_actual = scaler.inverse_transform(y_test.reshape(-1, 1))

# Plot the actual vs predicted values
plt.plot(y_test_actual, label='Actual Consumption')
plt.plot(y_pred, label='Predicted Consumption')
plt.legend()
plt.show()

# Save the trained model
model.save('lstm_model.h5')

# Save the scaler
joblib.dump(scaler, 'scaler.pkl')



from tensorflow.keras.models import load_model
import joblib
import numpy as np

# Define time_step (number of past data points used for prediction)
time_step = 3

# Load the saved model
model = load_model('lstm_model.h5')

# Load the saved scaler
scaler = joblib.load('scaler.pkl')

# Example: Get the last 'time_step' data
last_data = np.array([150.0, 155.0, 160.0])  # Replace with actual recent data

# Scale the input data
last_data_scaled = scaler.transform(last_data.reshape(-1, 1)).reshape(1, time_step, 1)

# Predict the next month's consumption
predicted_consumption_scaled = model.predict(last_data_scaled)

# Invert the scaling to get the actual value
predicted_consumption = scaler.inverse_transform(predicted_consumption_scaled)
print(f"Predicted Consumption for Next Month: {predicted_consumption[0][0]}")
