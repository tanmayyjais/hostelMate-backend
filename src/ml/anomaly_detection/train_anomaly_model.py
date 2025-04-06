# train_anomaly_model.py
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Load dataset
df = pd.read_csv("complaints_for_anomaly_final.csv")

# Encode categorical fields
category_encoder = LabelEncoder()
sentiment_encoder = LabelEncoder()

df["category_encoded"] = category_encoder.fit_transform(df["category"])
df["sentiment_encoded"] = sentiment_encoder.fit_transform(df["sentiment"])

# Final features for training
feature_cols = [
    "category_encoded",
    "sentiment_encoded",
    "sentiment_score",
    "hour_of_day",
    "day_of_week",
    "day_of_month"
]

X = df[feature_cols]

# Train Isolation Forest
model = IsolationForest(n_estimators=100, contamination=0.03, random_state=42)
model.fit(X)

# Save model and encoders
os.makedirs("anomaly_model_v3", exist_ok=True)
joblib.dump(model, "anomaly_model_v3/isolation_forest_model.pkl")
joblib.dump({
    "category": category_encoder,
    "sentiment": sentiment_encoder
}, "anomaly_model_v3/label_encoders.pkl")

print("✅ Model and encoders saved.")
