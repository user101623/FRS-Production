import cv2
from sklearn import neighbors
import os
import os.path
import pickle
import face_recognition
from face_recognition.face_recognition_cli import image_files_in_folder


def train(train_dir, model_save_path=None, n_neighbors=None, knn_algo='ball_tree'):
    """
    Trains a k-nearest neighbors classifier for face recognition.

    :param train_dir: directory that contains a sub-directory for each known person, with its name.

     (View in source code to see train_dir example tree structure)

     Structure:
        <train_dir>/
        ├── <person1>/
        │   ├── <somename1>.jpeg
        │   ├── <somename2>.jpeg
        │   ├── ...
        ├── <person2>/
        │   ├── <somename1>.jpeg
        │   └── <somename2>.jpeg
        └── ...

    :param model_save_path: (optional) path to save model on disk
    :param n_neighbors: (optional) number of neighbors to weigh in classification. Chosen automatically if not specified
    :param knn_algo: (optional) underlying data structure to support knn.default is ball_tree
    :param verbose: verbosity of training
    :return: returns knn classifier that was trained on the given data.
    """
    X = []
    y = []
    __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
    train_dir = os.path.join(__location__, train_dir)
    model_save_path = os.path.join(__location__, model_save_path)

    # Loop through each person in the training set
    for class_dir in os.listdir(train_dir):
        if not os.path.isdir(os.path.join(train_dir, class_dir)):
            continue
        
        print("Loading {}'s face".format(class_dir))
        img_count = 0

        # Loop through each training image for the current person
        for img_path in image_files_in_folder(os.path.join(train_dir, class_dir)):
            # Use the first 20 images for training
            if img_count >= 20:
                break

            image = face_recognition.load_image_file(img_path)
            face_bounding_boxes = face_recognition.face_locations(image)

            if len(face_bounding_boxes) != 1:
                # If there are no people (or too many people) in a training image, skip the image.
                print("Image {} not suitable for training: {}".format(img_path, "Didn't find a face" if len(face_bounding_boxes) < 1 else "Found more than one face"))
            else:
                # Add face encoding for current image to the training set
                X.append(face_recognition.face_encodings(image, known_face_locations=face_bounding_boxes)[0])
                y.append(class_dir)
                img_count += 1

    # Determine how many neighbors to use for weighting in the KNN classifier
    if n_neighbors is None:
        n_neighbors = len(set(y))
        # n_neighbors = int(round(math.sqrt(len(X))))
        print("Chose n_neighbors automatically:", n_neighbors)

    if n_neighbors < 1:
        print("Error: Number of neighbors should be at least 1.")
        return
    
    # Create and train the KNN classifier
    knn_clf = neighbors.KNeighborsClassifier(n_neighbors=n_neighbors, algorithm=knn_algo, weights='distance')
    knn_clf.fit(X, y)

    # Save the trained KNN classifier
    if model_save_path is not None:
        with open(model_save_path, 'wb') as f:
            pickle.dump(knn_clf, f)

    return knn_clf


def load_knn_model(model_path):
    # Open the file and load the model
    with open(model_path, 'rb') as f:
        knn_clf = pickle.load(f)
    return knn_clf


def predict(knn_clf, frame, distance_threshold):
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    rgb_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
    predictions = []

    face_locations = face_recognition.face_locations(rgb_frame)

    if len(face_locations) != 0:
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        closest_distances = knn_clf.kneighbors(face_encodings, n_neighbors=1)
        are_matches = [closest_distances[0][i][0] <= distance_threshold for i in range(len(face_locations))]
        predictions = [(pred, loc) if rec else ("Unknown", loc) for pred, loc, rec in zip(knn_clf.predict(face_encodings), face_locations, are_matches)]
    return predictions
