import { React, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useVideoStream from "../backend/static/js/useVideoStream";

const Success = () => {
  const { username } = useParams();
  const { imgSrc, clearVideoStream } = useVideoStream(username);
  const navigate = useNavigate();

  const handleClearFetch = () => {
    clearVideoStream();
    navigate("/");
  };

  // useEffect(() => {
  //   console.log("Success page mounted.");

  //   return () => {
  //     console.log("Navigating away from the Success page.");
  //     // Perform cleanup, like stopping the camera
  //     clearVideoStream();
  //   };
  // }, [clearVideoStream]);

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
    </div>
  );
};

export default Success;
