import React from "react";
import { useParams } from "react-router-dom";

const Success = () => {
  const { username } = useParams();

  return (
    <div className="flex flex-col items-center justify-start h-screen space-y-4">
      <h1 className="text-4xl font-bold text-white">Welcome, {username}!</h1>
      <p className="mt-4 text-white">You have successfully registered.</p>
      <img
        id="videoStream"
        src={`http://127.0.0.1:5000/success/${username}`}
        width="600px"
        alt="Video Stream"
        className="rounded-lg shadow-md"
      />
      <h2 className="text-lg text-white">
        Align your face with the webcam
      </h2>
    </div>
  );
};

export default Success;
