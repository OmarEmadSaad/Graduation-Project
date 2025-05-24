import DoctorCard from "./DoctorCard";
import { doctor_URL } from "./../../config";
import UseFetchDate from "./../../hooks/UseFetchDate";
import Loader from "../../Components/Loader/Loading";
import Error from "../../Components/Error/Error";
import { doctors } from "../../assets/data/doctors";
import Testimonial from "../../Components/Testimonial/Testimonial";

const DoctorList = () => {
  const { data: doctors, loading, error } = UseFetchDate(`${doctor_URL}`);
  return (
    <>
      {loading && <Loader />}
      {error && <Error />}
      {!error && !loading && (
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px] justify-items-center">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </>
  );
};

export default DoctorList;
