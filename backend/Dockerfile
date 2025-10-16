# Use the official Playwright Docker image which comes with all dependencies
# This is the easiest and most reliable method.
# backend/Dockerfile

FROM mcr.microsoft.com/playwright/python:v1.44.0-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file first
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000