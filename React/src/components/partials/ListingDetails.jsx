import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLock,
    faStar,
    faStarHalfAlt,
    faExclamationCircle,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import AuthModal from "./Authmodal";
import { useEffect, useRef } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextProvider";
import { Link } from "react-router-dom";
import Modal from "./Authmodal";
import UnlockPopup from "./Unlockpopup";
import bannerframe from "../../images/bannerframe.png";
import { FaStar, FaPlusCircle } from "react-icons/fa";
import { FaLock, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import img from "../../assets/profile.png";
import ReviewSummary from "./moduleParts/ReviewSummary";
import ReviewList from "./moduleParts/ReviewList";
import PaginationComponent from "./moduleParts/PaginationControls";
import Footer from "../Landing-page/global/Footer2";
import Nav2 from "../Landing-page/global/Nav2";
import ScrollToTop from "../pages/ScrollToTop";
import { useAlert } from "../partials/AlertContext";
import BackBtn from "./BackBtn";
import TruncateWithModal from "./TruncateWithModal";
import TujitumeLogo from "../../images/Tujitumelogo.svg";
import ReportModal from "./ReportModal";
import { FiFlag, FiMoreHorizontal } from "react-icons/fi";
import CreateInvestorAccount from "./CreateInvAccount";

const ListingDetails = ({ onClose }) => {
    const { token, user, setAuth, auth } = useStateContext();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isUnlockPopupOpen, setIsUnlockPopupOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleOpen = () => {
        setIsVisible(true);
    };
    const { id } = useParams();
    const form = {
        listing_id: atob(atob(id)),
        range: "gold",
        conv: false,
    };

    const [reviewData, setRev] = useState([]);
    const reviews = reviewData;

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
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const indexOfLastReview = currentPage * itemsPerPage;
    const indexOfFirstReview = indexOfLastReview - itemsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to the first page when changing items per page
    };
    const auth_user = true;
    const plan = "gold";
    const subscrib_id = "123";

    const [isInvestor, setIsInvestor] = useState(false);
    const [conv, setConv] = useState(false);
    const [details, setDetails] = useState("");
    const [allowToReview, setAllow] = useState("");
    const [amount_r, setAmount_r] = useState("");
    const [running, setRunning] = useState(false);
    const [mile, setMile] = useState(true);
    const [subscribeData, setSubscribeData] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);

    const [isOpen, setIsOpen] = useState(true); // Popup is initially open

    const [amount, setAmount] = useState("");
    const [percentage, setPercentage] = useState("");
    const [equipmentAmount, setEquipmentAmount] = useState("");
    const [equipmentPercentage, setEquipmentPercentage] = useState("");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [equipmentErrorMessage, setEquipmentErrorMessage] = useState("");

    //FOR SMALL POP UP
    const [showSmallFee, setShowSmallFee] = useState(false);
    const [showSubs, setShowSubs] = useState(false);

    //if (!isOpen) return null;
    const handleUnlockFee = () => {
        setShowSmallFee(true);
        setShowSubs(false);
    };
    const handleSubscribe = () => {
        if (subscribeData.subscribed) {
            setShowSubs(true);
            setShowSmallFee(false);
        } else {
            navigate(`/subscribe/${btoa(btoa(form.listing_id))}`);
        }
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
            $.alert({
                title: "Alert!",
                content: "A rating cannot be 0!",
            });
        } else {
            axiosClient
                .get(
                    "ratingListing/" +
                        form.listing_id +
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

    //FOR SMALL POP UP

    const openUnlockPopup = () => setIsUnlockPopupOpen(true);
    const closeUnlockPopup = () => setIsUnlockPopupOpen(false);
    const makeSession = (listingId) => {
        // console.log(`Making session for listing ${listingId}`);
    };
    const openAuthModal = () => {
        setIsAuthModalOpen(true);
    };
    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
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
    const [formattedAmount, setFormattedAmount] = useState("");

    const handleAmountChange = (e) => {
        const enteredAmount = e.target.value.replace(/,/g, ""); // Remove commas for parsing
        setFormattedAmount(
            enteredAmount ? parseFloat(enteredAmount).toLocaleString() : ""
        ); // Format the amount with commas

        setAmount(enteredAmount); // Store the raw value without commas

        if (enteredAmount && amount_r > 0) {
            const amount = parseFloat(enteredAmount);
            if (amount > amount_r) {
                setAmount(""); // Clear raw amount
                setFormattedAmount(""); // Clear formatted amount
                setPercentage(0);
                setErrorMessage("Amount exceeds the investment needed!");
            } else {
                const calculatedPercentage = (
                    (amount / details.investment_needed) *
                    parseInt(details.share)
                ).toFixed(2);
                setPercentage(calculatedPercentage);
                setErrorMessage("");
            }
        } else {
            setPercentage("");
            setErrorMessage("");
        }
    };

    // console.log(formattedAmount);

    const sintamei = amount;
    // alert(sintamei);

    const lemein = equipmentAmount;
    // alert(lemein);
    const handleEquipmentAmountChange = (e) => {
        let enteredAmount = e.target.value.replace(/,/g, ""); // Remove commas for calculations
        let formattedAmount = enteredAmount
            ? parseFloat(enteredAmount).toLocaleString() // Add commas for display
            : "";

        setEquipmentAmount(formattedAmount); // Set formatted amount with commas

        let rawAmount = parseFloat(enteredAmount); // Raw value for calculations

        if (enteredAmount && amount_r > 0) {
            if (rawAmount > amount_r) {
                setEquipmentAmount(""); // Clear formatted amount
                setEquipmentPercentage(0);
                setEquipmentErrorMessage(
                    "Amount exceeds the investment required!"
                );
            } else {
                const calculatedPercentage = (
                    (rawAmount / details.investment_needed) *
                    parseInt(details.share)
                ).toFixed(2);
                setEquipmentPercentage(calculatedPercentage);
                setEquipmentErrorMessage(""); // Clear the error message
            }
        } else {
            setEquipmentPercentage("");
            setEquipmentErrorMessage(""); // Clear the error message
        }
    };

    const handleEquipmentInvest = () => {
        // Remove commas before encoding
        var amountWithoutCommas = equipmentAmount.replace(/,/g, ""); // Strip commas
        var encodedAmount = btoa(amountWithoutCommas); // Encode the raw value without commas

        var percent = btoa(equipmentPercentage); // Encode percentage
        var id = btoa(form.listing_id); // Encode listing ID

        if (amountWithoutCommas == "" || amountWithoutCommas == 0)
            $.alert({
                title: "Alert!",
                content: "Please enter a bid to invest!",
            });
        else {
            let t = this;
            $.confirm({
                title: false,
                content: `<img src="${TujitumeLogo}" alt="Tujitume Logo" style="max-width: 100px; margin-right: 10px;" class="jconfirm-logo"><div>Are you sure you want to bid?</div>`,
                buttons: {
                    confirm: function () {
                        navigate(
                            `/investEquip/${encodedAmount}/${id}/${percent}`
                        );
                    },
                    cancel: function () {
                        $.alert("Canceled!");
                    },
                },
            });
        }
    };

    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleOpenReportModal = () => {
        if (!token) {
            return setIsModalOpen(true); // Show message if no token
        }
        setIsModalOpen2(true); // Open modal if token exists
    };

    const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);

    const handleOpenReportModal2 = () => {
        setIsInvestorModalOpen(true);
    };

    // const handleUnlockClick = () => {
    //     setShowAuthModal(true);
    // };
    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const handleInvestClick = () => {
        // var amount = $("#investmentAmount").val();
        var amount = $("#investmentAmount").val().replace(/,/g, "");
        var percent = document.getElementById("percent").innerHTML;

        if (amount == "" || amount == 0)
            $.alert({
                title: "Alert!",
                content: "Please enter a bid to invest!",
            });
        else {
            var percent = parseFloat(percent);
            var amount = base64_encode(amount);
            var showprice = parseFloat(0.25 * base64_decode(amount));
            var fullAmount = base64_decode(amount);

            percent = base64_encode(percent);
            var purpose = base64_encode("bids");
            var listing_id = base64_encode(form.listing_id);

            var content = `<div style="padding: 20px;  text-align: left;">
                            <img 
                                src="${TujitumeLogo}" 
                                alt="Tujitume Logo" 
                                style="max-width: 120px; margin-bottom: 20px; display: block;" 
                                class="jconfirm-logo" 
                            />
                            <div>
                                <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #333;">Are you sure you want to bid?</h2>
                                <p style="font-size: 18px; color: #333; margin-bottom: 8px;">
                                Bid amount: <span style="color: green; font-weight: bold;">$${fullAmount}</span>
                                </p>
                                <p style="font-size: 16px; color: #666; margin-bottom: 8px;">
                                Only 25% of the bid amount is required upfront as a deposit.
                                </p>
                                <p style="font-size: 18px;">
                                Deposit amount (25% of the bid amount): <span style="color: green; font-weight: bold;">$${showprice}</span>
                                </p>
                            </div>
                    `;
            $.confirm({
                title: false,
                content: content,

                buttons: {
                    confirm: function () {
                        //window.location.href =
                        //"/checkout/" +amount +"/" +listing_id +"/" +percent +"/" +purpose;
                        navigate("/checkout", {
                            state: {
                                amount: amount,
                                listing_id: listing_id,
                                percent: percent,
                                purpose: purpose,
                            },
                        });
                    },
                    cancel: function () {
                        $.alert("Canceled!");
                    },
                },
            });
        }
        //navigate('/checkout');
    };

    //CORE METHODS
    let url = "";
    useEffect(() => {
        //Remaining Payment Link
        const string = searchParams.get("string");
        if (string != null) {
            var original = string;
            original = base64_decode(base64_decode(original));
            const array = original.split("_0A_");
            const array2 = array[1].split("_X1_");
            const enc_amount = base64_decode(
                base64_decode(base64_decode(array2[0]))
            );
            const enc_bid_id = base64_decode(
                base64_decode(base64_decode(array2[1]))
            );
            navigate("/checkout", {
                state: {
                    amount: btoa(enc_amount * 0.75),
                    listing_id: btoa(enc_bid_id),
                    purpose: btoa("awaiting_payment"),
                    percent: "",
                },
            });
        }
        //Remaining Payment Link

        if (!token) $("#unlockButton").removeClass("hidden");

        const getDetails = () => {
            axiosClient
                .get("/searchResults/" + form.listing_id)
                .then(({ data }) => {
                    data.data[0]["rating"] =
                        parseFloat(data.data[0]["rating"]) /
                        parseFloat(data.data[0]["rating_count"]);
                    data.data[0]["rating"] = data.data[0]["rating"].toFixed(2);
                    if (data.data[0]["rating_count"] == 0)
                        data.data[0]["rating"] = 0;

                    setDetails(data.data[0]);
                    //if (data.data[0].investors_fee == null) setConv(true);
                    // console.log(data);
                })
                .catch((err) => {
                    console.log(err); //setLoading(false)
                });
        };

        if (token) url = "/getMilestonesAuth/";
        else url = "/getMilestones/";

        const getMilestones = () => {
            axiosClient
                .get(url + form.listing_id)
                .then(({ data }) => {
                    setAllow(data.allowToReview);
                    setAmount_r(data.amount_required);
                    setRunning(data.running);
                    setMile(data.data.length);
                    // console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const isSubscribed = () => {
            axiosClient
                .get("/isSubscribed/" + form.listing_id)
                .then(({ data }) => {
                    // console.log(data);
                    setIsInvestor(data.isInvestor);

                    if (data.fee == null) setConv(true);
                    else setConv(data.conv);

                    $("#unlockButton").removeClass("hidden");

                    if (data.count > 0) {
                        setSubscribeData(data.data);
                        if (data.data.subscribed == 0)
                            $("#small_fee_div").removeClass("collapse");
                    } else {
                        $("#small_fee_div").removeClass("collapse");
                        $("#small_fee").addClass("modal_ok_btn");
                    }

                    if (data.reviews.length > 0) setRev(data.reviews);
                    // console.log(data.reviews);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        isSubscribed();
        //setTimeout(() => { isSubscribed(); }, 500);
        setTimeout(() => {
            getDetails();
        }, 500);
        getMilestones();
    }, []);

    const download_business = () => {
        axiosClient({
            url: "download_business/" + form.listing_id, //your url
            method: "GET",
            responseType: "blob",
        }).then((data) => {
            // console.log(data);
            if (data.data.size == 3) {
                $.alert({
                    title: "Alert!",
                    content:
                        "The business has no such document or the file not found!",
                    type: "red",
                    buttons: {
                        tryAgain: {
                            text: "Close",
                            btnClass: "btn-red",
                            action: function () {},
                        },
                    },
                });
            } //console.log(data);
            else {
                const href = URL.createObjectURL(data.data);
                const link = document.createElement("a");
                link.href = href;

                if (
                    data.data.type ==
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                )
                    link.setAttribute("download", "statement.docx");
                //or any other extension
                else link.setAttribute("download", "statement.pdf");

                document.body.appendChild(link);
                link.click();
            }
        });
    };

    const download_statement = () => {
        axiosClient({
            url: "download_statement/" + form.listing_id, //your url
            method: "GET",
            responseType: "blob",
        }).then((data) => {
            // console.log(data);
            if (data.data.size == 3) {
                $.alert({
                    title: "Alert!",
                    content:
                        "The business has no such document or the file not found!",
                    type: "red",
                    buttons: {
                        tryAgain: {
                            text: "Close",
                            btnClass: "btn-red",
                            action: function () {},
                        },
                    },
                });
            } //console.log(data);
            else {
                const href = URL.createObjectURL(data.data);
                const link = document.createElement("a");
                link.href = href;

                if (
                    data.data.type ==
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                )
                    link.setAttribute("download", "statement.docx");
                //or any other extension
                else link.setAttribute("download", "statement.pdf");

                document.body.appendChild(link);
                link.click();
            }
        });
    };

    const stripeSmallFee = (business_id, amount) => {
        var amount = btoa(amount);
        var business_id = btoa(business_id);
        var purpose = btoa("small_fee");
        $.confirm({
            title: false,
            content: `<img src="${TujitumeLogo}" alt="Tujitume Logo" style="max-width: 100px; margin-right: 10px;" class="jconfirm-logo"><div>Are you sure?</div>`,
            buttons: {
                confirm: function () {
                    navigate("/checkout", {
                        state: {
                            amount: amount,
                            listing_id: business_id,
                            purpose: purpose,
                            percent: "",
                        },
                    });
                },
                cancel: function () {
                    $.alert("Canceled!");
                },
            },
        });

        sessionStorage.setItem("purpose", "One time unlock - Small fee");
    };
    //= mile_id => e =>
    const unlockBySubs = (listing_id, sub_id, plan, e) => {
        //e.preventDefault();
        axiosClient
            .get("unlockBySubs/" + listing_id + "/" + sub_id + "/" + plan)
            .then((data) => {
                //console.log(data)
                if (data.data.status == 200) {
                    if (plan == "token") {
                        $.alert({
                            title: "Alert!",
                            content:
                                "Thanks, " +
                                (subscribeData.token_left - 1) +
                                " more tokens to go!",
                        });
                        location.reload();
                    } else location.reload();
                }

                if (data.data.error) {
                    alert("Business not in range!");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // alert
    const [alertShown, setAlertShown] = useState(false);

    // useEffect(() => {
    //     if (token && conv && !alertShown) {
    //         showAlert("info", "Business is unlocked ");
    //         setAlertShown(true);
    //     }
    // }, [token, conv, alertShown]);

    // alrt above

    //CORE METHODS END

    const Popup = ({ isOpen, onClose }) => {
        if (!isOpen) return null;
        return (
            <div className="relative flex flex-col md:flex-row justify-start items-start py-4 lg:py-8 mt-3 pl-0 pr-0 w-full">
                <div className="gap-16 w-full flex flex-col md:flex-row">
                    <h2 className="text-xl font-bold mb-4">
                        Financial Statements
                    </h2>
                    <p>
                        Here you can add the content for financial statements
                        download or instructions.
                    </p>
                    <button
                        className="mt-4 btn-primary text-white px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    // Unlock Logic below
    useEffect(() => {
        const shouldOpenModal = localStorage.getItem("unlockToInvest");
        if (shouldOpenModal === "1") {
            localStorage.removeItem("unlockToInvest"); // Remove the flag to prevent reopening

            handleOpen(); // Call the handleOpen function
        }
    }, []);
    const handleUnlockClick = () => {
        localStorage.setItem("unlockToInvest", "1"); // Set the flag in local storage
        setIsModalOpen(true); // Open the modal
    };

    return (
        <>
            {/*      <div className=' list w-full h-auto'>
<img src={bannerframe} alt="" />
        </div>*/}
            {/* <Nav2 />*/}
            <div className="flex items-center justify-between  ">
                <BackBtn />
            </div>
            <div className="flex flex-col md:flex-row  justify-start items-start py-4 lg:py-8 mt-3 w-full px-4 md:px-6 lg:px-8">
                <div className="w-full flex ml-1 md:space-x-6  flex-col md:flex-row gap-4 md:gap-6 lg:gap-8">
                    {/* Left Section */}
                    <div className="md:w-1/2">
                        <h2 className="bg-yellow-300 text-sm px-4 py-2 inline-block mb-4 rounded-full font-semibold">
                            • More business information
                        </h2>
                        {!details ? (
                            <div className="flex flex-col items-start gap-4 text-left">
                                <div className="w-24 h-6 bg-gray-300 rounded-full animate-pulse mb-2"></div>
                                <div className="w-48 h-6 bg-gray-300 rounded-full animate-pulse mb-2"></div>
                                <div className="w-36 h-6 bg-gray-300 rounded-full animate-pulse mb-2"></div>
                                <div className="w-64 h-6 bg-gray-300 rounded-full animate-pulse mb-2"></div>
                                <div className="w-32 h-6 bg-gray-300 rounded-full animate-pulse mb-2"></div>
                                <div className="w-40 h-6 bg-gray-300 rounded-full animate-pulse mb-2"></div>
                            </div>
                        ) : (
                            <>
                                <p className="text-xl md:text-2xl lg:text-4xl font-bold text-[#334155] mb-4">
                                    {details.name}
                                </p>

                                <div className="flex items-center font-semibold gap-3 text-[#1E293B] mb-4">
                                    {/* <p>#Shop</p>
                                    <p>#Grocery Store</p>
                                    <p>#Food</p> */}
                                    <p>#{details.category.replace("/", "-")}</p>
                                </div>
                                <TruncateWithModal
                                    content={details.details}
                                    maxLength={180} // Customize the truncation length
                                    buttonText="View More" // Customize the button label
                                    modalTitle={details.name} // Customize the modal title
                                />

                                <div className="mb-4 py-2 flex flex-col gap-3">
                                    <p className="flex items-center text-gray-700">
                                        <FaMapMarkerAlt className="mr-2 text-lg text-gray-500" />
                                        {details.location}
                                    </p>
                                    <p className="flex items-center text-gray-700 mt-2">
                                        <FaPhoneAlt className="mr-2 text-lg text-gray-500" />
                                        Contact: {details.contact}
                                    </p>
                                </div>

                                <div
                                    className="flex flex-wrap md:flex-wrap lg:flex-nowrap whitespace-nowrap

                                  items-center gap-1 mt-6 "
                                >
                                    <span className="text-gray-700 whitespace-nowrap font-medium">
                                        Amount Requested:
                                    </span>
                                    <p className="text-green-700 text-sm font-bold">
                                        $
                                        {(
                                            details.investment_needed || 0
                                        ).toLocaleString()}
                                        <span className="text-sm">
                                            {" "}
                                            for {details.share}%
                                        </span>
                                    </p>

                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500">|</span>
                                        <span className="text-green-700">
                                            Amount Collected: ${" "}
                                            {details.amount_collected.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500">|</span>
                                        <span className="text-red-700">
                                            Amount Needed: ${" "}
                                            {(
                                                details.investment_needed -
                                                details.amount_collected
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="py-4 text-gray-800 text-[12px]">
                                    Only 25% of the bid amount is required
                                    upfront as a deposit.
                                </h3>
                                <div className="flex gap-4 mt-4">
                                    <div
                                        className="flex items-center gap-10"
                                        id="unlockButton"
                                    >
                                        {token && !conv ? (
                                            details.investment_needed ==
                                            details.amount_collected ? (
                                                <div className="w-full text-center p-4">
                                                    <p className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-md">
                                                        Business Is Fully
                                                        Invested In.
                                                    </p>
                                                </div>
                                            ) : isInvestor ? (
                                                <a
                                                    onClick={handleOpen}
                                                    className="bg-green hover:bg-green-600 text-white px-6 md:px-8 py-2 md:py-3 flex items-center rounded-lg whitespace-nowrap cursor-pointer"
                                                >
                                                    <FaLock className="mr-2" />
                                                    Unlock To Invest
                                                </a>
                                            ) : (
                                                <a
                                                    onClick={
                                                        handleOpenReportModal2
                                                    }
                                                    className="bg-green hover:bg-green-600 text-white px-6 md:px-8 py-2 md:py-3 flex items-center rounded-lg whitespace-nowrap cursor-pointer"
                                                >
                                                    <FaLock className="mr-2" />
                                                    Create Investor Account
                                                </a>
                                            )
                                        ) : token && conv ? (
                                            <p className="text-dark bg-gray-100 mt-3 text-gray-700 px-5 rounded-lg shadow-md py-2 md:py-3">
                                                Business Is Unlocked
                                            </p>
                                        ) : (
                                            <>
                                                {details.investment_needed ===
                                                details.amount_collected ? (
                                                    <div className="w-full text-center p-4">
                                                        <p className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-md">
                                                            Business Is Fully
                                                            Invested In.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <a
                                                        onClick={
                                                            handleUnlockClick
                                                        }
                                                        className="bg-black hover:bg-gray-700 text-white px-6 md:px-8 py-2 md:py-3 flex items-center rounded-lg whitespace-nowrap cursor-pointer"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faLock}
                                                            className="mr-2 text-sm"
                                                        />
                                                        Unlock To Invest
                                                    </a>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {token && !conv && amount_r && (
                                        <div>
                                            <p className="flex gap-2 whitespace-nowrap items-center py-2 px-1 mr-8 text-[#1E293B] text-[14px] md:text-[16px]">
                                                Unlock this business to learn{" "}
                                                <br />
                                                more about it and invest
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="my-4 text-left">
                                    {allowToReview && conv && (
                                        <button
                                            className="flex items-center space-x-2 py-2 rounded"
                                            onClick={togglePopup}
                                        >
                                            <FaPlusCircle className="text-green" />
                                            <span>Add Review</span>
                                            <p className="bg-green-600 text-white p-3 rounded">
                                                Business is completed
                                            </p>
                                        </button>
                                    )}

                                    {showPopup && (
                                        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                            <div className="bg-white p-6 rounded shadow-md w-1/3">
                                                <h4 className="text-lg font-bold mb-4">
                                                    Add Your Review
                                                </h4>
                                                <form onSubmit={reviewSubmit}>
                                                    <div className="flex items-center mb-4">
                                                        {[1, 2, 3, 4, 5].map(
                                                            (star) => (
                                                                <FaStar
                                                                    key={star}
                                                                    className={`cursor-pointer ${
                                                                        star <=
                                                                        rating
                                                                            ? "text-yellow-500"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                    onClick={() =>
                                                                        handleRating(
                                                                            star
                                                                        )
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                    <textarea
                                                        className="w-full border border-gray-300 rounded p-2 mb-4"
                                                        placeholder="Write your review here..."
                                                        value={review}
                                                        onChange={(e) =>
                                                            setReview(
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <div className="flex justify-end space-x-4">
                                                        <button
                                                            type="button"
                                                            className="bg-gray-300 px-4 py-2 rounded"
                                                            onClick={
                                                                togglePopup
                                                            }
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
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Section (Image) */}
                    <div className="md:w-1/2  flex justify-end">
                        <div className="sticky top-0 mr-4 lg:mr-6 ">
                            {/* Image */}
                            <div>
                                {!details?.image ? (
                                    <div className="flex items-center justify-center w-full h-[360px] bg-gray-300 rounded-[24px] md:w-[540px] dark:bg-gray-700 animate-pulse">
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
                                        className="object-cover rounded-[20px]"
                                        id="listingimage"
                                        style={{
                                            // maxHeight: "480px",
                                            height: "340px",
                                            width: "590px",
                                        }}
                                        src={details.image}
                                        alt="Business"
                                    />
                                )}
                            </div>

                            {/* Details below the image */}
                            <div className="w-full md:w-auto py-3 flex flex-col text-right mt-4">
                                {/* <div className="text-black font-bold mb-2">
                                    Amount Requested:{" "}
                                    <span className="font-semibold text-green-700">
                                        ${amount_r}
                                    </span>
                                </div> */}

                                <div className="flex flex-col items-end">
                                    {/* Rating Stars and Count */}
                                    {!details ? (
                                        <div className="flex items-center justify-end gap-2 text-right">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-6 h-6 bg-gray-300 rounded-full animate-pulse ml-1"
                                                    ></div>
                                                ))}
                                            </div>
                                            <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-end gap-2 text-right mb-1">
                                            <span className="text-yellow-400">
                                                {renderStars(details.rating)}
                                            </span>
                                            <span>({details.rating})</span>
                                        </div>
                                    )}

                                    {/* Rating Count */}
                                    {!details ? (
                                        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                                    ) : (
                                        <div className="text-gray-500 text-sm">
                                            {details.rating_count} Ratings
                                        </div>
                                    )}

                                     {/* Three-Dot Menu for Report Option */}
                                    {token ? (
                                        <div
                                            className="relative mt-2"
                                            ref={menuRef}
                                        >
                                            <button
                                                className="text-gray-500 hover:text-gray-700 p-2"
                                                onClick={() =>
                                                    setShowMenu(!showMenu)
                                                }
                                            >
                                                <FiMoreHorizontal size={24} />
                                            </button>

                                            {showMenu && (
                                                <div className="absolute right-0  bg-white border border-gray-200 rounded-lg shadow-md w-40">
                                                    <button
                                                        className="flex items-center gap-2 px-4 py-2 w-full text-left text-green hover:bg-gray-100"
                                                        onClick={() => {
                                                            setShowMenu(false);
                                                            handleOpenReportModal();
                                                        }}
                                                    >
                                                        <FiFlag size={18} />
                                                        Report
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>

                            {/* <div className="absolute bottom-0 left-0 w-full bg-gray-800 rounded- bg-opacity-60 rounded-b-lg text-white text-center py-2">
                                <p className="flex items-center justify-center">
                                    <FontAwesomeIcon
                                        icon={faMapMarkerAlt}
                                        className="mr-2"
                                    />
                                    {details.location}
                                </p>
                            </div> */}

                            {/* <div className={`${conv && token ? "hidden" : "card mx-auto my-4 max-w-md p-6 rounded-lg shadow-lg bg-white"}`}>
              <h4 className="text-2xl font-semibold border-b-2 border-gray-200 pb-4 mb-4">
                Business Home Windows
              </h4>

              {!token ? (
                <div className="flex flex-col items-center">
                  <button
                    // onClick={() => make_session(form.listing_id)}
                    data-target="#loginModal"
                    data-toggle="modal"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                  >
                    Unlock To Invest
                  </button>
                  <p className="mt-4 text-gray-600 text-center">
                    Unlock this business to learn more about it and invest
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {plan === 'platinum' || plan === 'gold' ? (
                    <button
                      
                      className="bg-green text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    >
                      Unlock To Invest
                    </button>
                  ) : (
                    <button
                      data-target="#investModal"
                      data-toggle="modal"
                      className="bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-700 transition duration-300"
                    >
                      Unlock To Invest
                    </button>
                  )}
                  <p className="mt-4 text-gray-600 text-center">
                    Unlock this business to learn more about it and invest
                  </p>
                </div>
              )}
            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            {/*Small_fee POPUP*/}
            {!conv && isInvestor && (
                <div
                    className={`fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 ${
                        !isVisible ||
                        details.investment_needed === details.amount_collected
                            ? "hidden"
                            : ""
                    }`}
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                        {/* Conditionally render content */}
                        {!details && (
                            <div class="animate-pulse space-y-6">
                                {/* Top Buttons */}
                                <div class="flex gap-6 justify-center">
                                    <div class="h-10 bg-gray-300 rounded-md w-36"></div>
                                    <div class="h-10 bg-gray-300 rounded-md w-36 border-2"></div>
                                </div>

                                {/* Text Placeholders */}
                                <div class="space-y-4 px-8 text-center">
                                    <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                                    <div class="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
                                </div>

                                {/* Bottom Buttons */}
                                <div class="flex gap-8 justify-center">
                                    <div class="h-10 bg-gray-300 rounded-md w-24"></div>
                                    <div class="h-10 bg-gray-300 rounded-md w-24"></div>
                                </div>
                            </div>
                        )}
                        {details && (
                            <>
                                {!conv && (
                                    <div className="flex gap-6 justify-center">
                                        <button
                                            onClick={handleUnlockFee}
                                            className="btn-primary rounded-md py-2 px-6 text-lg font-semibold mb-4"
                                        >
                                            Unlock Fee
                                        </button>
                                        <button
                                            onClick={handleSubscribe}
                                            className="text-lg border hover:border-green hover:text-green rounded-md border-black  py-2 px-6 font-semibold mb-4"
                                        >
                                            {subscribeData.subscribed
                                                ? "Subscription"
                                                : "Subscribe"}
                                        </button>
                                    </div>
                                )}

                                {!conv && !showSubs && (
                                    <>
                                        <p className="text-gray-700 mb-6">
                                            This business requests a small
                                            unlock fee of{" "}
                                            <b>${details.investors_fee}</b> to
                                            view their full business
                                            information.
                                        </p>
                                        <p className="text-gray-700 mb-6">
                                            Do you want to pay now?
                                        </p>
                                        <div className="flex justify-center space-x-4">
                                            <button
                                                onClick={() => {
                                                    stripeSmallFee(
                                                        form.listing_id,
                                                        details.investors_fee
                                                    );
                                                    handleClose();
                                                }}
                                                className="btn-primary text-white py-2 px-6 rounded  transition"
                                            >
                                                Ok
                                            </button>
                                            <button
                                                onClick={handleClose}
                                                className="bg-green text-white py-2 px-4 rounded btn-primary transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                )}

                                {showSubs && (
                                    <div>
                                        {subscribeData.token_left > 0 &&
                                            subscribeData.plan !=
                                                "platinum" && (
                                                <p className="text-warning mb-3 text-center">
                                                    Your{" "}
                                                    <span>
                                                        {subscribeData.plan}{" "}
                                                    </span>
                                                    {subscribeData.plan ==
                                                        "silver-trial" && (
                                                        <b>
                                                            {" "}
                                                            ($9.99/mo after
                                                            trial ends){" "}
                                                        </b>
                                                    )}
                                                    {subscribeData.plan ==
                                                        "gold-trial" && (
                                                        <b>
                                                            {" "}
                                                            ($29.99/mo after
                                                            trial ends){" "}
                                                        </b>
                                                    )}
                                                    {subscribeData.plan ==
                                                        "platinum-trial" && (
                                                        <b>
                                                            {" "}
                                                            ($69.99/mo after
                                                            trial ends){" "}
                                                        </b>
                                                    )}
                                                    expires in{" "}
                                                    <b>
                                                        {subscribeData.expire}
                                                    </b>{" "}
                                                    days.
                                                    <span className="text-dark small d-block">
                                                        {" "}
                                                        Are you sure you want to{" "}
                                                        <br></br> use one of
                                                        your{" "}
                                                        {
                                                            subscribeData.tokenLeft
                                                        }{" "}
                                                        business information
                                                        tokens?
                                                    </span>
                                                </p>
                                            )}

                                        {subscribeData.token_left <= 0 ? (
                                            <p className="text-dark mb-3 text-center">
                                                Please use <b>'Small fee'</b>{" "}
                                                option to unlock
                                                <br></br>({" "}
                                                {subscribeData.token_left} token
                                                left)
                                            </p>
                                        ) : (
                                            <div className="flex flex-wrap gap-4 justify-center">
                                                {[
                                                    "silver",
                                                    "silver-trial",
                                                    "gold",
                                                    "gold-trial",
                                                    "platinum",
                                                    "platinum-trial",
                                                ].includes(
                                                    subscribeData.plan
                                                ) && (
                                                    <button
                                                        onClick={() =>
                                                            unlockBySubs(
                                                                form.listing_id,
                                                                subscribeData.sub_id,
                                                                "token"
                                                            )
                                                        }
                                                        className="btn-primary text-white py-2 px-6 rounded hover:bg-blue-600 transition"
                                                    >
                                                        Use token{" "}
                                                        <small>
                                                            (
                                                            {
                                                                subscribeData.token_left
                                                            }{" "}
                                                            left)
                                                        </small>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleClose}
                                                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        )}

                                        {/*<p className="text-danger text-center">The business is not in your range!</p>*/}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
            {/*Small_fee POPUP*/}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <CreateInvestorAccount
                isInvestor = {isInvestor}
                isOpen={isInvestorModalOpen}
                onClose={() => setIsInvestorModalOpen(false)}
            />

            <Popup isOpen={isPopupOpen} onClose={closePopup} />
            <UnlockPopup
                isOpen={isUnlockPopupOpen}
                onClose={closeUnlockPopup}
            />
            <div className="">
                <hr className="border-t border-gray-300"></hr>
                <div className=" sm:p-6  ">
                    <div className="mx-auto pr-4 md:pl-0">
                        {/* On mobile, ReviewSummary takes up full width, on larger screens it takes 1/3 */}
                        <div className="sm:col-span-8 flex flex-col md:flex-row justify-around items-stretch gap-4 p-4">
                            {/* Financial Statements Section */}
                            {token && conv && mile && amount_r ? (
                                <div className="w-full md:w-1/3  flex flex-col gap-4 border rounded-lg shadow-sm bg-white px-4 py-[50px]">
                                    <button
                                        className="border border-gray-300 mt-5 bg-white hover:bg-gray-50 transition-all duration-200 px-6 py-3 rounded-lg w-full text-gray-800 text-base lg:text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        onClick={download_statement}
                                    >
                                        Download Financial Statements
                                    </button>
                                    <button
                                        onClick={download_business}
                                        className="border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 px-6 py-3 rounded-lg w-full text-gray-800 text-base lg:text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        Download Business Documents
                                    </button>
                                    <button className="border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 px-6 py-3 rounded-lg w-full text-gray-800 text-base lg:text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                        <Link
                                            to={`/business-milestones/${btoa(
                                                btoa(details.id)
                                            )}`}
                                            key={details.id}
                                            className="block w-full text-center"
                                        >
                                            View Business Milestones
                                        </Link>
                                    </button>
                                </div>
                            ) : null}

                            {token &&
                            conv &&
                            amount_r &&
                            running &&
                            isInvestor ? (
                                <>
                                    <div className="w-full md:w-1/3 bg-white border border-gray-300 rounded-lg p-6 flex flex-col justify-between">
                                        <h2 className="text-xl font-semibold text-[#334155] mb-4">
                                            Enter A Bid To Invest
                                        </h2>
                                        <h3 className="text-[11px] pb-3 text-gray-800">
                                            {" "}
                                            Only 25% of the bid amount is
                                            required upfront as a deposit.
                                            However, please enter the full 100%
                                            of the intended investment amount
                                            below.
                                        </h3>

                                        {/* <p className="text-sm text-[#334155] mb-4">
                                            By investing, you're contributing to
                                            a valuable opportunity that supports
                                            growth and progress. Your bid helps
                                            fund projects and initiatives with
                                            promising returns, benefiting both
                                            you and the broader community.
                                        </p> */}
                                        <label
                                            htmlFor="investmentAmount"
                                            className="text-sm text-[#334155] font-medium mb-2 block"
                                        >
                                            Amount:
                                        </label>
                                        <input
                                            type="text"
                                            id="investmentAmount"
                                            value={formattedAmount}
                                            onChange={handleAmountChange}
                                            className="border border-gray-300 rounded-lg p-3 mb-4 w-full"
                                            placeholder="$"
                                        />
                                        {/* {amount && (
                                            <p className="text-sm text-[#334155] mb-4">
                                                Represents:{" "}
                                                <span
                                                    id="percent"
                                                    className="font-bold"
                                                >
                                                    {percentage}
                                                </span>
                                                %
                                            </p>
                                        )} */}
                                        <p className="text-sm text-[#334155] mb-4">
                                            Represents:{" "}
                                            <span
                                                id="percent"
                                                className="font-bold"
                                            >
                                                {percentage || 0}
                                            </span>
                                            %
                                        </p>

                                        <button
                                            onClick={handleInvestClick}
                                            className="bg-green-700 hover:bg-green-800 text-white transition-all duration-200 px-4 py-3 rounded-lg w-full"
                                        >
                                            Invest Now
                                        </button>
                                        {errorMessage && (
                                            <p className="text-red-600 mt-4">
                                                {errorMessage}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/3 bg-white border border-gray-300 rounded-lg p-6 flex flex-col justify-between">
                                        <h2 className="text-xl font-semibold   text-[#334155] mb-6">
                                            Enter Equipment Equivalent Bid
                                        </h2>
                                        {/* <p className="text-sm text-[#334155] mb-4">
                                            Investing in equipment ensures that
                                            your business stays competitive and
                                            operates efficiently. The right
                                            equipment can increase productivity
                                            and reduce operational costs over
                                            time.
                                        </p> */}
                                        <label
                                            htmlFor="equipmentAmount"
                                            className="text-sm text-[#334155] font-medium mb-2 block"
                                        >
                                            Amount:
                                        </label>
                                        <input
                                            type="text"
                                            id="equipmentAmount"
                                            value={equipmentAmount}
                                            onChange={
                                                handleEquipmentAmountChange
                                            }
                                            className="border border-gray-300 rounded-lg p-3 mb-4 w-full"
                                            placeholder="$"
                                        />
                                        {/* {equipmentAmount && (
                                            <p className="text-sm text-[#334155] mb-4">
                                                Represents:{" "}
                                                <span className="font-bold">
                                                    {equipmentPercentage}
                                                </span>
                                                %
                                            </p>
                                        )} */}
                                        <p className="text-sm text-[#334155] mb-4">
                                            Represents:{" "}
                                            <span className="font-bold">
                                                {equipmentPercentage || 0}
                                            </span>
                                            %
                                        </p>

                                        <button
                                            onClick={handleEquipmentInvest}
                                            className="bg-green-700 hover:bg-green-800 text-white transition-all duration-200 px-4 py-3 rounded-lg w-full"
                                        >
                                            Invest With Equipment
                                        </button>
                                        {equipmentErrorMessage && (
                                            <p className="text-red-600 mt-4">
                                                {equipmentErrorMessage}
                                            </p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full flex justify-center items-center">
                                    <div>
                                        {conv && !mile ? (
                                            <div className="w-full text-center p-4">
                                                <p className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-md">
                                                    No Milestone is set for this
                                                    business yet.
                                                </p>
                                            </div>
                                        ) : conv && !amount_r ? (
                                            <div className="w-full text-center p-4">
                                                <p className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-md">
                                                    Business Is Fully Invested
                                                    In.
                                                </p>
                                            </div>
                                        ) : conv && !running ? (
                                            <div className="w-full text-center p-4">
                                                <p className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-md">
                                                    Milestone payout is
                                                    currently off due to the
                                                    milestone completion
                                                    process. Please wait until
                                                    the next milestone is open.
                                                </p>
                                            </div>
                                        ) : !isInvestor ? (
                                            <div className="w-full text-center p-4">
                                                <p className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-md">
                                                    You Need To Create Investor
                                                    Account To Invest.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="w-full text-center p-4">
                                                {!token && (
                                                    <p className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-md">
                                                        Please login to bid on
                                                        this project.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                // <div className="w-full mx-auto text-center p-4">
                                //     <p className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-md">
                                //         Milestone payout is currently off due to
                                //         milestone completion process. Please
                                //         wait until the next milestone is open.
                                //     </p>
                                // </div>
                            )}
                        </div>

                        {/* ReviewList */}

                        {/* <div className="mt-6">
    {token && conv && amount_r && running ? (
        <div>
            <div className="w-full flex flex-col items-center mt-4">
                <h2 className="text-lg font-semibold mb-4">
                    Enter A Bid To Invest
                </h2>
                <label
                    htmlFor="investmentAmount"
                    className="text-sm font-medium"
                >
                    Amount:
                </label>
                <input
                    type="number"
                    id="investmentAmount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
                    placeholder="$"
                />
                {amount && (
                    <div className="text-sm">
                        <p>
                            Bid Percentage:{" "}
                            <span
                                id="percent"
                                className="font-bold"
                            >
                                {percentage}
                            </span>
                            %
                        </p>
                    </div>
                )}
                <button
                    onClick={handleInvestClick}
                    className="btn-primary text-white border bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-4 py-2 rounded-lg mt-4 w-full max-w-[300px]"
                >
                    Invest Now
                </button>
                {errorMessage && (
                    <p className="error-message text-red-600">
                        {errorMessage}
                    </p>
                )}
            </div>

            <div className="w-full flex flex-col items-center mt-4">
                <h2 className="text-lg font-semibold mb-4">
                    Enter Equipment Equivalent Bid To Invest
                </h2>
                <label
                    htmlFor="equipmentAmount"
                    className="text-sm font-medium"
                >
                    Amount:
                </label>
                <input
                    type="number"
                    id="equipmentAmount"
                    value={equipmentAmount}
                    onChange={handleEquipmentAmountChange}
                    className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
                    placeholder="$"
                />
                {equipmentAmount && (
                    <div className="text-sm">
                        <p>
                            Equipment Investment Percentage:{" "}
                            <span className="font-bold">
                                {equipmentPercentage}%
                            </span>
                        </p>
                    </div>
                )}

                <button
                    onClick={handleEquipmentInvest}
                    className="btn-primary text-white border bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-4 py-2 rounded-lg mt-4 w-full max-w-[300px]"
                >
                    Invest in Equipment
                </button>
                {equipmentErrorMessage && (
                    <p className="error-message text-red-600">
                        {equipmentErrorMessage}
                    </p>
                )}
            </div>
        </div>
    ) : (
        <div className="w-75 mx-auto row">
            <p className="bg-light text-gray-700 p-2 rounded">
                Milestone payout is currently off due to
                milestone completion process, please wait
                until next milestone is open.
            </p>
        </div>
    )}
    {allowToReview && conv && (
        <div className="w-75 mx-auto row">
            <h4 className="bg-green text-white p-3 rounded">
                Business is completed!
            </h4>
        </div>
    )}
</div> */}
                    </div>
                    <div className="mb-4">
                        <hr className="absolute left-0 w-full border-t border-gray-300 mt-6" />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 p-4">
                        {/* Review Summary - Left */}
                        <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3   ">
                            <div className="mt-4">
                                <ReviewSummary
                                    reviews={reviews}
                                    rating_count={details.rating}
                                />
                            </div>
                        </div>

                        {/* Reviews - Right */}
                        <div className="w-full lg:w-2/3">
                            <div className="sm:col-span-2 mt-4">
                                {currentReviews?.length === 0 ? (
                                    <p className="text-gray-600 text-2xl text-center h-40">
                                        No Reviews
                                    </p>
                                ) : (
                                    <div>
                                        {/* Review List */}
                                        <ReviewList reviews={currentReviews} />

                                        {/* Pagination and Items Per Page */}
                                        {currentReviews.length > 5 && (
                                            <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
                                                {/* Items Per Page Selector */}
                                                <div className="flex items-center">
                                                    <span className="mr-2 text-gray-600">
                                                        Show
                                                    </span>
                                                    <select
                                                        value={itemsPerPage}
                                                        onChange={
                                                            handleItemsPerPageChange
                                                        }
                                                        className="border bg-white border-gray-300 rounded-full px-4 py-1 text-gray-600 shadow-sm outline-none focus:ring-2 focus:ring-gray-300 transition ease-in-out duration-150"
                                                    >
                                                        <option value={5}>
                                                            5
                                                        </option>
                                                        <option value={6}>
                                                            6
                                                        </option>
                                                        <option value={7}>
                                                            7
                                                        </option>
                                                        <option value={8}>
                                                            8
                                                        </option>
                                                    </select>
                                                    <span className="ml-2 text-gray-600">
                                                        Cards per page
                                                    </span>
                                                </div>

                                                {/* Pagination Component */}
                                                <div className="mt-4 sm:mt-0">
                                                    <PaginationComponent
                                                        currentPage={
                                                            currentPage
                                                        }
                                                        totalPages={totalPages}
                                                        handlePreviousClick={
                                                            handlePreviousClick
                                                        }
                                                        handlePageClick={
                                                            handlePageClick
                                                        }
                                                        handleNextClick={
                                                            handleNextClick
                                                        }
                                                        getPageNumbers={
                                                            getPageNumbers
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ScrollToTop />

            {isModalOpen2 && token && (
                <ReportModal
                    listing_id={form.listing_id}
                    onClose={() => setIsModalOpen2(false)}
                />
            )}
        </>
    );
};

export default ListingDetails;
