import { termsAndConditions } from "../constants";
import { X } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <footer className="w-full py-4 text-center">
      <hr className="border-t border-neutral-700 mb-4" />
      <div className="container mx-auto px-4">
        <p className="text-neutral-500">
          © {new Date().getFullYear()} FRS. All rights reserved.
        </p>
        <span
          className="cursor-pointer text-orange-500 hover:underline text-sm"
          onClick={toggleModal}
        >
          Terms and Conditions
        </span>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
                  <a href={term.href} className="hover:underline">
                    {term.text}
                  </a>
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
    </footer>
  );
};

export default Footer;
