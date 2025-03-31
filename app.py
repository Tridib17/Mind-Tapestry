from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load the trained machine learning model
model = joblib.load("svc_model.pkl")

# Define categorical mappings to convert user input into numerical values
gender_mapping = {'Female': 0, 'Male': 1, 'Other': 2}
sleep_quality_mapping = {'Good': 2, 'Average': 1, 'Poor': 0}
physical_activity_mapping = {'High': 2, 'Moderate': 1, 'Low': 0}
diet_quality_mapping = {'Good': 2, 'Average': 1, 'Poor': 0}
chronic_illness_mapping = {'No': 0, 'Yes': 1}
extracurricular_mapping = {'High': 2, 'Moderate': 1, 'Low': 0}

# Mapping for Likert scale responses
response_mapping = {
    "Did not apply to me at all": 0,
    "Applied to me to some degree, or some of the time": 1,
    "Applied to me to a considerable degree or a good part of time": 2,
    "Applied to me very much or most of the time": 3
}

# Route to render the main page
@app.route('/')
def index():
    return render_template("index.html")

# Route to handle predictions
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # Get JSON data from request
    print("\n✅ Received Data:", data)
    
    if not data:
        print("❌ No data received or incorrect JSON format")
        return jsonify({"error": "No data received or incorrect JSON format"}), 400

    try:
        # Function to normalize values using Min-Max scaling
        def min_max_scaler(value, min, max):
            return (value - min) / (max - min)

        # Extract and process main features with correct feature names
        main_features = [
            min_max_scaler(float(data.get("age", -1)), 18, 29),
            gender_mapping.get(data.get("gender", ""), -1),
            min_max_scaler(float(data.get("cgpa", -1)), 0, 10),
            sleep_quality_mapping.get(data.get("sleep_quality", ""), -1),
            physical_activity_mapping.get(data.get("physical_activity", ""), -1),
            diet_quality_mapping.get(data.get("diet_quality", ""), -1),
            chronic_illness_mapping.get(data.get("chronic_illness", ""), -1),
            extracurricular_mapping.get(data.get("extracurricular", ""), -1),
            int(data.get("financial_stress", -1))
        ]
        print("✅ Processed Main Features:", main_features)
        
        # Check for invalid mappings
        if -1 in main_features:
            return jsonify({"error": "Invalid feature mapping"}), 400
        
        # Process questionnaire responses with correct feature names
        stress_responses = [response_mapping.get(data.get(f"stress_{i}", ""), -1) for i in range(1, 8)]
        depression_responses = [response_mapping.get(data.get(f"depression_{i}", ""), -1) for i in range(1, 8)]
        anxiety_responses = [response_mapping.get(data.get(f"anxiety_{i}", ""), -1) for i in range(1, 8)]

        # Combine all responses
        responses = stress_responses + depression_responses + anxiety_responses 
        
        # Check for invalid Likert responses
        if -1 in responses:
            return jsonify({"error": "Invalid Likert response mapping"}), 400
        
        # Convert features into a NumPy array
        features = np.array([main_features + responses])

        # Convert NumPy array to DataFrame with correct column names
        feature_columns = [
            "Age", "Gender", "CGPA", "Sleep_Quality", "Physical_Activity",
            "Diet_Quality", "Chronic_Illness", "Extracurricular_Involvement", "Financial_Stress",
        ] + [f"stress_column{i}" for i in range(1, 8)] + \
            [f"depression_column{i}" for i in range(1, 8)] + \
            [f"anxiety_column{i}" for i in range(1, 8)]

        features_df = pd.DataFrame(features, columns=feature_columns)
        print("✅ Final Processed Features:\n", features_df)

        # Make prediction using the trained model
        prediction = model.predict(features_df)[0]
        print("✅ Prediction Result:", prediction)

        # Calculate and return stress, depression, and anxiety scores
        return jsonify({
            "prediction": prediction,
            "depression_score": round(((sum(depression_responses) * 2) / 42) * 100, 2),
            "anxiety_score": round(((sum(anxiety_responses) * 2) / 42) * 100, 2),
            "stress_score": round(((sum(stress_responses) * 2) / 42) * 100, 2)
        })
    except Exception as e:
        print("❌ Error in prediction:", str(e))
        return jsonify({"error": str(e)}), 400


# Route to render the result page
@app.route('/result')
def result():
    return render_template("result.html")

# Run the Flask application in debug mode
if __name__ == '__main__':
    app.run(debug=True)
