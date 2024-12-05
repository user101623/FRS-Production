import { aboutUs } from "../constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import confusionMatrixImage from "../backend/static/images/confusion_matrices.png";

const AboutUsSection = () => {
  return (
    <div id="about-us" className="mt-10 tracking-wide mb-5">
      <div className="text-center mb-10">
        <span className="bg-neutral-900 text-orange-500 rounded-full h-6 text-sm font-medium px-4 py-1 uppercase">
          Meet Our Team
        </span>
      </div>
      <div className="flex flex-wrap justify-center">
        {aboutUs.map((member, index) => (
          <div key={index} className="w-full sm:w-3/5 lg:w-1/3 px-2 py-2">
            <div className="bg-neutral-900 rounded-md p-3 text-base border border-neutral-800 font-thin h-52 flex flex-col justify-between">
              <div className="flex flex-col items-center">
                <img
                  className="w-20 h-20 rounded-full border-2 border-white shadow-lg"
                  src={member.image}
                  alt={member.user}
                />
                <h6 className="text-base font-semibold text-orange-400 mt-2 mb-2">
                  {member.user}
                </h6>
              </div>
              <div className="flex justify-center space-x-4 mt-1">
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-5xl text-neutral-600 hover:text-orange-500 transition-colors">
                  <FontAwesomeIcon icon={faSquareGithub} alt="GitHub"/>
                </a>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-5xl text-neutral-600 hover:text-orange-500 transition-colors">
                  <FontAwesomeIcon icon={faLinkedin} alt="LinkedIn"/>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {confusionMatrixImage && (
        <div className="flex mt-10 justify-center">
          <img
            src={confusionMatrixImage}
            alt="Confusion Matrix"
            className="rounded-lg w-1/2 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4"
          />
        </div>
      )}
    </div>
  );
};

export default AboutUsSection;