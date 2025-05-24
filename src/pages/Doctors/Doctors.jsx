import { useEffect, useState } from "react";
import UseFetchDate from "../../hooks/UseFetchDate";
import { BASE_URL } from "../../config";
import Loader from "../../Components/Loader/Loading";
import Error from "../../Components/Error/Error";
import Testimonial from "../../Components/Testimonial/Testimonial";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Doctors = () => {
  const [query, setQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const { data: doctors, loading, error } = UseFetchDate(`${BASE_URL}/doctors`);
  const navigate = useNavigate();

  const renderStars = (rating) => {
    const stars = [];
    const maxStars = 5;
    const normalizedRating = rating && !isNaN(rating) ? rating : 0;
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400"
          title="Full star"
        />
      );
    }

    if (hasHalfStar && fullStars < maxStars) {
      stars.push(
        <FaStarHalfAlt
          key="half"
          className="w-4 h-4 text-yellow-400"
          title="Half star"
        />
      );
    }

    for (let i = stars.length; i < maxStars; i++) {
      stars.push(
        <FaRegStar
          key={`empty-${i}`}
          className="w-4 h-4 text-yellow-400"
          title="Empty star"
        />
      );
    }

    return stars;
  };

  useEffect(() => {
    if (doctors && doctors.length > 0) {
      const trimmedQuery = query.trim().toLowerCase();
      let filtered;

      if (trimmedQuery) {
        filtered = doctors.filter((doctor) =>
          doctor.specialization.toLowerCase().includes(trimmedQuery)
        );
      } else {
        filtered = doctors.filter((doctor) => doctor.avgRating > 5.5);
      }

      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
  }, [query, doctors]);

  const handleBooking = (doctorId) => {
    const role = localStorage.getItem("role");
    if (role === "patient") {
      navigate(`/doctors/${doctorId}`);
    } else {
      toast.error(
        "Sorry Access denied. Booking is available only for patients😔."
      );
      toast.warn("Please Sign Up as A Patient.");
    }
  };

  return (
    <>
      <section className="bg-[#fff9ea]">
        <div className="text-center container">
          <h2 className="heading">Find A Doctor</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
            <input
              type="search"
              placeholder="Search by specialization (e.g., Surgeon, Neurologist)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="py-4 pl-4 pr-2 bg-transparent w-full cursor-pointer focus:outline-none placeholder:text-textColor"
            />
            <button
              className="btn btn-info mt-[0px] bg-primaryColor text-white"
              onClick={() => setQuery(query.trim())}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {loading && <Loader />}
          {error && <Error errMessage={error} />}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] justify-items-center">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="card bg-base-100 w-96 shadow-sm"
                  >
                    <figure className="px-10 pt-10">
                      <img
                        src={
                          doctor.photo ||
                          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                        }
                        alt={doctor.name}
                        className="rounded-xl w-full h-[40vh] object-cover"
                      />
                    </figure>
                    <div className="card-body items-center text-center">
                      <h2 className="card-title">{doctor.name}</h2>
                      <p>{doctor.specialization}</p>
                      <div className="flex items-center gap-1">
                        {renderStars(doctor.avgRating)}
                        <span className="text-[14px] text-textColor">
                          ({doctor.totalRating || 0})
                        </span>
                      </div>
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
                <p className="text-center text-textColor">
                  {query
                    ? "No doctors found for this specialization."
                    : "No doctors found with rating above 5.5."}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="container">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="xl:w-[470px] w-full">
              <h2 className="heading text-center">What our patients say</h2>
              <p className="text__para text-center mt-4">
                World-class care for everyone. Our health system offers
                unmatched, expert health care.
              </p>
            </div>
          </div>
          <Testimonial />
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Doctors;
