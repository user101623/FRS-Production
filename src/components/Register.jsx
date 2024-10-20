import { useState } from "react";
import { X } from "lucide-react";
import { termsAndConditions } from "../constants";

const RegisterUser = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="container mx-auto flex-grow text-white">
        <h1 className="text-4xl font-bold text-center mb-8">
          Register New User
        </h1>
        <div className="login-form p-6 rounded-lg shadow-md w-full max-w-md mx-auto border border-gray-700">
          {" "}
          <form
            action="http://localhost:5173/login"
            method="post"
            className="space-y-4"
          >
            <div>
              <label htmlFor="username" className="block text-gray-300">
                Enter your Username:
              </label>{" "}
              <input
                type="text"
                name="username"
                id="username"
                className="w-full mt-2 p-2 border border-gray-600 rounded bg-transparent text-white focus:ring-2 focus:ring-orange-500" // Set background to transparent
                required
              />
            </div>
            <div>
              <input
                type="submit"
                value="Submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" // Button color
              />
            </div>
          </form>
          <div className="mt-4 px-2 text-center">
            <span
              className="cursor-pointer text-orange-400 hover:underline"
              onClick={toggleModal}
            >
              Terms and Conditions
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            {" "}
            <div className="bg-gray-800 rounded-lg p-4 w-11/12 max-w-3xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white text-center w-full">
                  Terms and Conditions
                </h2>
                <button onClick={toggleModal}>
                  <X className="h-6 w-6 text-gray-400 hover:text-gray-200" />
                </button>
              </div>
              {termsAndConditions.map((term, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-md font-semibold text-orange-300">
                    {term.text}
                  </h4>
                  <p className="text-gray-300 text-sm">{term.description}</p>
                </div>
              ))}
              <button
                className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-md w-full"
                onClick={toggleModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RegisterUser;

// import { useState } from "react";
// import { X } from "lucide-react";
// import { termsAndConditions } from "../constants";

// const RegisterUser = () => {
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleModal = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     navigate(`/success/${username}`);
//   };

//   return (
//     <>
//       <div className="container mx-auto flex-grow text-white">
//         <h1 className="text-4xl font-bold text-center mb-8">
//           Register New User
//         </h1>
//         <div className="login-form p-6 rounded-lg shadow-md w-full max-w-md mx-auto border border-gray-700">
//           {" "}
//           <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Enter your username"
//           className="border rounded p-2"
//           required
//         />
//         <button type="submit" className="bg-blue-500 text-white p-2 rounded">
//           Submit
//         </button>
//       </form>
//     </div>
//           <div className="mt-4 px-2 text-center">
//             <span
//               className="cursor-pointer text-orange-400 hover:underline"
//               onClick={toggleModal}
//             >
//               Terms and Conditions
//             </span>
//           </div>
//         </div>

//         {isOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//             {" "}
//             <div className="bg-gray-800 rounded-lg p-4 w-11/12 max-w-3xl">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-bold text-white text-center w-full">
//                   Terms and Conditions
//                 </h2>
//                 <button onClick={toggleModal}>
//                   <X className="h-6 w-6 text-gray-400 hover:text-gray-200" />
//                 </button>
//               </div>
//               {termsAndConditions.map((term, index) => (
//                 <div key={index} className="mb-4">
//                   <h4 className="text-md font-semibold text-orange-300">
//                     {term.text}
//                   </h4>
//                   <p className="text-gray-300 text-sm">{term.description}</p>
//                 </div>
//               ))}
//               <button
//                 className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-md w-full"
//                 onClick={toggleModal}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default RegisterUser;
