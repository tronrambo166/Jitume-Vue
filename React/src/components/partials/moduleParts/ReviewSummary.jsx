import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewSummary = () => {
  return (
    <div className="bg-white p-5 rounded-lg ring-1 ring-gray-300">
      <h2 className="text-xl text-[#1E293B] font-semibold mb-4">Reviews</h2>
      <div className="flex items-center  mb-2">
        <FaStar className="text-yellow-400 " />
        <FaStar className="text-yellow-400" />
        <FaStar className="text-yellow-400" />
        <FaStar className="text-yellow-400" />
        <FaStar className="text-yellow-400" />
        <span className="ml-2 text-gray-600 ">34 Reviews</span>
      </div>
      <div className="mt-4 space-y-2">
        {["5 star", "4 star", "3 star", "2 star", "1 star"].map((star, idx) => (
          <div
            className="flex justify-between text-[#1E293B] items-center"
            key={idx}
          >
            <p>{star}</p>
            <div className="w-3/4 rounded-md bg-slate-200 h-8">
              {" "}
              {/* Adjusted width to w-3/4 */}
              <div
                className="bg-yellow-300  h-full  rounded-md"
                style={{ width: `${[77, 12, 6, 3, 2][idx]}%` }}
              ></div>
            </div>
            <p>{[77, 12, 6, 3, 2][idx]}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSummary;
