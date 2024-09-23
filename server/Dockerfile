# Use the official Python image from the Docker Hub
FROM python:3.9.5-slim

# Set the working directory in the container
WORKDIR /server

# Copy the requirements.txt file to the container
COPY requirements.txt .

# Install the dependencies specified in the requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . .

# Expose port 5000 for Flask
EXPOSE 5000

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV PYTHONPATH=/server
# Set the entrypoint command to run the Flask app
# CMD ["python", "app.py"]
# CMD ["flask", "--app", ".", "run", "--debug", "--host=0.0.0.0"]
# run a script that will start the server
CMD ["bash", "./entry_point.sh"]