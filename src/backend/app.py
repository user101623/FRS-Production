from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from source.MediaPipe.Face_Capture import face_capture
from source.FaceRecognition.Face_Recognize import face_recognize
import base64
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/checkin', methods=['POST'])
def checkin():
    return Response(face_recognize.recognize(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/success/<username>', methods=['POST'])
def success(username):
    try:
        success_message = face_capture.capture(username)
        return jsonify({"message": "Image received successfully!"}), 200
    except Exception as e:
        print(f"Error during capture: {e}")
        return jsonify({"error": "Failed to process image"}), 500

if __name__ == '__main__':
    app.run(debug=True)