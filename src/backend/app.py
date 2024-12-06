from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
import json
import os
import dlib

from source.MediaPipe.Face_Capture import face_capture
from source.FaceRecognition.Face_Recognize import face_recognize
from source.KNN import model_accuracy
from source.KNN import fr_knn

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
app = Flask(__name__)
CORS(app)
use_GPU = dlib.DLIB_USE_CUDA
if use_GPU:
    print("Using GPU for face recognition")
else:
    print("Using CPU for face recognition")

model_path = os.path.join(__location__, "../../Data/Model/trained_fr_knn_model.clf")
if os.path.isfile(model_path):
    model = fr_knn.load_knn_model(model_path=model_path)
else:
    model = None

@app.route('/checkin', methods=['POST'])
def checkin():
    return Response(face_recognize.recognize(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

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

@app.route('/train_data', methods=['POST'])
def train_data():
    """
    Endpoint to trigger training.
    """
    try:
        # Simulate training process
        print(f"Starting training...")
        model_accuracy.train_and_test()
        print(f"Training completed.")

        # Return a success response
        return jsonify({"message": f"Training completed"}), 200
    except Exception as e:
        print(f"Error during training: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/process_image', methods=['POST'])
def process_image():
    data = request.json
    image_data = data['image'].split(',')[1]
    image = base64.b64decode(image_data)
    np_image = np.frombuffer(image, np.uint8)
    frame = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
    frame = cv2.flip(frame, 1)

    if model:
        if use_GPU:
            predictions = fr_knn.predict(model, frame, 0.5)
        else:
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            predictions = fr_knn.predict(model, small_frame, 0.5)

    for name, (top, right, bottom, left) in predictions:
        if not use_GPU:
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4
        cv2.rectangle(frame, (left, top), (right, bottom), (255, 255, 255), 5)

        # Draw a label with a name below the face
        font = cv2.FONT_HERSHEY_DUPLEX
        if name == "Unknown":
            cv2.putText(frame, name, (left, bottom + 25), font, 1, (0, 0, 255), 2)
        else:
            cv2.putText(frame, name, (left, bottom + 25), font, 1, (0, 255, 0), 2)

    _, buffer = cv2.imencode('.jpg', frame)
    processed_image_base64 = base64.b64encode(buffer).decode('utf-8')
    return jsonify({'processedImage': f"data:image/jpeg;base64,{processed_image_base64}"})

if __name__ == '__main__':
    app.run(debug=True)
