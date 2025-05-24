import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import patienAvater from "../../assets/images/patient-avatar.png";
import { HiStar } from "react-icons/hi";

const Testimonial = () => {
  return (
    <div className="mt-[30px] lg:mt-[55px]">
      <Swiper
        modules={[Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        <SwiperSlide>
          <div className="py-[30px] px-5 rounded-3">
            <div className="flex items-center gap-[13px]">
              <img src={patienAvater} />
              <div>
                <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
                  Dr.Mohamed
                  {/* Omar Emad */}
                </h4>
                <div className="flex items-center gap-[2px]">
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                </div>
              </div>
            </div>
            <p className="text-textColor font-[400]">the is the Greed Doctor</p>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="py-[30px] px-5 rounded-3">
            <div className="flex items-center gap-[13px]">
              <img src={patienAvater} />
              <div>
                <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
                  Dr.Ahmed
                </h4>
                <div className="flex items-center gap-[2px]">
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                </div>
              </div>
            </div>
            <p className="text-textColor font-[400]">the is the Greed Doctor</p>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="py-[30px] px-5 rounded-3">
            <div className="flex items-center gap-[13px]">
              <img src={patienAvater} />
              <div>
                <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
                  Dr.Salah
                </h4>
                <div className="flex items-center gap-[2px]">
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                  <HiStar className="text-yellowColor h-5 w-[18px]" />
                </div>
              </div>
            </div>
            <p className="text-textColor font-[400]">the is the Greed Doctor</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Testimonial;
