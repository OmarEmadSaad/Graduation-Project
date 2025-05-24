import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { BASE_URL, token } from "../../config";

const Feedbackform = ({ onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const { id: doctorId } = useParams();
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (!role || role !== "patient") {
    return (
      <div className="text-center text-[14px] text-textColor mt-6">
        Only patients can submit reviews. Please log in as a patient.
      </div>
    );
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      toast.error("Authentication token is missing. Please log in.");
      setLoading(false);
      return;
    }

    if (!rating || !reviewText.trim()) {
      toast.error("Rating and Review fields are required");
      setLoading(false);
      return;
    }

    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      toast.error("Invalid user information. Please log in.");
      setLoading(false);
      return;
    }
    if (!doctorId) {
      toast.error("Doctor information is missing");
      setLoading(false);
      return;
    }

    try {
      const reviewData = {
        userId,
        doctorId,
        rating,
        reviewText,
        role,
        createdAt: new Date().toISOString(),
      };

      console.log("Submitting review:", reviewData);

      const res = await fetch(`${BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(
          result.message || result.error || "Failed to submit review"
        );
      }

      toast.success("Review submitted successfully");
      setRating(0);
      setHover(0);
      setReviewText("");
      if (onSubmitSuccess) {
        onSubmitSuccess(reviewData);
      }
    } catch (err) {
      toast.error(`Failed to submit review: ${err.message}`);
      console.error("Error submitting review:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitReview} className="mt-6 w-full max-w-lg">
      <div>
        <h3 className="text-[14px] sm:text-[16px] text-headingColor mb-4 leading-6 font-semibold">
          How would you rate the overall experience? (1-10)
        </h3>
        <div className="flex gap-1 flex-wrap">
          {[...Array(5).keys()].map((_, index) => {
            index += 1;
            const starValue = index * 2;
            const isHalfStar = hover > starValue - 1 && hover < starValue;

            return (
              <button
                key={index}
                type="button"
                className={`bg-transparent border-none outline-none text-[16px] sm:text-[18px] cursor-pointer ${
                  starValue <= (hover || rating)
                    ? "text-yellowColor"
                    : "text-gray-400"
                }`}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(rating)}
                onDoubleClick={() => {
                  setHover(0);
                  setRating(0);
                }}
                aria-label={`Rate ${starValue} out of 10`}
              >
                {isHalfStar ? <AiOutlineStar /> : <AiFillStar />}
              </button>
            );
          })}
        </div>
        {rating > 0 && (
          <p className="text-[14px] text-textColor mt-2">
            You rated: {rating}/10
          </p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-[14px] sm:text-[16px] text-headingColor mb-4 leading-6 font-semibold">
          Share your feedback or suggestions
        </h3>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="border border-solid border-[#0066ff34] w-full px-3 py-2 rounded-md focus:outline focus:outline-primaryColor text-[13px] sm:text-[14px]"
          rows="5"
          placeholder="Write your feedback or suggestions"
          maxLength={500}
          aria-label="Feedback or suggestions"
        />
      </div>

      <div className="mt-4 text-center">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-accent bg-blue-600 text-white px-4 py-2 rounded-md text-sm sm:text-base hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? <HashLoader size={20} color="#fff" /> : "Submit Feedback"}
        </button>
      </div>
    </form>
  );
};

export default Feedbackform;
