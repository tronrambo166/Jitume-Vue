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
import { FaStar, FaPlusCircle } from "react-icons/fa";

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

      if(rating == 0){
        alert('A rating cannot be 0!');
      }
      else{
      axiosClient.get('ratingService/' + form.service_id + '/' + rating + '/' + review).then((data) => {
        alert('Rating submitted successfully!');
        location.reload();;
      });
     }
  };


    //end rating

    return (
        <div className="container mx-auto flex flex-col md:flex-row justify-center items-center py-4 lg:py-8 mt-3">
            <div className="px-4 md:px-6 lg:px-8 xl:px-12 my-3 pt-3 w-full flex flex-col md:flex-row justify-center mx-auto gap-4 md:gap-6 lg:gap-8">
                <div className="md:w-1/3 flex flex-col mr-0">
                    <div className="relative">
                        {!bid_id ? (
                            <img
                                className="w-full max-h-[250px] shadow-sm rounded-lg"
                                src={"../" + details.image}
                                alt="Service"
                            />
                        ) : (
                            <img
                                className="w-full max-h-[250px] shadow-sm rounded-lg"
                                src={"../../" + details.image}
                                alt="Service"
                            />
                        )}
                        <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-60 rounded-b-lg text-white text-center py-2">
                            <p className="flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    className="mr-2"
                                />
                                {details.location}
                            </p>
                        </div>
                    </div>
                    <div className="w-full py-3 flex flex-col text-right">
                        <div className="text-black font-bold mb-2">
                            Amount Requested:{" "}
                            <span className="font-semibold text-green-700">
                                ${details.price}
                            </span>
                        </div>
                        <div className="flex items-center justify-end text-right mb-2">
                            {renderStars(details.rating)} ({details.rating})
                        </div>
                        <div className="text-gray-500 text-sm">
                            {details.rating_count} Ratings
                        </div>

                        {!details.booked ? (
                            <div className="my-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-1">
                                        Desired start date:
                                    </label>
                                    <input
                                        id="date"
                                        type="date"
                                        className="w-full border-gray-300 border rounded-lg p-2"
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        placeholder="mm/dd/yyyy"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Enter additional notes
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        className="w-full border-gray-300  border  rounded-lg p-2"
                                        rows="4"
                                    />
                                </div>

                                <div>
                                    {!token ? (
                                        <button
                                            onClick={handleAuthModalOpen}
                                            className="btn-primary py-2 px-6 rounded-xl mt-3"
                                        >
                                            {" "}
                                            Book Now{" "}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={book}
                                            className="btn-primary font-semibold w-[125px] h-[50px] whitespace-nowrap rounded-2xl mx-auto lg:mx-0"
                                        >
                                            {" "}
                                            Book Now{" "}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p> You booked this service! </p>
                        )}

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

                <div className="md:w-1/3 px-6">
                    <h2 className="text-black text-sm sm:text-xs md:text-sm lg:text-base font-bold">
                        More business information
                    </h2>
                    <p className="py-3 text-lg font-semibold text-black">
                        {details.name}
                    </p>
                    <p className="py-3 text-[13px]">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Hic quasi delectus dolores, quos aperiam ut illum
                        deleniti quaerat quod, ex, expedita atque officiis
                        molestias ipsam natus saepe ipsum dolorum quisquam
                        reprehenderit? Quae magni architecto dignissimos
                        nesciunt numquam libero vero autem magnam distinctio
                        quod iste, fuga voluptatibus voluptas corporis sit eos
                        temporibus et nemo! Aspernatur nam, accusamus cumque
                        quidem ducimus iusto!
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
                                className="border hover:bg-slate-200 py-2 whitespace-nowrap rounded-md px-6"
                            >
                                Contact me
                            </button>
                        ) : (
                            <button
                                onClick={handleAuthModalOpen}
                                className="border hover:bg-slate-200 py-2 whitespace-nowrap rounded-md px-6"
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
                                className="btn-primary px-6 py-2 my-3 rounded-full font-semibold text-white"
                            >
                                send
                            </button>
                        </div>
                    )}


                {token && allowToReview && 
                <button
                    className="flex items-center space-x-2    py-2 rounded"
                    onClick={togglePopup}
                  >
                    <FaPlusCircle className='text-green' />
                    <span>Add Review</span>
                  </button>}

                  <hr></hr>


        {showPopup && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h4 className="text-lg font-bold mb-4">Add Your Review</h4>
            <form onSubmit={reviewSubmit}>
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
              <textarea
                className="w-full border border-gray-300 rounded p-2 mb-4"
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
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
                      <b className="text-green-700"> {item.user_name}</b> {item.text} &nbsp; {item.rating}
                    </p>
                  </div>
                  ))}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal} // Close modal when the user clicks 'close'
                    content="Please log in to proceed with booking"
                />
            )}

            {isAuthModalOpen && (
                <Modal
                    isOpen={isAuthModalOpen}
                    onClose={handleCloseModal} // Close modal when user clicks 'close'
                    content="Authentication required"
                />
            )}
        </div>
    );
};

export default ServiceDetails;
