from flask import Flask, request, jsonify, render_template, redirect, url_for
# from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model
model = joblib.load("random_forest_model.pkl")

# Unified mappings dictionary (Main Features + Likert-scale Questions)
mappings = {
    # Main Features
    'Gender': {'Male': 1, 'Female': 2, 'Other': 3},
    'Sleep_Quality': {'Good': 2, 'Average': 1, 'Poor': 0},
    'Diet_Quality': {'Good': 2, 'Average': 1, 'Poor': 0},
    'Physical_Activity': {'High': 2, 'Moderate': 1, 'Low': 0},
    'Extracurricular_Involvement': {'High': 2, 'Moderate': 1, 'Low': 0},
    'Chronic_Illness': {'No': 0, 'Yes': 1},

    # Likert-scale Questions
    "I couldn't seem to experience any positive feeling at all": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                                                  "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I found it difficult to work up the initiative to do things": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                                                    "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I felt that I had nothing to look forward to": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                                     "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I felt down-hearted and blue": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                     "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I was unable to become enthusiastic about anything": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                         "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I felt I wasn't worth much as a person": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                                                                        "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I felt that life was meaningless": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                         "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},

    "I was aware of dryness of my mouth": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I experienced trembling (e.g. in the hands)": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I was worried about situations in which I might panic and make a fool of myself": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I felt I was close to panic": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I felt scared without any good reason": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},

    "I found it hard to wind down": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I tended to over-react to situations": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I felt that I was using a lot of nervous energy": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I found myself getting agitated": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I found it difficult to relax": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I was intolerant of anything that kept me from getting on with what I was doing": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                                                                        "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3},
    "I felt that I was rather touchy": {"Did not apply to me at all": 0, "Applied to me to some degree, or some of the time": 1,
                                           "Applied to me to a considerable degree or a good part of time": 2, "Applied to me very much or most of the time": 3}
}

# Mapping frontend keys (e.g., "depression_1") to actual questions
likert_question_mapping = {
    # Depression Questions
    "depression_1": "I couldn't seem to experience any positive feeling at all",
    "depression_2": "I found it difficult to work up the initiative to do things",
    "depression_3": "I felt that I had nothing to look forward to",
    "depression_4": "I felt down-hearted and blue",
    "depression_5": "I was unable to become enthusiastic about anything",
    "depression_6": "I felt I wasn't worth much as a person",
    "depression_7": "I felt that life was meaningless",

    # Anxiety Questions
    "anxiety_1": "I was aware of dryness of my mouth",
    "anxiety_2": "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)",
    "anxiety_3": "I experienced trembling (e.g. in the hands)",
    "anxiety_4": "I was worried about situations in which I might panic and make a fool of myself",
    "anxiety_5": "I felt I was close to panic",
    "anxiety_6": "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)",
    "anxiety_7": "I felt scared without any good reason",

    # Stress Questions
    "stress_1": "I found it hard to wind down",
    "stress_2": "I tended to over-react to situations",
    "stress_3": "I felt that I was using a lot of nervous energy",
    "stress_4": "I found myself getting agitated",
    "stress_5": "I found it difficult to relax",
    "stress_6": "I was intolerant of anything that kept me from getting on with what I was doing",
    "stress_7": "I felt that I was rather touchy"
}

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print("\n✅ Received Data:", data)  # Debugging: Print received form data

    if not data:
        print("❌ No data received or incorrect JSON format")
        return jsonify({"error": "No data received or incorrect JSON format"}), 400

    try:
        # Function to safely map categorical responses to numerical values
        def map_feature(category, value):
            mapped_value = mappings.get(category, {}).get(value.strip(), -1)
            if mapped_value == -1:
                print(f"⚠️ Mapping issue: Feature '{category}' received '{value}', but no match found!")
            return mapped_value

        # Extract main features safely
        age = int(data.get("age", 0))
        gender = map_feature("Gender", data.get("gender", ""))
        cgpa = float(data.get("cgpa", 0.0))
        sleep_quality = map_feature("Sleep_Quality", data.get("sleep_quality", ""))
        diet_quality = map_feature("Diet_Quality", data.get("diet_quality", ""))
        physical_activity = map_feature("Physical_Activity", data.get("physical_activity", ""))
        extracurricular = map_feature("Extracurricular_Involvement", data.get("extracurricular", ""))
        chronic_illness = map_feature("Chronic_Illness", data.get("chronic_illness", ""))
        financial_stress = int(data.get("financial_stress", 0))

        # Store main feature values
        main_features = [age, gender, cgpa, sleep_quality, diet_quality, physical_activity,
                         extracurricular, chronic_illness, financial_stress]

        print("✅ Processed Main Features:", main_features)

        # Ensure no missing (-1) values in main features
        if -1 in main_features:
            return jsonify({"error": "One or more main features could not be mapped."}), 400

        # Convert Likert-scale responses
        responses = []
        for key, question in likert_question_mapping.items():
            user_response = data.get(key, "").strip()
            question_mappings = mappings.get(question, {})

            # Normalize mapping keys for case insensitivity
            normalized_mapping = {k.strip().lower(): v for k, v in question_mappings.items()}
            mapped_value = normalized_mapping.get(user_response.lower(), -1)

            if mapped_value == -1:
                print(f"⚠️ Mapping issue: '{user_response}' not found for '{question}'. Available options: {list(normalized_mapping.keys())}")

            responses.append(mapped_value)

        # Ensure no missing (-1) values in responses
        if -1 in responses:
            return jsonify({"error": "One or more Likert-scale responses could not be mapped."}), 400

        # Combine all features into an array
        features = np.array([main_features + responses])

        print("✅ Final Processed Features:", features)

        # Predict using trained model
        prediction = model.predict(features)[0]
        print("✅ Prediction Result:", prediction)

        # Calculate Depression, Anxiety, and Stress Scores
        def calculate_score(keys):
            total_score = sum([mappings[likert_question_mapping[k]][data[k]] for k in keys])
            return round(((total_score * 2) / 42) * 100, 2)

        depression_keys = ["depression_1", "depression_2", "depression_3", "depression_4", "depression_5", "depression_6", "depression_7"]
        anxiety_keys = ["anxiety_1", "anxiety_2", "anxiety_3", "anxiety_4", "anxiety_5", "anxiety_6", "anxiety_7"]
        stress_keys = ["stress_1", "stress_2", "stress_3", "stress_4", "stress_5", "stress_6", "stress_7"]

        depression_score = calculate_score(depression_keys)
        anxiety_score = calculate_score(anxiety_keys)
        stress_score = calculate_score(stress_keys)

        return jsonify({
            "prediction": int(prediction),
            "depression_score": depression_score,
            "anxiety_score": anxiety_score,
            "stress_score": stress_score
        })

    except Exception as e:
        print("❌ Error in prediction:", str(e))
        return jsonify({"error": str(e)}), 400

@app.route('/result')
def result():
    return render_template("result.html")


if __name__ == '__main__':
    app.run(debug=True)
