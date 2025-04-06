from transformers import BertTokenizerFast, BertForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
import torch
import pandas as pd
import numpy as np
from datasets import Dataset
import evaluate

df = pd.read_csv("complaints_labeled.csv")
label2id = {label: i for i, label in enumerate(df['label'].unique())}
id2label = {i: label for label, i in label2id.items()}
df['label_id'] = df['label'].map(label2id)

train_texts, val_texts, train_labels, val_labels = train_test_split(
    df['text'], df['label_id'], test_size=0.2, random_state=42
)

tokenizer = BertTokenizerFast.from_pretrained('bert-base-uncased')

train_encodings = tokenizer(list(train_texts), truncation=True, padding=True)
val_encodings = tokenizer(list(val_texts), truncation=True, padding=True)

train_dataset = Dataset.from_dict({**train_encodings, 'label': train_labels.tolist()})
val_dataset = Dataset.from_dict({**val_encodings, 'label': val_labels.tolist()})

model = BertForSequenceClassification.from_pretrained(
    'bert-base-uncased', num_labels=len(label2id), id2label=id2label, label2id=label2id
)

training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
)

def compute_metrics(eval_pred):
    metric = evaluate.load("accuracy")
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return metric.compute(predictions=predictions, references=labels)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
)

trainer.train()
model.save_pretrained("./sentiment_model")
tokenizer.save_pretrained("./sentiment_model")
