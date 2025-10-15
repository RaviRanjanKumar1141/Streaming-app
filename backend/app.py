from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables from .env if present
load_dotenv()

# Connect to MongoDB Atlas via environment variable
mongo_uri = os.getenv("MONGODB_URI", "")
if not mongo_uri:
    print("Warning: MONGODB_URI not set. Please set the environment variable with your MongoDB Atlas URI.")
client = MongoClient(mongo_uri) if mongo_uri else MongoClient()

# Ping test (to confirm connection)
try:
    client.admin.command("ping")
    print("Successfully connected to MongoDB Atlas!")
except Exception as e:
    print("Connection error:", e)

# Use database and collection
db = client["LiveStream"]
overlays = db["overlays"]

# CRUD APIs
# Create Overlay
@app.route("/overlay", methods=["POST"])
def create_overlay():
    data = request.json
    if not data.get("name"):
        return jsonify({"error": "Overlay must have a name"}), 400
    overlays.insert_one(data)
    return jsonify({"message": "Overlay created successfully"}), 201


# Read All Overlays
@app.route("/overlay", methods=["GET"])
def get_overlays():
    data = list(overlays.find({}, {"_id": 0}))  # exclude _id for clean JSON
    return jsonify(data), 200


# Read One Overlay by name
@app.route("/overlay/<string:name>", methods=["GET"])
def get_overlay(name):
    overlay = overlays.find_one({"name": name}, {"_id": 0})
    if overlay:
        return jsonify(overlay), 200
    return jsonify({"error": "Overlay not found"}), 404


# Update Overlay by name
@app.route("/overlay/<string:name>", methods=["PUT"])
def update_overlay(name):
    data = request.json
    result = overlays.update_one({"name": name}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Overlay not found"}), 404
    return jsonify({"message": "Overlay updated successfully"}), 200


# Delete Overlay by name
@app.route("/overlay/<string:name>", methods=["DELETE"])
def delete_overlay(name):
    result = overlays.delete_one({"name": name})
    if result.deleted_count == 0:
        return jsonify({"error": "Overlay not found"}), 404
    return jsonify({"message": "Overlay deleted successfully"}), 200

@app.route("/")
def home():
    return "Backend connected to MongoDB Atlas!"

if __name__ == "__main__":
    app.run(debug=True)