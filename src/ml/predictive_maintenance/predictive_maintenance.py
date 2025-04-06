# /src/ml/predictive_maintenance/predictive_maintenance.py
from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

@app.route("/predict_maintenance", methods=["GET"])
def predict_maintenance():
    category = request.args.get("category")
    if not category:
        return jsonify({"error": "No category provided"}), 400

    try:
        model = joblib.load(f"model_{category}.pkl")
        future = model.make_future_dataframe(periods=8, freq="W")
        forecast = model.predict(future)
        forecast = forecast[["ds", "yhat"]].tail(8)
        return jsonify(forecast.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8001)
