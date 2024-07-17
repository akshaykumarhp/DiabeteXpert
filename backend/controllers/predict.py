import sys
import json
import joblib
import numpy as np

# Load the trained model
model_path = 'models/random_forest_diabetes_model.pkl'
try:
    model = joblib.load(model_path)
except Exception as e:
    print(json.dumps({'error': f'Failed to load model: {e}'}))
    sys.exit(1)

# Get the input features from the command line argument
try:
    features = json.loads(sys.argv[1])
    features = np.array(features).reshape(1, -1)
except Exception as e:
    print(json.dumps({'error': f'Invalid input features: {e}'}))
    sys.exit(1)

# Make the prediction
try:
    prediction = model.predict(features)
    probability = model.predict_proba(features)

    result = {
        'prediction': int(prediction[0]),
        'probability': probability[0].tolist()
    }

    print(json.dumps(result))
except Exception as e:
    print(json.dumps({'error': f'Prediction failed: {e}'}))
    sys.exit(1)