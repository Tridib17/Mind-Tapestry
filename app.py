from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model
model = joblib.load("svc_model.pkl")

# Individual mappings
gender_mapping = {'Female': 0, 'Male': 1, 'Other': 2}
sleep_quality_mapping = {'Good': 2, 'Average': 1, 'Poor': 0}
physical_activity_mapping = {'High': 2, 'Moderate': 1, 'Low': 0}
diet_quality_mapping = {'Good': 2, 'Average': 1, 'Poor': 0}
chronic_illness_mapping = {'No': 0, 'Yes': 1}
extracurricular_mapping = {'High': 2, 'Moderate': 1, 'Low': 0}

response_mapping = {
    "Did not apply to me at all": 0,
    "Applied to me to some degree, or some of the time": 1,
    "Applied to me to a considerable degree or a good part of time": 2,
    "Applied to me very much or most of the time": 3
}

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print("\n✅ Received Data:", data)
    if not data:
        print("❌ No data received or incorrect JSON format")
        return jsonify({"error": "No data received or incorrect JSON format"}), 400
    try:
        min_age = 18
        max_age = 29
        main_features = [
            (float(data.get("age", -1)) - min_age) / (max_age - min_age),
            gender_mapping.get(data.get("gender", ""), -1),
            float(data.get("cgpa", -1)) / 10,
            sleep_quality_mapping.get(data.get("sleep_quality", ""), -1),
            physical_activity_mapping.get(data.get("physical_activity", ""), -1),
            diet_quality_mapping.get(data.get("diet_quality", ""), -1),
            chronic_illness_mapping.get(data.get("chronic_illness", ""), -1),
            extracurricular_mapping.get(data.get("extracurricular", ""), -1),
            int(data.get("financial_stress", -1))
        ]
        print("✅ Processed Main Features:", main_features)
        if -1 in main_features:
            return jsonify({"error": "Invalid feature mapping"}), 400
        
        stress_responses = [
            response_mapping.get(data.get(f"stress_{i}", ""), -1)
            for i in range(1, 8)
        ]
        depression_responses = [
            response_mapping.get(data.get(f"depression_{i}", ""), -1)
            for i in range(1, 8)
        ]
        anxiety_responses = [
            response_mapping.get(data.get(f"anxiety_{i}", ""), -1)
            for i in range(1, 8)
        ]
        
        responses = stress_responses + depression_responses + anxiety_responses 
        if -1 in responses:
            return jsonify({"error": "Invalid Likert response mapping"}), 400
        
        features = np.array([main_features + responses])
        print("✅ Final Processed Features:", features)
        prediction = model.predict(features)[0]
        print("✅ Prediction Result:", prediction)
        return jsonify({
            "prediction": prediction,
            "depression_score": round(((sum(depression_responses) * 2) / 42) * 100, 2),
            "anxiety_score": round(((sum(anxiety_responses) * 2) / 42) * 100, 2),
            "stress_score": round(((sum(stress_responses) * 2) / 42) * 100, 2)
        })
    except Exception as e:
        print("❌ Error in prediction:", str(e))
        return jsonify({"error": str(e)}), 400

@app.route('/result')
def result():
    return render_template("result.html")

if __name__ == '__main__':
    app.run(debug=True)
