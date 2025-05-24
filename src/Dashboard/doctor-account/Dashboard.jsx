import Loader from "../../Components/Loader/Loading";
import Error from "../../Components/Error/Error";
import useGetProfile from "../../hooks/UseFetchDate";
import { BASE_URL, token } from "../../config";
import Tads from "./Tads";
import starIcon from "../../assets/images/Star.png";
import { useContext, useState, useEffect } from "react";
import DoctorAbout from "../../pages/Doctors/DoctorAbout";
import Profile from "./Profile";
import Appointments from "./Appointments";
import { authContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { userId } = useContext(authContext);
  const { data, loading, error } = useGetProfile(
    `${BASE_URL}/doctors/${userId}`
  );
  const [tab, setTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (data?.appointments) {
      setAppointments(data.appointments);
    }
  }, [data]);

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && !error && <Loader />}
        {error && !loading && <Error errMessage={error} />}

        {!loading && !error && (
          <div className="grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]">
            <Tads tab={tab} setTab={setTab} />
            <div className="lg:col-span-2">
              {data?.isApproved === "pending" && (
                <div className="flex p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg">
                  <div role="alert" className="alert alert-info">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      <div className="ml-3 text-sm font-medium">
                        To get approval, please complete your profile
                      </div>
                    </span>
                  </div>
                </div>
              )}
              <div className="mt-5">
                {tab === "overview" && (
                  <div>
                    <div className="mb-10 gap-4 flex items-center">
                      <figure className="max-w-[200px] max-h-[200px] mb-10 sm:mb-5">
                        <img
                          src={data?.photo}
                          className="w-full"
                          alt="Doctor"
                        />
                      </figure>
                      <div>
                        <span className="bg-[#CCF0F3] text-irisBlueColor px-4 py-1 lg:px-6 rounded text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold">
                          {data.specialization}
                        </span>
                        <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                          {data.name}
                        </h3>
                        <div className="flex items-center gap-[6px]">
                          <span
                            className="flex items-center gap-[6px] text-headingColor text-[14px] leading-5 lg:text-[16px] 
                               lg:leading-6 font-semibold"
                          >
                            <img src={starIcon} alt="Star" />
                            {data.averageRating}
                          </span>
                          <span
                            className="text-[14px] leading-5 lg:text-[16px] 
                               lg:leading-6 font-semibold"
                          >
                            ({data.totalRating})
                          </span>
                        </div>
                        <p className="text__para font-[15px] leading-6 lg:max-w-[390px]">
                          {data?.bio}
                        </p>
                      </div>
                    </div>
                    <DoctorAbout
                      name={data.name}
                      about={data.about}
                      qualifications={data.qualifications}
                      experiences={data.experiences}
                    />
                  </div>
                )}
                {tab === "appointments" && (
                  <Appointments appointments={appointments} />
                )}
                {tab === "settings" && <Profile doctorData={data} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
