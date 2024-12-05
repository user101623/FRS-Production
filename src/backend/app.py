from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from source.MediaPipe.Face_Capture import face_capture
from source.FaceRecognition.Face_Recognize import face_recognize
from source.KNN import model_accuracy
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
@app.route('/success/<username>', methods=['POST'])
def success(username):
    # Capture the image for the user
    face_capture.capture(username)
    
    # Call the train_and_test function after capturing the image
    try:
        print(f"Starting training after capturing images for {username}...")
        model_accuracy.train_and_test()
        print("Training completed successfully.")
    except Exception as e:
        print(f"Error during training: {e}")

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

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    last_face_coordinates = None
    stable_face_coordinates = None
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=3)

    if len(faces) > 0:
        last_face_coordinates = faces[0]
        stable_face_coordinates = last_face_coordinates
    else:
        if stable_face_coordinates is not None:
            last_face_coordinates = stable_face_coordinates
    if last_face_coordinates is not None:
        x, y, w, h = last_face_coordinates
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 255, 255), 5)

    _, buffer = cv2.imencode('.jpg', frame)
    processed_image_base64 = base64.b64encode(buffer).decode('utf-8')
    return jsonify({'processedImage': f"data:image/jpeg;base64,{processed_image_base64}"})

if __name__ == '__main__':
    app.run(debug=True)
