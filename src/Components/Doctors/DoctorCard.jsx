import starIcon from "../../assets/images/Star.png";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

const DoctorCard = ({ doctor }) => {
  const { name, avgRating, totalRating, photo, spacializtaion, experiences } =
    doctor;

  return (
    <div className="p-3 lg:p-5">
      <div>
        <img src={photo} className="w-full h-[40vh]" />
      </div>
      <h2 className="mt-3 lg:mt-5 font-[700] lg:text-[26px] leading-[30px] text-[18px] text-headingColor">
        {name}
      </h2>
      <div className="mt-2 lg:mt-4 flex items-center justify-between">
        <span
          className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] lg:text-[16px] 
        leading-4 lg:leading-7 font-semibold rounded"
        >
          {spacializtaion}
        </span>
        <div className="flex justify-center gap-[6px]">
          <span className="flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 text-headingColor font-semibold">
            <img src={starIcon} /> {avgRating}
          </span>
          <span className="text-[14px] leading-6 lg:text-[16px] lg:leading-7 text-textColor font-[400]">
            {totalRating}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-[18px] lg:mt-5">
        <div>
          <p className="font-[400] text-[14px] leading-6 text-textColor">
            At {experiences && experiences[0]?.hospital}
          </p>
        </div>
        <Link
          to={`/doctors/${doctor.id}`}
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

export default DoctorCard;
