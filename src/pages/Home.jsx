import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import About from "../Components/About/About";
import heroImg01 from "../assets/images/hero-img01.png";
import heroImg02 from "../assets/images/hero-img02.png";
import heroImg03 from "../assets/images/hero-img03.png";
import icon01 from "../assets/images/icon01.png";
import icon02 from "../assets/images/icon02.png";
import icon03 from "../assets/images/icon03.png";
import avatarIcon from "../assets/images/avatar-icon.png";
import videoImg from "../assets/images/video-icon.png";
import featureImg from "../assets/images/feature-img.png";
import faqImg from "../assets/images/faq-img.png";
import ServiceList from "../Components/Services/ServiceList";
import DoctorList from "../Components/Doctors/DoctorList";
import FaqList from "../Components/Faq/FaqList";
import Testimonial from "../Components/Testimonial/Testimonial";

const Home = () => {
  return (
    <>
      <section className="hero__section pt-[60px] 2xl:h-[800px] flex justify-center items-center">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">
            <div>
              <div className="lg:w-[570px] ">
                <h1 className="text-[36px] leading-[46px] font-bold text-black md:text-[60px] md:leading-[70px]">
                  We help patients live a healthy, longer life
                </h1>
                <p className="text-gray-600">
                  The outpatient management system helps organize patient
                  appointments and simplifies the booking and cancellation
                  process, reducing wait times and enhancing the overall
                  healthcare experience. It allows doctors to view daily patient
                  schedules and communicate with them directly through an
                  integrated chat system, improving the efficiency and quality
                  of medical services.
                </p>
                <button className="btn btn-info btn-sm mt-4">
                  Request an Appointment
                </button>
              </div>

              <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
                {[
                  {
                    number: "30+",
                    label: "Years of experience",
                    color: "bg-yellow-400",
                  },
                  {
                    number: "15+",
                    label: "Clinic locations",
                    color: "bg-purple-500",
                  },
                  {
                    number: "100%",
                    label: "Patient satisfaction",
                    color: "bg-blue-500",
                  },
                ].map((item, index) => (
                  <div key={index}>
                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] font-bold text-black">
                      {item.number}
                    </h2>
                    <span
                      className={`w-[100px] h-2 ${item.color} rounded-full block mt-[-14px]`}
                    ></span>
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-[30px] justify-end">
              <div>
                <img src={heroImg01} className="w-full" alt="Hero 1" />
              </div>
              <div className="mt-[30px]">
                <img
                  src={heroImg02}
                  alt="Hero 2"
                  className="w-full mb-[30px]"
                />
                <img src={heroImg03} alt="Hero 3" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center items-center py-[60px]">
        <div className="container">
          <div className="flex justify-center items-center">
            <div className="lg:w-[470px]">
              <h2 className="text-center text-2xl font-bold text-black">
                Providing the best medical services
              </h2>
              <p className="text-center text-gray-600 mt-4">
                World-class care for everyone. Our health system offers
                unmatched, expert health care.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
            <div className="py-[30px] px-5 flex flex-col items-center text-center">
              <div className="flex justify-center items-center">
                <img src={icon01} alt="Icon 1" />
              </div>

              <div className="mt-[30px] space-y-4">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700]">
                  Find a Doctor
                </h2>
                <p className="text-[16px] leading-7 font-[400] text-textColor">
                  World-class care for everyone. Our health system offers
                  unmatched, expert health care from the lab clinic.
                </p>
                <div className="flex justify-center">
                  <Link
                    to="/doctors"
                    className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] 
                    flex items-center justify-center transition duration-300 group hover:bg-primaryColor 
                    hover:border-none"
                  >
                    <BsArrowRight className="group-hover:text-white w-6 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="py-[30px] px-5 flex flex-col items-center text-center">
              <div className="flex justify-center items-center">
                <img src={icon02} alt="Icon 1" />
              </div>

              <div className="mt-[30px] space-y-4">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700]">
                  Find a Location
                </h2>
                <p className="text-[16px] leading-7 font-[400] text-textColor">
                  World-class care for everyone. Our health system offers
                  unmatched, expert health care from the lab clinic.
                </p>
                <div className="flex justify-center">
                  <Link
                    to="/find-location"
                    className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] 
                    flex items-center justify-center transition duration-300 group hover:bg-primaryColor 
                    hover:border-none"
                  >
                    <BsArrowRight className="group-hover:text-white w-6 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="py-[30px] px-5 flex flex-col items-center text-center">
              <div className="flex justify-center items-center">
                <img src={icon03} alt="Icon 1" />
              </div>

              <div className="mt-[30px] space-y-4">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700]">
                  Book Appointemnt
                </h2>
                <p className="text-[16px] leading-7 font-[400] text-textColor">
                  World-class care for everyone. Our health system offers
                  unmatched, expert health care from the lab clinic.
                </p>
                <div className="flex justify-center">
                  <Link
                    to="/doctors"
                    className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] 
                    flex items-center justify-center transition duration-300 group hover:bg-primaryColor 
                    hover:border-none"
                  >
                    <BsArrowRight className="group-hover:text-white w-6 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <About />

      <section className="flex justify-center items-center ">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="xl:w-[470px] w-full">
            <h2 className="heading text-center">Our Services</h2>
            <p className="text__para text-center mt-4">
              World-class care for everyone. Our health system offers unmatched,
              expert health care.
            </p>
          </div>
        </div>
      </section>
      <ServiceList />

      <section className="Ahmed py-[60px] lg:py-[100px] flex justify-center items-center ">
        <div className="container mx-auto px-4 ">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="xl:w-[670px] text-center lg:text-left ">
              <h2 className="heading mb-4">Get virtual treatment</h2>
              <ul className="pl-4 space-y-2">
                <li className="text__para">
                  1. Scheduling the appointment description
                </li>
                <li className="text__para">
                  2. Search for your physician here and contact their office
                </li>
                <li className="text__para">
                  3. View our physicians who are accepting new patients
                </li>
              </ul>
              <Link to="/">
                <button className="btn btn-info mt-6">Learn more</button>
              </Link>
            </div>
            <div className=" relative z-10 xl:w-[770px] flex justify-end mt-[50px] lg:mt-0">
              <img src={featureImg} className="w-3/4" />
              <div
                className="w-[150px] lg:w-[248px] bg-white absolute bottom-[50px] left-0
               md:bottom-[100px] md:left-5 z-20 p-2 pb-3 lg:pt-4 lg:px-4 lg:pb-[26px] rounded-[10px]"
              >
                <div className=" flex items-center justify-between">
                  <div className=" flex items-center gap-[6px] lg:gap-3">
                    <p className="text-[10px]  leading-[10px] lg:text-[14px] lg:leading-5 font-[600] text-headingColor ">
                      Tru,24
                    </p>
                    <p className="text-[10px]  leading-[10px] lg:text-[14px] lg:leading-5 font-[400] text-textColor ">
                      10:00
                    </p>
                  </div>
                  <span className="w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center bg-yellowColor rounded py-1 px-[6px] lg:py-3 lg:px-[9px] ">
                    <img src={videoImg} />
                  </span>
                </div>
                <div
                  className="w-[65px] lg:w-[96px] bg-[#CCF0F3] py-1 px-2 lg:py-[6px] lg:px-[10px] text-[8px] leading-[8px] 
                lg:text-[12px] lg:leading-4 text-irisBlueColor font-[500] mt-2 lg:mt-4 rounded-full text-center "
                >
                  Consultation
                </div>
                <div className="flex items-center gap-[6px] lg:gap-[10px] mt-2 lg:mt-[18px] ">
                  <img src={avatarIcon} />
                  <h2>wayne Conlline</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="xl:w-[470px] w-full">
              <h2 className="heading text-center">Our Great Doctors</h2>
              <p className="text__para text-center mt-4">
                World-class care for everyone. Our health system offers
                unmatched, expert health care.
              </p>
            </div>
          </div>
          <DoctorList />
        </div>
      </section>

      <section>
        <div className=" container">
          <div className=" flex justify-between gap-[50px] lg:gap-0 ">
            <div className=" hidden w-1/2 md:block">
              <img src={faqImg} />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center gap-[3em]">
              <h2 className="heading ">
                Most question by our beloved patients
              </h2>
              <FaqList />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className=" container">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="xl:w-[470px] w-full">
              <h2 className="heading text-center">Wheat our patient say</h2>
              <p className="text__para text-center mt-4">
                World-class care for everyone. Our health system offers
                unmatched, expert health care.
              </p>
            </div>
          </div>
          <Testimonial />
        </div>
      </section>
    </>
  );
};

export default Home;
