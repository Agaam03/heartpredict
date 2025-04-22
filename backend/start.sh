#!/bin/bash

# Init Git LFS dan pull model files
git lfs install
git lfs pull

# Start FastAPI
uvicorn main:app --host 0.0.0.0 --port 8000
