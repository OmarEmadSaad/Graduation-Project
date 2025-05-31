import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL, token } from "../config";
import Loading from "../Components/Loader/Loading";
import Error from "../Components/Error/Error";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServicesDetails = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const serviceName = queryParams.get("service");

  useEffect(() => {
    if (!serviceName) {
      setError("No service specified.");
      return;
    }

    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/doctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const doctorsData = await res.json();

        const filteredDoctors = doctorsData.filter(
          (doctor) =>
            doctor.specialization.toLowerCase() === serviceName.toLowerCase()
        );

        setDoctors(filteredDoctors);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [serviceName]);

  const handleBooking = (doctorId) => {
    try {
      const role = localStorage.getItem("role");

      if (!role) {
        toast.error("No user role found. Please sign in as a patient.");
        return;
      }

      if (role !== "patient") {
        toast.error("Sorry, booking is only available for patients.");
        toast.warn("Please sign up as a patient.");
        return;
      }

      navigate(`/doctors/${doctorId}`);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("An error occurred while navigating to the booking page.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-[28px] font-bold text-headingColor text-center mb-8">
        Doctors for {serviceName || "Service"}
      </h2>

      {loading && !error && <Loading />}
      {error && !loading && <Error errMessage={error} />}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="card bg-base-100 w-full max-w-[384px] shadow-sm mx-auto"
              >
                <figure className="px-10 pt-10">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="rounded-xl w-full h-[200px] object-cover"
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title text-[20px] font-semibold text-headingColor">
                    {doctor.name}
                  </h2>
                  <p className="text-textColor">{doctor.specialization}</p>
                  <div className="card-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleBooking(doctor.id)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-textColor col-span-full">
              No doctors found for this service.
            </p>
          )}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ServicesDetails;
