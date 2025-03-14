import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axiosClient from "../../axiosClient";
import SkeletonCard from "./SkeletonCard";

const Invest = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollForward, setCanScrollForward] = useState(false);
    const [currentCount, setCurrentCount] = useState(0);

    useEffect(() => {
        const getCards = () => {
            setLoading(true);
            axiosClient
                .get("/latBusiness")
                .then(({ data }) => {
                    setLoading(false);
                    setCards(data.data);
                    setCurrentCount(data.data.length - 1);
                    setTimeout(checkScrollConditions, 0); // Ensure scroll conditions are checked after the DOM updates
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        };
        getCards();
    }, []);

    const checkScrollConditions = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const isAtStart = scrollLeft <= 0; // If scrolled to the start
            const isAtEnd = scrollLeft + clientWidth >= scrollWidth; // If scrolled to the end

            setCanScrollBack(!isAtStart); // Enable left button if not at the start
            setCanScrollForward(!isAtEnd); // Enable right button if not at the end
        }
    };

    const handleNext = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            scrollRef.current.scrollLeft = scrollLeft + clientWidth;
            setTimeout(checkScrollConditions, 100); // Recheck scroll status after scrolling
        }
    };

    const handlePrev = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            scrollRef.current.scrollLeft = scrollLeft - clientWidth;
            setTimeout(checkScrollConditions, 100); // Recheck scroll status after scrolling
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            checkScrollConditions();
            scrollRef.current.addEventListener("scroll", checkScrollConditions);
            return () => {
                if (scrollRef.current) {
                    scrollRef.current.removeEventListener(
                        "scroll",
                        checkScrollConditions
                    );
                }
            };
        }
    }, []);

    return (
        <>
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
                <div className="flex justify-start">
                    <span className="bg-[#F8D849] px-2 py-2 rounded-full text-sm mb-2 font-medium shadow-md max-w-xs text-center">
                        ∙ More Than {currentCount}+
                    </span>
                </div>

                <div className="flex justify-between items-center my-4">
                    <h2 className="text-[28px] sm:text-[44px] font-bold text-slate-700 leading-snug sm:leading-tight">
                        Invest In Promising
                        <br /> New Ventures
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
                        <FaArrowLeft className="text-white text-xl" />
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
                        <FaArrowRight className="text-white text-xl" />
                    </button>
                </div>
            </div>

            <div
                className="flex overflow-x-auto no-scrollbar px-4 lg:px-8"
                ref={scrollRef}
            >
                <div className="flex flex-nowrap space-x-4 pb-10">
                    {loading
                        ? Array(4)
                              .fill()
                              .map((_, index) => <SkeletonCard key={index} />)
                        : cards.map((card, index) => (
                              <Link
                                  to={`/listing/${btoa(btoa(card.id))}`}
                                  key={card.id}
                                  onClick={() => window.scrollTo(0, 0)}
                              >
                                  <div
                                      key={index}
                                      className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[350px] lg:w-[390px] bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between"
                                  >
                                      <img
                                          src={card.image}
                                          alt={card.name}
                                          className="w-full h-40 sm:h-48 object-cover rounded-lg"
                                          loading="lazy"
                                      />
                                      <div className="mt-3 flex-grow">
                                          <p className="text-sm sm:text-base text-gray-500">
                                              {card.tags}
                                          </p>
                                          <h3 className="text-lg sm:text-xl mt-1 text-slate-800 font-semibold">
                                              {card.name}
                                          </h3>
                                          <p className="text-sm sm:text-base text-gray-600 mt-2 truncate">
                                              {card.details}
                                          </p>
                                      </div>
                                      <div className="mt-4 bg-sky-50 p-3 rounded-lg">
                                          <div className="text-sm text-gray-800 flex justify-between mb-2">
                                              <span>
                                                  <span className="font-semibold">
                                                      $
                                                      {card.investment_needed.toLocaleString()}
                                                  </span>
                                                  <br />
                                                  Goal
                                              </span>
                                              <span>
                                                  <span className="font-semibold">
                                                      {card.invest_count}
                                                  </span>
                                                  <br />
                                                  Invested
                                              </span>
                                          </div>
                                          <div className="h-2 bg-gray-200 rounded-full mt-2">
                                              <div
                                                  className="bg-green-600 h-full rounded-full"
                                                  style={{
                                                      width: `${
                                                          (card.amount_collected /
                                                              parseInt(
                                                                  card.investment_needed
                                                                      .toString()
                                                                      .replace(
                                                                          ",",
                                                                          ""
                                                                      )
                                                              )) *
                                                          100
                                                      }%`,
                                                  }}
                                              ></div>
                                          </div>

                                          <div className="text-sm text-gray-800 flex justify-between mt-2">
                                              <span>
                                                  Collected:{" "}
                                                  <strong>
                                                      $
                                                      {card.amount_collected /
                                                          1000}
                                                      K
                                                  </strong>
                                              </span>
                                              <span>
                                                  Need:{" "}
                                                  <strong>
                                                      $
                                                      {(parseInt(
                                                          card.investment_needed
                                                              .toString()
                                                              .replace(",", "")
                                                      ) -
                                                          parseInt(
                                                              card.amount_collected
                                                          )) /
                                                          1000}
                                                      K
                                                  </strong>
                                              </span>
                                          </div>
                                      </div>
                                  </div>
                              </Link>
                          ))}
                </div>
            </div>
        </>
    );
};

export default Invest;
