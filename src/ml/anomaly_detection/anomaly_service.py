from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

# Load model and encoders
model = joblib.load("anomaly_model_v3/isolation_forest_model.pkl")
encoders = joblib.load("anomaly_model_v3/label_encoders.pkl")

@app.route("/detect-anomaly", methods=["POST"])
def detect_anomaly():
    try:
        data = request.get_json()
        df = pd.DataFrame([data])

        # Encode
        df["category_encoded"] = encoders["category"].transform(df["category"])
        df["sentiment_encoded"] = encoders["sentiment"].transform(df["sentiment"])

        feature_cols = [
            "category_encoded",
            "sentiment_encoded",
            "sentiment_score",
            "hour_of_day",
            "day_of_week",
            "day_of_month"
        ]

        prediction = model.predict(df[feature_cols])
        is_anomaly = prediction[0] == -1

        return jsonify({
            "is_anomaly": bool(is_anomaly),
            "message": "Anomaly detected!" if is_anomaly else "Normal complaint"
        })
    except Exception as e:
        print("Exception occurred:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8002)
