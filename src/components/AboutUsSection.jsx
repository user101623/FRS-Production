import { aboutUs } from "../constants";

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
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2">
            <div className="bg-neutral-900 rounded-md p-6 text-md border border-neutral-800 font-thin h-72 flex flex-col justify-between">
              <div className="flex flex-col items-center">
                <img
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg" // Added border and shadow
                  src={member.image}
                  alt={member.user}
                />
                <h6 className="text-lg font-semibold text-orange-400">
                  {member.user}
                </h6>
              </div>
              <p className="text-center text-neutral-200 px-4 py-2 flex-grow">
                {member.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsSection;