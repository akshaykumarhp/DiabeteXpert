import sys
import json
import joblib
import numpy as np

# Load the trained model
model = joblib.load('models/random_forest_diabetes_model.pkl')

#get input features from command line argument
features = json.loads(sys.argv[1])
features = np.array(features).reshape(1,-1)

#make predictions
prediction = model.predict(features)
probability = model.predict_proba(features)

result = {
    'prediction': int(prediction[0]),
    'probability': probability[0].tolist()  # convert numpy array to list for JSON output
}

print(json.dumps(result))