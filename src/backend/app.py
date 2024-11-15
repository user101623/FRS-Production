from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from source.MediaPipe.Face_Capture import face_capture
from source.FaceRecognition.Face_Recognize import face_recognize
import base64
import cv2
import numpy as np
import json
import os

app = Flask(__name__)
CORS(app)
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

@app.route('/checkin', methods=['POST'])
def checkin():
    return Response(face_recognize.recognize(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# @app.route('/success/<username>', methods=['POST'])
@app.route('/success/<username>')
def success(username):
    return Response(face_capture.capture(username),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/update_streaming_status', methods=['POST'])
def update_streaming_status():
    data = request.json
    if 'stopped' in data:
        # Update streaming_data.json file with the new stopped value
        with open(os.path.join(__location__, 'static/json/streaming_data.json'), 'r+') as file:
            json_data = json.load(file)
            json_data['stopped'] = data['stopped']
            file.seek(0)
            json.dump(json_data, file)
            file.truncate()
        return jsonify({'status': 'success', 'stopped': data['stopped']})
    return jsonify({'status': 'error', 'message': 'Invalid data'}), 400

if __name__ == '__main__':
    app.run(debug=True)
