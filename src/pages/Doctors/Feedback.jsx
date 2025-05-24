import { AiFillStar } from "react-icons/ai";
import { formateDate } from "../../utils/formateData";
import avatar from "../../assets/images/avatar-icon.png";
import { useState, useContext } from "react";
import Feedbackform from "./Feedbackform";
import { authContext } from "../../context/AuthContext";

const Feedback = ({ reviews, totalRating, doctorId, users }) => {
  const { userId } = useContext(authContext);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews || []);

  const handleFeedbackSubmit = (newReview) => {
    setLocalReviews([...localReviews, newReview]);
    setShowFeedbackForm(false);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 sm:mb-12">
        <h4 className="text-[18px] sm:text-[20px] leading-[26px] sm:leading-[30px] font-bold text-headingColor mb-6 sm:mb-8">
          All Reviews ({totalRating})
        </h4>
        {localReviews?.map((review, index) => {
          const user = users?.find((user) => user.id === review.userId);
          const userName = user?.name || "Unknown User";
          const userPhoto = user?.photo || avatar;

          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-10 mb-6 sm:mb-8"
            >
              <div className="flex items-center gap-3">
                <figure className="w-10 h-10 rounded-full overflow-hidden mb-13">
                  <img
                    src={userPhoto}
                    className="w-full h-full object-cover"
                    alt={userName}
                  />
                </figure>
                <div className="flex flex-col">
                  <h5 className="text-[14px] sm:text-[16px] leading-5 sm:leading-6 text-irisBlueColor font-bold">
                    {userName}
                  </h5>
                  <p className="text-[12px] sm:text-[14px] leading-5 sm:leading-6 text-textColor">
                    {formateDate(review?.createdAt)}
                  </p>
                  <p className="mt-2 text-[13px] sm:text-[15px] text__para font-medium">
                    {review.reviewText}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {[...Array(review?.rating).keys()].map((_, index) => (
                    <AiFillStar key={index} color="#0067FF" size={16} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!showFeedbackForm && (
        <div className="text-center">
          <button
            className="btn btn-accent bg-blue-600 text-white px-4 py-2 rounded-md text-sm sm:text-base"
            onClick={() => setShowFeedbackForm(true)}
          >
            Give Feedback
          </button>
        </div>
      )}
      {showFeedbackForm && (
        <Feedbackform
          userId={userId}
          doctorId={doctorId}
          onSubmitSuccess={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default Feedback;
