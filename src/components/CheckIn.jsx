import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

const CheckIn = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [processedImage, setProcessedImage] = useState(null);
  const navigate = useNavigate();

  const handleStopWebcam = () => {
    if (webcamRef.current) {
      webcamRef.current.video.srcObject.getTracks().forEach(track => track.stop());
    }
    navigate("/");
  };

  const sendImageToBackend = async (imageSrc) => {
    const response = await fetch('http://127.0.0.1:5000/process_image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageSrc }),
    });

    const data = await response.json();
    setProcessedImage(data.processedImage);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        sendImageToBackend(imageSrc);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (processedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = processedImage;
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(webcamRef.current.getCanvas(), 0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [processedImage]);

  return (
    <div className="relative flex flex-col items-center justify-start h-screen space-y-4">
      <h2 className="mt-4">Please align your face with the webcam for check in</h2>
      <Webcam
        audio={false}
        height={250}
        width={600}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-md"
      />
      <canvas
        ref={canvasRef}
        width={600}
        height={443}
        className="absolute"
        style={{ top: '45px' }}
      />
      <button
        onClick={handleStopWebcam}
        className="bg-red-500 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Stop Webcam
      </button>
    </div>
  );
};

export default CheckIn;