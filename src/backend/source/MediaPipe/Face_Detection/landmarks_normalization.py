import numpy as np
import math


def center_landmarks(landmarks):    
    # Compute the centroid of the landmarks (mean of all points)
    centroid = np.mean(landmarks, axis=0)
    
    # Center the landmarks by subtracting the centroid
    centered_landmarks = landmarks - centroid
    
    return centered_landmarks, centroid


def reposition_landmarks(centered_landmarks, centroid):
    # Add the centroid back to reposition the landmarks to their original location
    repositioned_landmarks = centered_landmarks + centroid
    return repositioned_landmarks


def scale_landmarks(centered_landmarks, w, h, d):
    scale_matrix = np.array([
        [w, 0, 0],
        [0, h, 0],
        [0, 0, d]
    ])

    # Scale the landmarks to have a consistent size
    scaled_landmarks = np.dot(centered_landmarks, scale_matrix)
    
    return scaled_landmarks


def standardize_landmarks(landmarks, w, h, d=585):
    # Scale the landmarks
    standardized_landmarks = scale_landmarks(landmarks, w, h, d)

    # Center the landmarks
    centered_landmarks, centroid = center_landmarks(standardized_landmarks)
    
    return centered_landmarks, centroid


def unstandardize_landmarks(landmarks, centroid, w, h, d=585):
    # Add the centroid back to reposition the landmarks
    repositioned_landmarks = reposition_landmarks(landmarks, centroid)

    # Convert the landmarks back to their original location
    rescaled_landmarks = scale_landmarks(repositioned_landmarks, 1/w, 1/h, 1/d)
    
    return rescaled_landmarks


# Calculate roll, yaw, and pitch using facial landmarks (assumed to be pre-defined indices)
def calculate_roll(left_eye, right_eye):
    delta_y = right_eye[1] - left_eye[1]
    delta_x = right_eye[0] - left_eye[0]
    return -np.arctan2(delta_y, delta_x) - math.pi


def calculate_yaw(left_eye, right_eye):
    delta_z = right_eye[2] - left_eye[2]
    delta_x = right_eye[0] - left_eye[0]
    return np.arctan2(delta_z, delta_x) - math.pi


def calculate_pitch(left_eye, right_eye, left_mouth, right_mouth):
    eye_center = (left_eye + right_eye) / 2.0
    mouth_center = (left_mouth + right_mouth) /2.0
    delta_z = mouth_center[2] - eye_center[2]
    delta_y = mouth_center[1] - eye_center[1]
    return -np.arctan2(delta_z, delta_y)


# Alignment using roll, yaw, and pitch
def rotate_landmarks(landmarks, left_eye_idx, right_eye_idx, left_mouth_idx, right_mouth_idx):
    # Compute rotation matrices for roll, yaw, and pitch
    pitch = calculate_pitch(
        landmarks[left_eye_idx], landmarks[right_eye_idx],
        landmarks[left_mouth_idx], landmarks[right_mouth_idx]
    )
    R_x = np.array([[1, 0, 0],
                    [0, np.cos(pitch), -np.sin(pitch)],
                    [0, np.sin(pitch), np.cos(pitch)]])
    landmarks = np.dot(landmarks, R_x.T)
    
    yaw = calculate_yaw(
        landmarks[left_eye_idx], landmarks[right_eye_idx]
    )
    R_y = np.array([[np.cos(yaw), 0, np.sin(yaw)],
                    [0, 1, 0],
                    [-np.sin(yaw), 0, np.cos(yaw)]])
    landmarks = np.dot(landmarks, R_y.T)
    
    roll = calculate_roll(
        landmarks[left_eye_idx], landmarks[right_eye_idx]
    )
    R_z = np.array([[np.cos(roll), -np.sin(roll), 0],
                    [np.sin(roll), np.cos(roll), 0],
                    [0, 0, 1]])
    landmarks = np.dot(landmarks, R_z.T)
    
    return landmarks


def normalize_landmarks(landmarkList, w, h):
    left_eye_idx = 263
    right_eye_idx = 33
    left_mouth_idx = 291
    right_mouth_idx = 61

    landmarkList = np.array(landmarkList)
    landmarkList, centroid = standardize_landmarks(landmarkList, w, h)
    landmarkList = rotate_landmarks(
        landmarkList,
        left_eye_idx,
        right_eye_idx,
        left_mouth_idx,
        right_mouth_idx
    )
    landmarkList = unstandardize_landmarks(landmarkList, centroid, w, h)

    return landmarkList
