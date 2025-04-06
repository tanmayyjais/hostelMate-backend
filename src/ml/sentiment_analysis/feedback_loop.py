# Simulates retraining or extending model based on newly labeled complaints
import pandas as pd

def add_feedback(text, label):
    df = pd.read_csv("complaints_labeled.csv")
    df = df._append({'text': text, 'label': label}, ignore_index=True)
    df.to_csv("complaints_labeled.csv", index=False)
    print("New feedback added. Re-train the model for improvement.")

# Example usage
# add_feedback("This issue has not been resolved in a week!", "very_negative")
