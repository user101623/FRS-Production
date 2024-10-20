import { features } from "../constants";

const FeatureSection = () => {
  return (
    <div
      id="features"
      className="relative mt-20 border-b border-neutral-800 flex flex-col items-center"
    >
      <div className="border-t border-neutral-700 mb-5 w-full"></div>
      <div className="text-center">
        <span className="bg-neutral-900 text-orange-500 rounded-full h-6 text-sm font-medium px-2 py-1 uppercase">
          Features
        </span>
      </div>
      <div className="flex flex-wrap mt-5 lg:mt-10 justify-center">
        {" "}
        {features.map((feature, index) => (
          <div
            key={index}
            className="w-full sm:w-1/2 lg:w-1/3 flex justify-center mb-4"
          >
            <div className="flex">
              <div className="flex mx-6 h-10 w-10 p-2 bg-neutral-900 text-orange-700 justify-center items-center rounded-full">
                {feature.icon}
              </div>
              <div className="ml-1">
                <h5 className="mt-1 mb-2 text-xl">{feature.text}</h5>
                <p className="text-md p-2 mb-0 text-neutral-500 mb-10">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;