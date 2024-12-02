import os
import cv2
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import dlib
import face_recognition

from sklearn.metrics import confusion_matrix
from source.FaceRecognition.Face_Encoding.face_encoding import encode_new_faces as train_fr
from source.FaceRecognition.Face_Recognize.face_recognize import predict as predict_fr
from fr_knn import train as train_fr_knn, predict as predict_fr_knn


testing_setup = {
    "trained_fr_model.pkl": {
        "data_directory": "../Data/Users/",
        "model_directory": "../Data/Model/",
        "training_data_length": 1,
        "train": train_fr,
        "predict": predict_fr
    },
    "trained_fr_knn_model.clf": {
        "data_directory": "Data/Users/",
        "model_directory": "Data/Model/",
        "training_data_length": 20,
        "train": train_fr_knn,
        "predict": predict_fr_knn
    }
}


# Perform training and testing
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

conf_matrices = {}

def train_and_test():
    for model_name, setup in testing_setup.items():
        print("__________________________________________________")
        print(f"\nTraining {model_name} ...")

        training_data_path = "../../../../" + setup["data_directory"]
        model_path = "../../../../" + setup["model_directory"] + model_name

        if "coors_list" in setup.keys():
            model = setup["train"](training_data_path, setup["coors_list"], model_path)
        else:
            model = setup["train"](training_data_path, model_path)

        if model is None:
            print(f"No {model_name} model found for testing!")
            continue

        print(f"\nTesting {model_name} ...")

        testing_data_path = os.path.join(__location__, "../../../../" + setup["data_directory"].replace("../", ""))
        
        # Prepare data for confusion matrix
        y_true = []  # Ground truth labels
        y_pred = []  # Predicted labels
        usernames = []
        
        for username in os.listdir(testing_data_path):
            user_folder = os.path.join(testing_data_path, username)

            if not os.path.isdir(user_folder):
                continue
            
            usernames.append(username)
            img_counter = 0

            for img_name in os.listdir(user_folder):
                img_path = os.path.join(user_folder, img_name)

                if img_path.endswith(('.png', '.jpg', '.jpeg')):
                    image = cv2.imread(img_path)  # Read the image
                    
                    rgb_img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                    face_locations = face_recognition.face_locations(rgb_img)

                    if len(face_locations) == 1:
                        img_counter += 1
                    else:
                        print(f"Warning: No face or multiple faces detected in image {img_path}")
                        continue
                    if img_counter <= setup["training_data_length"]:
                        continue

                    # Predict the user based on the image
                    if "knn" in model_name:
                        predicted_username = setup["predict"](model, image, 0.5)
                    else:
                        use_GPU = dlib.DLIB_USE_CUDA

                        # Create arrays of known face encodings and their names
                        known_face_encodings = np.array(list(model.values()))
                        known_face_names = list(model.keys())
                        predicted_username = setup["predict"](
                            image, use_GPU, True,
                            known_face_encodings,
                            known_face_names
                        )

                    if predicted_username:
                        # print(f"{username} - {predicted_username[0][0]}")
                        y_true.append(username)
                        y_pred.append(predicted_username[0][0])

        usernames.append("Unknown")
        setup["users"] = usernames
        conf_matrix = confusion_matrix(y_true, y_pred, labels=usernames)

        # Convert to percentages, handling rows with no data
        row_sums = conf_matrix.sum(axis=1, keepdims=True)
        conf_matrix_percentage = np.divide(conf_matrix, row_sums, where=row_sums!=0)

        accuracy = sum(list(map(lambda a, b: a == b, y_true, y_pred))) / len(y_true)

        print("Accuracy:", accuracy)
        conf_matrices[model_name] = conf_matrix_percentage


    fig, axes = plt.subplots(1, 2, figsize=(18, 10))
    axes = axes.flatten()

    # Plot each confusion matrix
    for ax, (model_name, conf_matrix) in zip(axes, conf_matrices.items()):
        sns.heatmap(conf_matrix, annot=True, fmt='.2f', cmap='Blues', xticklabels=testing_setup[model_name]["users"], yticklabels=testing_setup[model_name]["users"], ax=ax)
        ax.set_xlabel('Predicted')
        ax.set_ylabel('Actual')
        ax.set_title(model_name)

    # Turn off any remaining empty subplots
    for ax in axes[len(conf_matrices):]:
        ax.axis('off')

    plt.tight_layout()

    # Save the plot to a file
    output_dir = os.path.join(__location__, "../../static/images")
    os.makedirs(output_dir, exist_ok=True)  # Ensure the directory exists
    output_file = os.path.join(output_dir, "confusion_matrices.png")
    plt.savefig(output_file, dpi=300)  # Save with high resolution

    print(f"Confusion matrices saved to {output_file}")
