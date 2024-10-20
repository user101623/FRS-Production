import { useEffect } from "react";
import Webcam from "react-webcam";

const CheckIn = () => {
  useEffect(() => {
    alert("Please look straight into the webcam");
  }, []);

  return (
    <div className="flex flex-col items-center justify-start h-screen space-y-4">
      <h2 className="text-lg font-semibold text-white">
        Please align your face with the webcam for check-in.
      </h2>
      <Webcam className="rounded-lg shadow-md" />
    </div>
  );
};

export default CheckIn;