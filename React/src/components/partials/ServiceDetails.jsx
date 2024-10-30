import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLock,
    faStar,
    faStarHalfAlt,
    faExclamationCircle,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useEffect } from "react";
import axiosClient from "../../axiosClient";
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/contextProvider";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import Navbar from "./Navbar";
import Modal from "./Authmodal";
import { FaStar, FaPlusCircle, FaMapMarkerAlt } from "react-icons/fa";
import Calendar from "./moduleParts/Calendar";
import Footer from "../Landing-page/global/Footer2";
import Nav2 from "../Landing-page/global/Nav2";
import ReviewSummary from "./moduleParts/ReviewServdetailSummary";
import ReviewList from "./moduleParts/ReviewServicedetailList";
import PaginationComponent from "./moduleParts/PaginationControls";
import img from "../../assets/profile.png";

const ServiceDetails = () => {
    const { token, setUser, setAuth, auth } = useStateContext();
    const { id } = useParams();
    const { bid_id } = useParams();
    const { business_bid_id } = ""; //useParams();
    const [notes, setNotes] = useState("");
    const [rebookRes, setRebookRes] = useState("");
    const [details, setDetails] = useState("");
    const [milestonesRes, setMilestonesRes] = useState("");
    const [cartRes, setCartRes] = useState("");
    const [ratingRes, setRatingRes] = useState("");
    const [booked, setBooked] = useState("");
    const [allowToReview, setallowToReview] = useState(false);
    const [Contactmodal, setContactmodal] = useState("");
    const [reviewData, setReviewData] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false); // State to show/hide the calendar
    const [selectedDate, setSelectedDate] = useState(""); // State to store the selected date

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Authentication modal

    const navigate = useNavigate();
    const form = {
        service_id: atob(atob(id)),
    };
    const auth_user = true;
    const plan = "silver";
    const subscrib_id = "123";

    const unlockBySubs = (serviceId, subscribId, plan) => {
        console.log(`Unlocking service ${serviceId} with plan ${plan}`);
    };

    const makeSession = (serviceId) => {
        console.log(`Making session for service ${serviceId}`);
    };
    const handleDateSelect = (date) => {
        // Format the date as mm/dd/yyyy
        const formattedDate = `${String(date.getMonth() + 1).padStart(
            2,
            "0"
        )}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
        setSelectedDate(formattedDate);
        setShowCalendar(false); // Hide calendar after selecting a date
    };
    const reviews = [
        {
            id: 1,
            name: "Leslie Alexander",
            date: "July 22, 2023",
            location: "Reviewed from United States on July 22,2023",
            stars: 5,
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit.",
            profileImage: [img],
        },
        {
            id: 2,
            name: "David Jones",
            date: "July 22, 2023",
            location: "Reviewed from United States on July 22,2023",
            stars: 5,
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit.",
            profileImage: [img],
        },
    ];

    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(reviews.length / itemsPerPage);

    const getPageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    const handlePreviousClick = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastReview = currentPage * itemsPerPage;
    const indexOfFirstReview = indexOfLastReview - itemsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to the first page when changing items per page
    };

    const handlecontactmodal = (event) => {
        event.preventDefault();
        setContactmodal(true);
    };

    const [isModalOpen, setModalOpen] = useState(false); // To control modal visibility

    const handleBookNow = () => {
        if (!token) {
            setModalOpen(true); // Open modal if token is missing
        } else {
            book(); // Call the book function if the user is authenticated
        }
    };
    useEffect(() => {
        // Close modals when user becomes authenticated
        if (token) {
            setIsAuthModalOpen(false); // Close authentication modal
            setModalOpen(false); // Close general modal
        }
    }, [token]);

    const handleCloseModal = () => {
        setIsAuthModalOpen(false); // Manual close
        setModalOpen(false); // Manual close
    };

    const handleAuthModalOpen = (event) => {
        event.preventDefault();
        if (!token) {
            setIsAuthModalOpen(true); // Open auth modal if not authenticated
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={`full-${i}`}
                    icon={faStar}
                    className="text-green"
                />
            );
        }
        if (halfStar) {
            stars.push(
                <FontAwesomeIcon
                    key="half"
                    icon={faStarHalfAlt}
                    className="text-green"
                />
            );
        }
        for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={`empty-${i}`}
                    icon={faStar}
                    className="text-gray-300"
                />
            );
        }
        return stars;
    };

    //CORE METHODS
    let url = "";
    let url2 = "";
    useEffect(() => {
        if (token) url = "/serviceResultsAuth/";
        else url = "/ServiceResults/";

        const getDetails = () => {
            axiosClient
                .get(url + form.service_id)
                .then(({ data }) => {
                    data.data[0]["rating"] =
                        parseFloat(data.data[0]["rating"]) /
                        parseFloat(data.data[0]["rating_count"]);
                    data.data[0]["rating"] = data.data[0]["rating"].toFixed(2);
                    if (data.data[0]["rating_count"] == 0)
                        data.data[0]["rating"] = 0;
                    setDetails(data.data[0]);
                    //console.log(details)
                    //console.log(data)
                })
                .catch((err) => {
                    console.log(err); //setLoading(false)
                });
        };

        if (token) url2 = "/getMilestonesS_Auth/";
        else url2 = "/getMilestonesS/";

        const getMilestones = () => {
            axiosClient
                .get(url2 + form.service_id)
                .then(({ data }) => {
                    setMilestonesRes(data.data);
                    setallowToReview(data.allow);
                    setReviewData(data.reviews);
                    //console.log(allowToReview);
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getMilestones();

        getDetails();
    }, []);

    // Handle contact modal toggle
    const sendMessage = (event) => {
        event.preventDefault();
        const payload = {
            service_id: form.service_id,
            msg: $("#msg").val(),
        };

        axiosClient
            .post("serviceMsg", payload)
            .then(({ data }) => {
                console.log(data);
                if (data.success) {
                    $.alert({
                        title: "Alert!",
                        content: data.success,
                    });
                }
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
                console.log(err);
            });
    };

    const handleContactModal = (event) => {
        event.preventDefault();
        if (token) {
            setContactmodal(!Contactmodal);
        } else {
            setIsAuthModalOpen(true);

            // Optionally, you can redirect or show a message if the user is not logged in
            alert("Please log in to contact the service provider.");
        }
    };

    // begin getMilestones
    // this is from the getMilestones () in serviceDetails.vue

    //end getMilestones

    // begin addToCart
    // this is from the addToCart () in serviceDetails.vue
    const book = (e) => {
        e.preventDefault();

        const selectedDate = $("#date").val();
        const today = new Date().toISOString().split("T")[0]; // Get today's date

        if (selectedDate > today) {
            $.alert({
                title: "Invalid Date!",
                content: "The selected date cannot be in the future.",
                type: "red",
            });
            return; // Prevent form submission
        }

        const payload = {
            date: selectedDate,
            note: notes,
            service_id: form.service_id,
            business_bid_id: bid_id,
        };

        console.log(payload);

        axiosClient
            .post("/serviceBook", payload)
            .then(({ data }) => {
                if (data.success) {
                    $.alert({
                        title: "Alert!",
                        content: data.success,
                    });
                    setBooked(true);

                    // Clear form fields
                    $("#date").val("");
                    setNotes("");
                    setForm({ service_id: "", business_bid_id: "" });
                } else {
                    $.alert({
                        title: "Alert!",
                        content: data.failed,
                        type: "red",
                        buttons: {
                            tryAgain: {
                                text: "Close",
                                btnClass: "btn-red",
                                action: function () {},
                            },
                        },
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
                console.log(err);
            });
    };

    const rebook = (e) => {
        e.preventDefault();
        var id = form.service_id;
        axiosClient.get("rebook_service/" + id).then((data) => {
            if (data.data == "success") location.reload();
            else alert("something went wrong!");
        });
    };

    //for review

    const [showPopup, setShowPopup] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleRating = (newRating) => {
        setRating(newRating);
    };

    const reviewSubmit = (e) => {
        e.preventDefault();
        //console.log(`Rating: ${rating}, Review: ${review}`);
        // Submit the review logic here (e.g., API call)
        setShowPopup(false); // Close the popup after submitting

        if (rating == 0) {
            alert("A rating cannot be 0!");
        } else {
            axiosClient
                .get(
                    "ratingService/" +
                        form.service_id +
                        "/" +
                        rating +
                        "/" +
                        review
                )
                .then((data) => {
                    alert("Rating submitted successfully!");
                    location.reload();
                });
        }
    };

    //end rating
    return (
        <>
            <div className="w-full flex flex-col md:flex-row justify-center items-center py-2 lg:py-4 mt-3">
                <div className="flex flex-col space-x-6 md:flex-row mx-auto w-full gap-4 md:gap-8 lg:gap-10 px-4 md:px-8">
                    {" "}
                    {/* Added horizontal padding */}
                    {/* IMAGE SECTION ON THE LEFT */}
                    <div className="flex-grow max-w-full md:max-w-[70%] rounded-lg overflow-hidden opacity-100">
                        {" "}
                        {/* Allow the image section to grow */}
                        {/* Image Section */}
                        <div className="relative">
                            {!details?.image ? (
                                <div className="flex items-center justify-center w-full h-[300px] md:h-[400px] bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700 overflow-hidden relative">
                                    {/* SVG Placeholder */}
                                    <svg
                                        className="w-16 h-16 text-gray-200 dark:text-gray-600"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 18"
                                    >
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                            ) : (
                                <img
                                    className="w-full h-auto rounded-lg object-cover"
                                    src={"../" + details.image}
                                    alt="Service"
                                />
                            )}

                            {/* Overlay Section with Location */}
                            {/* <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-60 rounded-b-lg text-white text-center py-2">
            <p className="flex items-center justify-center">
                <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mr-2"
                />
                {details.location}
            </p>
        </div> */}
                        </div>
                        {/* BUSINESS INFORMATION SECTION BELOW THE IMAGE */}
                        <div className="w-full py-3 flex  flex-col">
                            <div className="flex items-center  justify-start mb-2">
                                {/* <span className="text-yellow-400">
                                {renderStars(details.rating)}{" "}
                            </span> */}
                                {/* <span className="ml-2">({details.rating})</span> */}
                            </div>
                            {/* <div className="text-gray-500 text-sm">
                            {details.rating_count} Ratings
                        </div> */}

                            {/* <h2 className="text-black text-sm sm:text-xs md:text-sm lg:text-base font-bold">
                            More business information
                        </h2> */}
                            <p>
                                <p className="text-5xl font-semibold text-[#334155] flex justify-between items-center">
                                    <span>{details.name}</span>
                                    <div className="text-black flex items-center font-bold">
                                        <p className="text-gray-800 text-sm pr-2">
                                            /Amount Requested:
                                        </p>
                                        <span className="font-semibold text-[20px] text-green-700">
                                            ${details.price}
                                        </span>
                                    </div>
                                </p>
                            </p>
                            <p className="py-3 text-[13px]">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Hic quasi delectus dolores,
                                quos aperiam ut illum deleniti quaerat quod, ex,
                                expedita atque officiis molestias ipsam natus
                                saepe ipsum dolorum quisquam reprehenderit? Quae
                                magni architecto dignissimos nesciunt numquam
                                libero vero autem magnam distinctio quod iste,
                                fuga voluptatibus voluptas corporis sit eos
                                temporibus et nemo! Aspernatur nam, accusamus
                                cumque quidem ducimus iusto!
                            </p>
                            <p className="flex items-center mt-5 mb-5 text-gray-700">
                                <FaMapMarkerAlt className="mr-2 text-lg text-gray-500" />
                                Franz Josef Strauss, Munich, Germany
                            </p>

                            <div className="flex items-center mt-2 gap-6 text-sm">
                                {token && details.id ? (
                                    <Link
                                        to={`/service-milestones/${btoa(
                                            btoa(details.id)
                                        )}`}
                                        key={details.id}
                                    >
                                        <button className="border rounded-md py-2 whitespace-nowrap hover:bg-slate-200 px-2">
                                            Service Milestone Breakdown
                                        </button>
                                    </Link>
                                ) : null}

                                {token ? (
                                    <button
                                        onClick={setContactmodal}
                                        className="border hover:bg-green-900 py-2 bg-green text-white whitespace-nowrap rounded-md px-6"
                                    >
                                        Contact me
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleAuthModalOpen}
                                        className="border hover:bg-green-900 py-2 bg-green whitespace-nowrap rounded-md px-6"
                                    >
                                        Contact me
                                    </button>
                                )}
                            </div>

                            {/* Conditional rendering of contact section */}
                            {Contactmodal && token && (
                                <div className="contact py-4">
                                    <hr></hr>
                                    <h1 className="font-bold py-2 text-xl">
                                        Contact Us
                                    </h1>
                                    <textarea
                                        id="msg"
                                        name="message"
                                        placeholder="Write your message here"
                                        className="w-full border-gray-300 border rounded-lg p-2"
                                        rows="4"
                                    ></textarea>
                                    <button
                                        onClick={sendMessage}
                                        className="btn-primary px-6 py-2 my-3 rounded-md font-semibold text-white"
                                    >
                                        send
                                    </button>
                                </div>
                            )}

                            {token && allowToReview && (
                                <button
                                    className="flex items-center space-x-2 py-2 rounded"
                                    onClick={togglePopup}
                                >
                                    <FaPlusCircle className="text-green" />
                                    <span>Add Review</span>
                                </button>
                            )}

                            <hr className="mt-4 mb-4"></hr>

                            {showPopup && (
                                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white p-6 rounded shadow-md w-1/3">
                                        <h4 className="text-lg font-bold mb-4">
                                            Add Your Review
                                        </h4>
                                        <form onSubmit={reviewSubmit}>
                                            <div className="flex items-center mb-4">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FaStar
                                                        key={star}
                                                        className={`cursor-pointer ${
                                                            star <= rating
                                                                ? "text-yellow-500"
                                                                : "text-gray-300"
                                                        }`}
                                                        onClick={() =>
                                                            handleRating(star)
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <textarea
                                                className="w-full border border-gray-300 rounded p-2 mb-4"
                                                placeholder="Write your review here..."
                                                value={review}
                                                onChange={(e) =>
                                                    setReview(e.target.value)
                                                }
                                                required
                                            />
                                            <div className="flex justify-end space-x-4">
                                                <button
                                                    type="button"
                                                    className="bg-gray-300 px-4 py-2 rounded"
                                                    onClick={togglePopup}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn-primary text-white px-4 py-2 rounded"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            <div className="my-4 text-left">
                                <h3 className="font-bold my-3">Reviews</h3>
                                {reviewData.map((item) => (
                                    <div className="mt-4">
                                        <img
                                            className="inline rounded-[50%]"
                                            src="https://via.placeholder.com/30"
                                            alt="User"
                                            width="30"
                                        />
                                        <p className="inline text-sm">
                                            <b className="text-green-700">
                                                {" "}
                                                {item.user_name}
                                            </b>{" "}
                                            {item.text} &nbsp; {item.rating}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Ratings */}
                    {/* Ratings */}
                    {/* DESIRED START DATE AND NOTES SECTION ON THE RIGHT */}
                    <div>
                        <div className="flex justify-end">
                            <div className="md:w-[330px] max-w-lg p-4 border rounded-lg ">
                                {/* Desired Start Date Section */}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-3">
                                        Desired start date:
                                    </label>

                                    {/* Calendar stays visible */}
                                    <Calendar onDateSelect={handleDateSelect} />

                                    {/* Hidden input to store the selected date */}
                                    <input
                                        type="hidden"
                                        id="date"
                                        name="date"
                                        value={selectedDate}
                                    />
                                </div>

                                {/* Notes Section */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Enter additional notes
                                    </label>
                                    <textarea
                                        value={notes}
                                        placeholder="Type here..."
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        className="w-full border-gray-300 border rounded-lg p-2"
                                        rows="4"
                                    />
                                </div>

                                {/* Book Now Button */}
                                <div>
                                    {!token ? (
                                        <button
                                            onClick={handleAuthModalOpen}
                                            className="btn-primary w-full py-2 mt-3 rounded-xl" // Made button full width
                                        >
                                            Book Now
                                        </button>
                                    ) : (
                                        <button
                                            onClick={book}
                                            className="btn-primary font-semibold w-full h-12 mt-3 whitespace-nowrap rounded-md"
                                        >
                                            Book Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {token && allowToReview && (
                            <div>
                                <button
                                    onClick={rebook}
                                    className="btn-primary py-2 px-6 rounded-xl mt-3"
                                >
                                    {" "}
                                    Rebook{" "}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        content="Please log in to proceed with booking"
                    />
                )}
                {isAuthModalOpen && (
                    <Modal
                        isOpen={isAuthModalOpen}
                        onClose={handleCloseModal}
                        content="Authentication required"
                    />
                )}
            </div>
            <div>
                <div className="px-[34px]">
                    <div className="  p-4 sm:p-6">
                        <div className=" grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
                            {/* On mobile, ReviewSummary takes up full width, on larger screens it takes 1/3 */}
                            <div className="sm:col-span-1">
                                <ReviewSummary />
                            </div>
                            {/* On mobile, ReviewList takes up full width, on larger screens it takes 2/3 */}
                            <div className="sm:col-span-2">
                                <ReviewList reviews={currentReviews} />
                                <div className="flex flex-col sm:flex-row justify-between items-center ">
                                    <div className="flex items-center">
                                        <span className="mr-2 text-gray-600">
                                            Show
                                        </span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
                                            className="border bg-white border-gray-300 rounded-full px-4 py-1 text-gray-600 shadow-sm outline-none focus:ring-1 focus:ring-gray-300 transition ease-in-out duration-150"
                                        >
                                            <option value={5}>5</option>
                                            <option value={6}>6</option>
                                            <option value={7}>7</option>
                                            <option value={8}>8</option>
                                        </select>
                                        <span className="ml-2 text-gray-600">
                                            Cards per page
                                        </span>
                                    </div>

                                    <div className=" sm:mt-0">
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            handlePreviousClick={
                                                handlePreviousClick
                                            }
                                            handlePageClick={handlePageClick}
                                            handleNextClick={handleNextClick}
                                            getPageNumbers={getPageNumbers}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ServiceDetails;
