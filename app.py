# app.py
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and encoder
model = joblib.load("bangalore_home_prices_model.pkl")
location_encoder = joblib.load("location_encoder.pkl")

@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json()

    try:
        location = data.get("region", "")
        sqft = float(data.get("squareFeet", 0))
        bhk = int(data.get("bhk", 0))
        bath = int(data.get("bathrooms", 0))
        features_bool = ["parking", "garden", "swimmingPool", "gym", "security", "powerBackup"]
        bool_values = [int(data.get(f, False)) for f in features_bool]

        try:
            loc_array = location_encoder.transform([[location]])[0]
        except:
            loc_array = np.zeros(location_encoder.transform([["Unknown"]]).shape[1])

        features = [sqft, bath, bhk] + bool_values + loc_array.tolist()
        prediction = model.predict([features])[0]

        return jsonify({"price": round(prediction, 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
