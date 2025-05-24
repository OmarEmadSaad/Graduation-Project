import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { useContext } from "react";
import { authContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Tads = ({ tab, setTab }) => {
  const { dispatch } = useContext(authContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <span className="lg:hidden">
        {isMenuOpen ? (
          <AiOutlineClose
            className="w-6 h-6 cursor-pointer"
            onClick={toggleMenu}
          />
        ) : (
          <BiMenu className="w-6 h-6 cursor-pointer" onClick={toggleMenu} />
        )}
      </span>

      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } lg:flex mt-[7em] sm:mt-[7em] lg:mt-[0em] flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md gap-4 absolute top-12 left-0 w-full md:w-64 z-50 lg:static lg:w-auto transition-all duration-300 ease-in-out`}
      >
        <button
          onClick={() => {
            setTab("overview");
            setIsMenuOpen(false);
          }}
          className={`${
            tab === "overview"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full mt-0 rounded-md btn btn-info`}
        >
          Overview
        </button>
        <button
          onClick={() => {
            setTab("appointments");
            setIsMenuOpen(false);
          }}
          className={`${
            tab === "appointments"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full mt-0 rounded-md btn btn-info`}
        >
          Appointments
        </button>
        <button
          onClick={() => {
            setTab("settings");
            setIsMenuOpen(false);
          }}
          className={`${
            tab === "settings"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full mt-0 rounded-md btn btn-info`}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default Tads;
