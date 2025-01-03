from sklearn.preprocessing import MinMaxScaler
import numpy as np
from data import *
# Scale the consumption values to a range of 0 to 1
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(df[['consumption']])

# Function to create dataset for LSTM model
def create_dataset(data, time_step=1):
    X, y = [], []
    for i in range(len(data) - time_step):
        X.append(data[i:(i + time_step), 0])  # Input features
        y.append(data[i + time_step, 0])  # Target value (next month's consumption)
    return np.array(X), np.array(y)

# Set time_step (number of previous months to consider for prediction)
time_step = 3  # Example: Use the last 3 months to predict the next month

# Prepare data for LSTM
X, y = create_dataset(scaled_data, time_step)

# Reshape X to be in the format [samples, time steps, features]
X = X.reshape(X.shape[0], X.shape[1], 1)

# Split the data into training and testing sets
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

# Check the shapes of the data
print(X_train.shape, X_test.shape, y_train.shape, y_test.shape)
