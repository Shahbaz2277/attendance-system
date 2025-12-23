#!/bin/bash

# Navigate to backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI app using uvicorn
uvicorn app.main:app --host 0.0.0.0 --port $PORT
