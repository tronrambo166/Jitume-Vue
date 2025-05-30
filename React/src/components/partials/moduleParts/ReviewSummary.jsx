import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ReviewServdetailSummary = ({ reviews, rating_count }) => {
    // Calculate the rating distribution from reviews data
    const ratingDistribution = [0, 0, 0, 0, 0]; // For 5 star, 4 star, 3 star, 2 star, and 1 star
    reviews.forEach((review) => {
        const rating = parseFloat(review.rating);
        if (rating >= 4.5) ratingDistribution[0] += 1;
        else if (rating >= 3.5) ratingDistribution[1] += 1;
        else if (rating >= 2.5) ratingDistribution[2] += 1;
        else if (rating >= 1.5) ratingDistribution[3] += 1;
        else ratingDistribution[4] += 1;
    });

    const totalReviews2 = rating_count || 0;

    // console.log("totalReviews2", totalReviews2);

   const totalReviews = reviews.length || 0; // Avoid division by 0
   const percentage = ratingDistribution.map(
       (count) => (totalReviews > 0 ? (count / totalReviews) * 100 : 0) // Avoid NaN by checking totalReviews
   );


    // Find the most common rating by checking the highest percentage
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating); // Number of full stars
        const hasHalfStar = rating % 1 >= 0.5; // Check if there is a half star
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining stars are empty

        return (
            <>
                {[...Array(fullStars)].map((_, idx) => (
                    <FaStar key={`full-${idx}`} className="text-yellow-400" />
                ))}
                {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
                {[...Array(emptyStars)].map((_, idx) => (
                    <FaRegStar key={`empty-${idx}`} className="text-gray-300" />
                ))}
            </>
        );
    };
    // Handle the case where we have a tie (draw)

    // the logic is here below
    // 3 star | ████████ | 1 (100%)
    // lets say we have 5 star | 4 star | 3 star | 2 star | 1 star etc
    // 5 star | ██████████████ | 7 (70%)
    // 4 star | ████           | 2 (20%)
    // 3 star | █              | 1 (10%)

    return (
        <div className="bg-white p-5 rounded-lg ring-1 ring-gray-300">
            <h2 className="text-xl text-[#1E293B] font-semibold mb-4">
                Reviews
            </h2>

            {/* Display Most Common Rating */}
            <div className="flex items-center mb-2">
                {/* Render Stars for the Most Common Rating */}
                <div className="flex">{renderStars(totalReviews2)}</div>

                <span className="ml-2 text-gray-600">
                    {totalReviews} Reviews
                </span>
            </div>

            {/* Rating Breakdown */}
            <div className="mt-4 flex flex-col space-y-3">
                {["5 star", "4 star", "3 star", "2 star", "1 star"].map(
                    (star, idx) => (
                        <div
                            className="flex justify-between items-center text-[#1E293B]"
                            key={idx}
                        >
                            {/* Star Rating Label */}
                            <p className="text-sm w-16 flex-shrink-0">{star}</p>

                            {/* Progress Bar Container */}
                            <div className="w-full flex items-center gap-3">
                                <div className="flex-grow h-8 bg-slate-200 rounded-md relative">
                                    {/* Progress Bar */}
                                    <div
                                        className="absolute top-0 left-0 h-8 bg-yellow-300 rounded-md"
                                        style={{
                                            width: `${percentage[idx]}%`,
                                        }}
                                    ></div>
                                </div>
                                {/* Percentage Display */}
                                <p className="text-xs w-10">
                                    {Math.round(percentage[idx])}%
                                </p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ReviewServdetailSummary;
