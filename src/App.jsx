import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Register from "./components/Register";
import CheckIn from "./components/CheckIn";
import Success from "./components/Success";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/success/:username" element={<Success />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
