import { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
const FaqItem = ({ itme }) => {
  const [isopen, setisopen] = useState(false);
  const toggleAccordion = () => {
    setisopen(!isopen);
  };
  return (
    <div className="p-3 lg:p-5 rounded-[12px] border border-solid border-[#D9DCE2] mb-5 cursor-pointer">
      <div
        className="flex items-center justify-between gap-5"
        onClick={toggleAccordion}
      >
        <h4 className="text-[16px] leading-7 lg:leading-8 text-headingColor">
          {itme.question}
        </h4>
        <div
          className={`${
            isopen && "bg-primaryColor text-white border-none"
          }w-7 h-7 lg:w-8 lg:h-8 border border-solid border-[#141F21] rounded flex justify-center items-center`}
        >
          {isopen ? <AiOutlineMinus /> : <AiOutlinePlus />}
        </div>
      </div>
    </div>
  );
};

export default FaqItem;
