import aboutImg from "../../assets/images/about.png";
import aboutCardImg from "../../assets/images/about-card.png";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="flex justify-center items-center min-h-screen">
      <div className="container mx-auto flex justify-center items-center ">
        <div className=" flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row">
          <div className="relative w-full max-w-lg lg:w-1/2">
            <img src={aboutImg} />
            <div className="absolute z-20 bottom-4 w-[200px] md:w-[300px] right-[-30px] md:right-[-7%] lg:right-[22%]">
              <img src={aboutCardImg} />
            </div>
          </div>

          <div className="w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2 gap-[2em]">
            <h2 className="heading"> proud to be one of the nations best</h2>
            <p className="text__para">
              for 30years in a row us News , Report has recognized us as one of
              the best pbulic OSM in nation and 1# in the texts
            </p>
            <p className="text__para mt-[30px]">
              our patients looking back at what we acccopmlised but toward what
              we can do tomorrow .provding the best sercices
            </p>
            <Link to="/">
              <button className="btn btn-info">Learn more</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

// <section className="flex justify-center items-center min-h-screen">
//   <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//     <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

//       <div className="relative w-full max-w-lg lg:w-1/2">
//         <img src={aboutImg} alt="About Image" className="w-full h-auto rounded-lg shadow-md" />
//         <div className="absolute bottom-4 right-4 w-[150px] sm:w-[200px] md:w-[250px] lg:w-[280px] rounded-lg shadow-lg">
//           <img src={aboutCardImg} alt="About Card Image" className="w-full h-auto rounded-lg" />
//         </div>
//       </div>

//       <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
//         <h2 className="text-2xl sm:text-3xl font-bold text-headingColor leading-tight">
//           Proud to be one of the nation's best
//         </h2>
//         <p className="text-base sm:text-lg text-textColor leading-relaxed">
//           For 30 years in a row, US News & Report has recognized us as one of the best public OSM in the nation and #1 in the texts.
//         </p>
//         <p className="text-base sm:text-lg text-textColor leading-relaxed">
//           Our patients look back at what we've accomplished but focus on what we can do tomorrow — providing the best services.
//         </p>
//         <Link to="/">
//           <button className="btn btn-info px-5 py-2 rounded-lg text-white hover:bg-primaryColor transition-all">
//             Learn more
//           </button>
//         </Link>
//       </div>

//     </div>
//   </div>
// </section>
