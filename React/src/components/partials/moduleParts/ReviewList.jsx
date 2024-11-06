import React from "react";
import { FaStar } from "react-icons/fa";
import img from "../../../assets/profile.png";

const ReviewList = ({ reviews }) => {
  return (
    <div>
      {reviews.map((review, index) => (
        <div
          key={review.id}
          className={`p-4  bg-white mb-4 ${
            index < reviews.length - 1 ? "border-b  border-gray-300" : ""
          }`} // Added border-bottom for separation
        >
          {/* Profile Image Section */}
          <div className="flex items-center mb-2">
            <img
              src={img}
              alt={`${review.user_name}'s profile`}
              className="w-8 h-8 rounded-full mr-2" // Smaller size
            />
            <div className="flex flex-col">
              <span className="text-[16px] text-[#1E293B]">{review.user_name}</span>
            </div>
          </div>

          {/* Stars Section */}
          <div className="flex mb-2 gap-1 items-center">
            {[...Array(parseInt(review.rating))].map((_, i) => (
              <FaStar key={i} className="text-yellow-400" />
            ))} ({parseInt(review.rating)})
            <p className="ml-1 text-[14px] font-[Plus Jakarta Sans] text-gray-600">
              Verify Purchase
            </p>
          </div>
          <p className="text-[14px] mb-2 text-[#334155]">
            {review.created_at.split("T")[0]}
          </p>
          {/* Review Text */}
          <p className="text-[#334155] text-[14px]">{review.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
