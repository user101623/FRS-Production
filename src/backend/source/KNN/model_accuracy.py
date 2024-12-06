import os
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import face_recognition
import shutil

from sklearn.metrics import confusion_matrix
from source.FaceRecognition.Face_Encoding.face_encoding import encode_new_faces as train_fr
from source.FaceRecognition.Face_Recognize.face_recognize import best_match_face as predict_fr
from .fr_knn import train as train_fr_knn, predict as predict_fr_knn


__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
conf_matrices = {}
testing_setup = {
    "trained_fr_model.pkl": {
        "description": "Face Recognition library",
        "data_directory": "../Data/Users/",
        "model_directory": "../Data/Model/",
        "training_data_length": 1,
        "train": train_fr,
        "predict": predict_fr
    },
    "trained_fr_knn_model.clf": {
        "description": "Face Recognition library and KNN",
        "data_directory": "Data/Users/",
        "model_directory": "Data/Model/",
        "training_data_length": 20,
        "train": train_fr_knn,
        "predict": predict_fr_knn
    }
}


def convert_new_images_to_numpy(data_path):
    for username in os.listdir(data_path):
        image_folder = os.path.join(data_path, username)
        if not os.path.isdir(image_folder):
            continue

        encodings = []
        print("Converting {}'s images to numpy file".format(username))

        for filename in os.listdir(image_folder):
            print(filename)
            image = face_recognition.load_image_file(os.path.join(image_folder, filename))
            face_bounding_boxes = face_recognition.face_locations(image)
            if len(face_bounding_boxes) == 1:
                encoding = face_recognition.face_encodings(image, known_face_locations=face_bounding_boxes)[0]
                encodings.append(encoding)
        
        np_data = np.array(encodings)
        np.save(data_path + "/{}.npy".format(username), np_data)
        shutil.rmtree(image_folder)


def train_and_test():
    for model_name, setup in testing_setup.items():
        print("__________________________________________________")
        print(f"\nTraining {model_name} ...")

        testing_data_path = os.path.join(__location__, "../../../../" + setup["data_directory"].replace("../", ""))
        training_data_path = "../../../../" + setup["data_directory"]
        model_path = "../../../../" + setup["model_directory"] + model_name

        convert_new_images_to_numpy(testing_data_path)

        model = setup["train"](training_data_path, model_path)

        if model is None:
            print(f"No {model_name} model found for testing!")
            continue

        print(f"\nTesting {model_name} ...")
        
        # Prepare data for confusion matrix
        x_test = []
        y_true = []  # Ground truth labels
        y_pred = []  # Predicted labels
        usernames = []
        distance_threshold = 0.5

        for filename in os.listdir(testing_data_path):
            file_path = os.path.join(testing_data_path, filename)

            if os.path.isfile(file_path) and filename.endswith('.npy'):
                data = np.load(file_path)

                username = os.path.splitext(filename)[0]
                usernames.append(username)

                # Skip the first n encoding used in the training
                for encoding in data[setup["training_data_length"]:]:
                    x_test.append(encoding)
                    y_true.append(username)

        if "knn" in model_name:
            closest_distances = model.kneighbors(x_test, n_neighbors=1)
            are_matches = [closest_distances[0][i][0] <= distance_threshold for i in range(len(x_test))]
            y_pred = [pred if rec else "Unknown" for pred, rec in zip(model.predict(x_test), are_matches)]
        else:
            known_face_encodings = np.array(list(model.values()))
            known_face_names = list(model.keys())
            y_pred = setup["predict"](np.array(x_test), known_face_encodings, known_face_names)

        usernames.append("Unknown")
        setup["users"] = usernames
        conf_matrix = confusion_matrix(y_true, y_pred, labels=usernames)

        # Convert to percentages, handling rows with no data
        row_sums = conf_matrix.sum(axis=1, keepdims=True)
        conf_matrix_percentage = np.divide(conf_matrix, row_sums, where=row_sums!=0)
        conf_matrices[model_name] = conf_matrix_percentage
        setup["conf_matrix"] = conf_matrix_percentage

        accuracy = sum(list(map(lambda a, b: a == b, y_true, y_pred))) / len(y_true)
        setup["accuracy"] = accuracy
        print("Accuracy:", accuracy)


    # Plot confusion matrices and save them as an image file
    fig, axes = plt.subplots(1, 2, figsize=(18, 10))
    fig.patch.set_facecolor('#111111')
    axes = axes.flatten()

    # Plot each confusion matrix
    for ax, setup in zip(axes, testing_setup.values()):
        cbar = sns.heatmap(
            setup["conf_matrix"],
            cmap='rocket',
            # xticklabels=testing_setup[model_name]["users"],
            # yticklabels=testing_setup[model_name]["users"],
            xticklabels=False,
            yticklabels=False,
            ax=ax
        ).collections[0].colorbar

        cbar.ax.tick_params(labelsize=14, colors='white')
        ax.set_xlabel('Predicted', color='white', fontsize=14)
        ax.set_ylabel('Actual', color='white', fontsize=14)
        ax.set_title(f'{setup["description"]} (Accuracy: {setup["accuracy"]*100:.2f}%)', color='white', fontsize=16, fontweight='bold')

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

train_and_test()
