#!/bin/bash

# Start FastAPI app from backend folder
uvicorn app.main:app --host 0.0.0.0 --port $PORT
