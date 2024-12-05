import { useParams, useNavigate } from "react-router-dom";
import useVideoStream from "../backend/static/js/useVideoStream";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const Success = () => {
  const { username } = useParams();
  const { imgSrc, clearVideoStream } = useVideoStream(username);
  const navigate = useNavigate();
  const [processingMessage, setProcessingMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClearFetch = () => {
    clearVideoStream();
    navigate("/");
  };

  useEffect(() => {
    const startProcessing = async () => {
      setIsModalOpen(true); // Open the modal
      const response = await fetch(`http://127.0.0.1:5000/success/${username}`, {
        method: 'POST',
      });
      const data = await response.json();
      setProcessingMessage(data.message); // Set the processing message
    };

    startProcessing();
  }, [username]);

  return (
    <div className="flex flex-col items-center justify-start h-screen space-y-4">
      <h1 className="text-4xl font-bold">Welcome, {username}!</h1>
      <p className="mt-4">You have successfully registered.</p>
      {processingMessage && <p className="text-lg text-orange-500">{processingMessage}</p>}
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white text-center w-full">Processing...</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-6 w-6 text-gray-400 hover:text-gray-200" />
              </button>
            </div>
            <p className="text-gray-300 text-center">Please wait while we process your data.</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-md w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Success;
