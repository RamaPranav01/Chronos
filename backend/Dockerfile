# Use a modern, slim Python base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies if needed (e.g., for Playwright)
# RUN apt-get update && apt-get install -y ...

# Copy the requirements file first to leverage Docker's layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
# Copy the entire backend application context
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# The command to run the application will be provided by docker-compose.yml