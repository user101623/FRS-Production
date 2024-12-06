import { useParams, useNavigate } from "react-router-dom";
import useVideoStream from "../backend/static/js/useVideoStream";
import { useEffect, useState } from "react";

const Success = () => {
    const { username } = useParams();
    const { imgSrc, clearVideoStream, isModalOpen, setIsModalOpen, startTraining } = useVideoStream(username);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");

    const handleClearFetch = () => {
        clearVideoStream();
        navigate("/");
    };

    const initiateTraining = async () => {
        setModalMessage("Starting to train the model with your data...");
        setIsModalOpen(true);
        startTraining(); // Call to indicate training has started

        try {
            const response = await fetch('http://127.0.0.1:5000/train_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log(data.message); // Log the response message

            // After training is complete, update the modal message
            setModalMessage("Training complete! Would you like to go back to the home page or register a new user?");
        } catch (error) {
            console.error('Error during training:', error);
            setModalMessage("An error occurred during training.");
        }
    };

    const handleBackToHome = () => {
        setIsModalOpen(false);
        navigate("/");
    };

    const handleRegisterNewUser = () => {
        setIsModalOpen(false);
        navigate("/register"); // Adjust the route as necessary for registration
    };

    useEffect(() => {
        if (isModalOpen) {
            initiateTraining(); // Start training only when the modal is opened
        }
    }, [isModalOpen]);

    return (
        <div className="flex flex-col items-center justify-start h-screen space-y-4">
            <h1 className="text-4xl font-bold">Welcome, {username}!</h1>
            <p className="mt-4">You have successfully registered.</p>
            <div id="imageContainer">
                <img
                    id="videoStream"
                    src={imgSrc}
                    width="600px"
                    alt="Video Stream"
                    className="rounded-lg shadow-md"
                />
            </div>
            <button
                onClick={handleClearFetch}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
                Clear Fetch
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="bg-gray-800 rounded-lg p-4 w-11/12 max-w-md">
                        <h2 className="text-lg font-bold text-white text-center">Processing...</h2>
                        <p className="text-gray-300 text-center">{modalMessage}</p>
                        <div className="flex justify-around mt-4">
                            <button
                                onClick={handleBackToHome}
                                className="bg-green-500 text-white py-2 px-4 rounded"
                            >
                                Go to Home
                            </button>
                            <button
                                onClick={handleRegisterNewUser}
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Register New User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Success;