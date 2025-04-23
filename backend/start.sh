#!/bin/bash

# Start FastAPI dengan port yang disediakan oleh Railway
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}