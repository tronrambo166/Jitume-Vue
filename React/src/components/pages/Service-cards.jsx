import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axiosClient from "../../axiosClient";
import SkeletonServiceCard from "./SkeletonServiceCard";
const Servicecards = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollForward, setCanScrollForward] = useState(false);

    useEffect(() => {
        const getCards = async () => {
            setLoading(true);
            try {
                const { data } = await axiosClient.get("/latServices");
                setCards(data.data);
                checkScrollConditions(); // Check scroll conditions after loading cards
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getCards();
    }, []);

    const checkScrollConditions = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollBack(scrollLeft > 0);
            setCanScrollForward(scrollLeft + clientWidth < scrollWidth);
        }
    };

    const handleNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: scrollRef.current.clientWidth,
                behavior: "smooth",
            });
        }
    };

    const handlePrev = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -scrollRef.current.clientWidth,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            checkScrollConditions();
            scrollRef.current.addEventListener("scroll", checkScrollConditions);
            return () =>
                scrollRef.current?.removeEventListener(
                    "scroll",
                    checkScrollConditions
                );
        }
    }, []);
return (
    <>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 mt-10 flex flex-col">
            <div className="flex justify-start">
                <span className="text-black font-semibold bg-yellow-400 px-2 py-1 rounded-full text-sm max-w-xs text-center">
                    ∙ Featured Listing
                </span>
            </div>
            <div className="flex justify-between items-center mb-4 mt-2">
                <h2 className="text-[28px] sm:text-[44px] font-bold text-slate-700 leading-snug sm:leading-tight">
                    Work With The Best
                    <br /> Business Services Around You
                </h2>
            </div>
            <div className="flex justify-end space-x-1 mb-2">
                <button
                    onClick={handlePrev}
                    disabled={!canScrollBack}
                    className={`rounded-full w-10 h-10 flex items-center justify-center ${
                        canScrollBack
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-300 cursor-not-allowed"
                    } transition duration-200 ease-in-out`}
                >
                    <FaArrowLeft className="text-white text-2xl" />
                </button>
                <button
                    onClick={handleNext}
                    disabled={!canScrollForward}
                    className={`rounded-full w-10 h-10 flex items-center justify-center ${
                        canScrollForward
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-300 cursor-not-allowed"
                    } transition duration-200 ease-in-out`}
                >
                    <FaArrowRight className="text-white text-2xl" />
                </button>
            </div>
        </div>

        <div
            className="flex overflow-x-auto no-scrollbar px-4 lg:px-8"
            ref={scrollRef}
        >
            <div className="flex flex-nowrap space-x-4 pb-10">
                {loading
                    ? // Render 6 SkeletonServiceCard components while loading
                      Array.from({ length: 6 }).map((_, index) => (
                          <SkeletonServiceCard key={index} />
                      ))
                    : // Render actual cards once data is loaded
                      cards.map((card) => (
                          <Link
                              to={`/service-details/${btoa(btoa(card.id))}`}
                              key={card.id}
                              className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[350px] lg:w-[390px] bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between"
                          >
                              <img
                                  src={card.image}
                                  alt={card.name}
                                  className="w-full h-40 sm:h-48 object-cover rounded-lg"
                              />
                              <div className="mt-3 flex-grow">
                                  <p className="text-sm sm:text-base text-gray-500">
                                      #{card.category}
                                  </p>
                                  <h3 className="text-lg sm:text-xl mt-1 text-slate-800 font-semibold">
                                      {card.name}
                                  </h3>
                                  <p className="text-sm sm:text-base text-gray-600 mt-2">
                                      {card.description ||
                                          "Lorem ipsum dolor sit amet consectetur. Eu quis vel pellentesque ullamcorper donec lorem auctor egestas adipiscing."}
                                  </p>
                              </div>
                              <div className="mt-4 bg-sky-50 p-3 rounded-lg">
                                  <div className="text-sm text-gray-800 flex justify-between mt-2">
                                      <span>
                                          <strong>Service fee: </strong>
                                      </span>
                                      <span>
                                          <strong> ${card.price}</strong>
                                      </span>
                                  </div>
                              </div>
                          </Link>
                      ))}
            </div>
        </div>
    </>
);
};

export default Servicecards;
