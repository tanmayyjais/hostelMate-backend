# /src/ml/predictive_maintenance/train_predictive_model.py
import pandas as pd
from prophet import Prophet
import joblib

df = pd.read_csv("maintenance_complaints.csv")
df["created_at"] = pd.to_datetime(df["created_at"])

for category in df["category"].unique():
    cat_df = df[df["category"] == category]
    daily = cat_df.groupby(cat_df["created_at"].dt.to_period("W")).size().reset_index()
    daily.columns = ["ds", "y"]
    daily["ds"] = daily["ds"].dt.start_time

    model = Prophet()
    model.fit(daily)

    future = model.make_future_dataframe(periods=8, freq="W")
    forecast = model.predict(future)

    joblib.dump(model, f"model_{category}.pkl")