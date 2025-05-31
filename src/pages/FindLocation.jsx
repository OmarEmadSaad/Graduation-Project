import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

const FindLocation = () => {
  const embedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509325!2d144.9537363153167!3d-37.81627997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf0727e3b9c4c4d!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1698765432100!5m2!1sen!2sus";

  return (
    <section className="bg-[#fff9ea] py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="heading text-[28px] font-bold text-headingColor">
            Our Hospital Location
          </h2>
          <p className="text__para text-[16px] leading-7 text-textColor mt-4 max-w-[600px] mx-auto">
            Visit us at our main hospital in Melbourne, VIC, Australia. We are
            here to provide world-class healthcare services.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-[800px] h-[400px] rounded-lg overflow-hidden shadow-md">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hospital Location"
            ></iframe>
          </div>

          <div className="flex justify-center">
            <Link
              to="/"
              className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] 
              flex items-center justify-center transition duration-300 group hover:bg-primaryColor 
              hover:border-none"
            >
              <BsArrowRight className="group-hover:text-white w-6 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindLocation;
