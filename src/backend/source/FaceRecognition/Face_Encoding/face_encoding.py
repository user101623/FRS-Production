import face_recognition
import pickle
import os
import numpy as np

def get_all_encodings(filepath):
    # Load face encodings if file exists, create if not.
    if os.path.exists(filepath):
        with open(filepath, 'rb') as f:
            print("Loading all face encodings...")
            all_face_encodings = pickle.load(f)
    else:
        print("Creating new file for all face encodings...")
        all_face_encodings = {}
    
    return all_face_encodings

def load_all_images(path):
    images_data = []

    for class_dir in os.listdir(path):
        if not os.path.isdir(os.path.join(path, class_dir)):
            continue

        print("Loading {}'s face".format(class_dir))

        for filename in os.listdir(os.path.join(path, class_dir)):
            image = face_recognition.load_image_file(os.path.join(os.path.join(path, class_dir), filename))
            face_bounding_boxes = face_recognition.face_locations(image)
            if len(face_bounding_boxes) == 1:
                images_data.append((class_dir, image))
                break

    return images_data

def encode_new_faces(train_dir='../../../../../Data/Users', model_save_path='../../../../../Data/Model/trained_fr_model.pkl', update=False):
    __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
    path_to_encodings = os.path.join(__location__, model_save_path)
    path_to_data = os.path.join(__location__, train_dir)
    all_face_encodings = get_all_encodings(path_to_encodings)
    
    # Add new or update existing face encodings
    # for (username, image) in load_all_images(path_to_data):
    #     if (username in all_face_encodings) and (not update):
    #         print("{}'s face has already been encoded".format(username))
    #         continue
    #     else:
    #         face_bounding_boxes = face_recognition.face_locations(image)
    #         if len(face_bounding_boxes) == 1:
    #             all_face_encodings[username] = face_recognition.face_encodings(image, known_face_locations=face_bounding_boxes)[0]
    #         else:
    #             print("Image {} not suitable for training: {}".format(username, "Didn't find a face" if len(face_bounding_boxes) < 1 else "Found more than one face"))
    for filename in os.listdir(path_to_data):
        file_path = os.path.join(path_to_data, filename)

        if os.path.isfile(file_path) and filename.endswith('.npy'):
            username = os.path.splitext(filename)[0]

            if (username in all_face_encodings) and (not update):
                print("{}'s face has already been encoded".format(username))
                continue
            else:
                data = np.load(file_path)
                all_face_encodings[username] = data[0]

    with open(path_to_encodings, 'wb') as f:
        pickle.dump(all_face_encodings, f)
    
    return all_face_encodings
