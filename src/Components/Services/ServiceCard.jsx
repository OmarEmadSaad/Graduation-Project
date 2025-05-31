import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

const ServiceCard = ({ items }) => {
  const { name, desc, bgColor, textColor, image } = items;

  return (
    <div
      className="flex flex-col justify-center items-center min-h-[22vh] rounded-lg p-6 shadow-sm "
      style={{ backgroundColor: bgColor }}
    >
      <div className="mb-4">
        <img
          src={
            image ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLEoaTsWQuPn6bW-_n6hqZvmy5Lh64qwETLg&s"
          }
          alt={name}
          className="w-24 h-24 rounded-full object-cover border-2 border-white"
        />
      </div>

      <div className="max-w-[600px] w-full py-[10px] px-5 text-center">
        <h2
          className="text-[24px] leading-8 font-[700]"
          style={{ color: textColor }}
        >
          {name}
        </h2>
        <p className="text-[14px] leading-6 font-[400] text-textColor mt-2">
          {desc}
        </p>
      </div>

      <div className="flex items-center justify-center mt-[20px]">
        <Link
          to={`/services-details?service=${encodeURIComponent(name)}`}
          className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] 
                   flex items-center justify-center transition duration-300 group hover:bg-primaryColor 
                   hover:border-none"
        >
          <BsArrowRight className="group-hover:text-white w-6 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
