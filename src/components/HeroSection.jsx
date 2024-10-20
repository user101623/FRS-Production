import { Link } from "react-router-dom";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";

const HeroSection = () => {
  return (
    <div id="home" className="flex flex-col items-center mt-2 lg:mt-4">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide leading-tight">
        Face recognition
        <span className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
          {" "}
          made simple
        </span>
      </h1>
      <p className="mt-3 text-lg text-center text-neutral-500 max-w-4xl">
        Enhance your face recognition experience by seamlessly registering and
        checking in every face. Use our powerful tools to unlock new
        possibilities and create unforgettable interactions!
      </p>
      <div className="flex mt-10 justify-center space-x-4">
        <Link to="/register">
          <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-200">
            Register
          </button>
        </Link>
        <Link to="/check-in">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
            Check In
          </button>
        </Link>
      </div>
      <div className="flex mt-10 justify-center">
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4"
        >
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4"
        >
          <source src={video2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default HeroSection;
