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
