import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Register from "./components/Register";
import CheckIn from "./components/CheckIn";
import { Route, Routes } from "react-router-dom";
// import useNavigate from "react-router-dom"
// import {useState } from 'react'

const App = () => {
  // const [username, setUsername] = useState("")
  // const navigate = useNavigate();
  
  // const handleUserRegistration = (user) => {
  //   setUsername(user);
  //   navigate(`/success/${user}`);
  // };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register 
          // onUserRegistration={handleUserRegistration} 
          />} />
          <Route path="/check-in" element={<CheckIn />} />
          {/* <Route path="/success/:name" element={<Success />} /> */}
        </Routes>
      </div>
    </>
  );
};

export default App;
