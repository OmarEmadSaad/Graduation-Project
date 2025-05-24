import { useState, useEffect } from "react";
import starIcon from "../../assets/images/Star.png";
import DoctorAbout from "./DoctorAbout";
import Feedback from "./Feedback";
import Sidepanel from "./Sidepanel";
import { doctor_URL } from "../../config";
import Loader from "../../Components/Loader/Loading";
import Error from "../../Components/Error/Error";
import { useParams } from "react-router-dom";

const useFetchDoctorAndReviews = (doctorId) => {
  const [data, setData] = useState({ doctor: null, reviews: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const doctorRes = await fetch(`${doctor_URL}/${doctorId}`);
        if (!doctorRes.ok) throw new Error("Failed to fetch doctor data");
        const doctorData = await doctorRes.json();

        const reviewsRes = await fetch(`http://localhost:3000/reviews`);
        if (!reviewsRes.ok) throw new Error("Failed to fetch reviews");
        const reviewsData = await reviewsRes.json();

        const usersRes = await fetch(`http://localhost:3000/users`);
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        const usersData = await usersRes.json();

        setData({ doctor: doctorData, reviews: reviewsData, users: usersData });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  return { data, loading, error };
};

const DoctorDetails = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetchDoctorAndReviews(id);
  const [tap, setTap] = useState("about");

  const {
    name = "Unknown Doctor",
    qualifications = [],
    experiences = [],
    timeSlots = [],
    bio = "No bio available",
    about = "No information available",
    specialization = "Unknown",
    ticketPrice = 0,
    photo = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
  } = data.doctor || {};

  const doctorReviews =
    data.reviews?.filter((review) => review.doctorId === id) || [];

  const totalRating = doctorReviews.length;
  const averageRating =
    totalRating > 0
      ? (
          doctorReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          totalRating
        ).toFixed(1)
      : 0;

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && <Loader />}
        {error && <Error errMessage={error} />}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-[50px]">
            <div className="md:col-span-2">
              <div className="flex items-center gap-5">
                <figure className="max-w-[200px] max-h-[200px]">
                  <img src={photo} alt={name} className="w-full" />
                </figure>
                <div>
                  <span
                    className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] lg:text-[16px] 
                    leading-4 lg:leading-7 font-semibold rounded"
                  >
                    {specialization}
                  </span>
                  <h3 className="text-[22px] font-bold leading-9 text-headingColor">
                    {name}
                  </h3>
                  <div className="gap-[6px] flex items-center">
                    <span
                      className="gap-[6px] flex items-center text-[14px] leading-5 
                      lg:text-[16px] lg:leading-7 text-headingColor font-semibold"
                    >
                      <img src={starIcon} alt="Star" /> {averageRating}
                    </span>
                    <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 text-textColor font-[400] text-gray-700">
                      ({totalRating})
                    </span>
                  </div>
                  <p className="text__para text-[14px] leading-5 md:text-[15px] lg:max-w-[390px]">
                    {bio}
                  </p>
                </div>
              </div>

              <div className="mt-[5em] border-b border-solid border-[#0066ff34]">
                <button
                  onClick={() => setTap("about")}
                  className={`${
                    tap === "about" &&
                    "border-b border-solid border-primaryColor"
                  } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold hover:cursor-pointer`}
                >
                  About
                </button>
                <button
                  onClick={() => setTap("Feedback")}
                  className={`${
                    tap === "Feedback" &&
                    "border-b border-solid border-primaryColor"
                  } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold hover:cursor-pointer`}
                >
                  Feedback
                </button>
              </div>

              <div className="mt-[50px]">
                {tap === "about" && (
                  <DoctorAbout
                    name={name}
                    about={about}
                    qualifications={qualifications}
                    experiences={experiences}
                  />
                )}
                {tap === "Feedback" && (
                  <Feedback
                    reviews={doctorReviews}
                    totalRating={totalRating}
                    doctorId={id}
                    users={data.users}
                  />
                )}
              </div>
            </div>

            <div>
              <Sidepanel
                doctorId={id}
                ticketPrice={ticketPrice}
                timeSlots={timeSlots}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorDetails;
