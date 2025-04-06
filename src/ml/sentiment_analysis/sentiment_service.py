from flask import Flask, request, jsonify
from transformers import BertTokenizer, BertForSequenceClassification
import torch

app = Flask(__name__)

model_path = "./sentiment_model"
model = BertForSequenceClassification.from_pretrained(model_path)
tokenizer = BertTokenizer.from_pretrained(model_path)

@app.route("/analyze", methods=["POST"])
def analyze_sentiment():
    data = request.get_json()
    text = data.get("text")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    outputs = model(**inputs)

    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    confidence, predicted_class = torch.max(probs, dim=1)

    label_map = {
        0: "very_negative",
        1: "negative",
        2: "neutral",
        3: "positive",
        4: "very_positive",
    }

    return jsonify({
        "sentiment": label_map[predicted_class.item()],
        "confidence": round(confidence.item(), 4)
    })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)