import { faqs } from "./../../assets/data/faqs";
import FaqItem from "./FaqItem";
const FaqList = () => {
  return (
    <div className="gap-[2em]">
      <ul className="mt-[38px]">
        {faqs.map((item, index) => (
          <FaqItem itme={item} key={index} />
        ))}
      </ul>
    </div>
  );
};
export default FaqList;
