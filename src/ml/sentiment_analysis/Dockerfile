FROM python:3.10-slim
WORKDIR /app

COPY . /app
RUN pip install transformers flask torch

EXPOSE 8000
CMD ["python", "sentiment_service.py"]
