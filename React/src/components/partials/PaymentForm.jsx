import { useState, useEffect } from "react";
import { decode as base64_decode } from "base-64";
import { useNavigate, Link } from "react-router-dom";
import { FaCreditCard, FaHome } from "react-icons/fa";
import axiosClient from "../../axiosClient";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackBtn from "./BackBtn";
import PaymentHero from "../Heros/PaymentHero";
import { useStateContext } from "../../contexts/contextProvider";
import { useLocation } from "react-router-dom";
import Mpesa from "../../images/randomIcons/mpesa.png";
import Modal from "../partials/Authmodal";
import { BarLoader } from "react-spinners";
import UsdToLocalCurrency from "./UsdToLocalCurrency";
import PaymentStatusModal from "./PaymentStatusModal";
//import { mask } from "../../js/jquery.maskedinput";
import InputMask from "react-input-mask";

const PaymentForm = () => {
    const location = useLocation();
    //const [searchParams] = useSearchParams();
    const [selectedPayment, setSelectedPayment] = useState("card");
    const [loading, setLoading] = useState(false); // Loader state
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { token } = useStateContext();

    // Function to show success toast
    const showSuccessToast = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    // Function to show error toast
    const showErrorToast = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const navigate = useNavigate();

    //Stripe CARD Method Code
    $(function () {
        var $form = $(".require-validation");
        $("form.require-validation").bind("submit", function (e) {
            var $form = $(".require-validation"),
                inputSelector = [
                    "input[type=email]",
                    "input[type=password]",
                    "input[type=text]",
                    "input[type=file]",
                    "textarea",
                ].join(", "),
                $inputs = $form.find(".required").find(inputSelector),
                $errorMessage = $form.find("div.error"),
                valid = true;
            $errorMessage.addClass("hide");
            $(".has-error").removeClass("has-error");
            $inputs.each(function (i, el) {
                var $input = $(el);
                if ($input.val() === "") {
                    $input.parent().addClass("has-error");
                    $errorMessage.removeClass("hide");
                    e.preventDefault();
                }
            });
            if (!$form.data("cc-on-file")) {
                e.preventDefault();
                Stripe.setPublishableKey($form.data("stripe-publishable-key"));
                Stripe.createToken(
                    {
                        number: $(".card-number").val(),
                        cvc: $(".card-cvc").val(),
                        exp_month: $(".card-expiry-month").val(),
                        exp_year: $(".card-expiry-year").val(),
                    },
                    stripeResponseHandler
                );
            }
        });
        function stripeResponseHandler(status, response) {
            if (response.error) {
                $(".error")
                    .removeClass("collapse")
                    .find(".alert")
                    .text(response.error.message);
                console.log(response.error.message);
            } else {
                /* token contains id, last4, and card type */
                var token = response["id"];
                $form.find("input[type=text]").empty();
                $form.append(
                    "<input type='hidden' id='stripeToken' name='stripeToken' value='" +
                        token +
                        "'/>"
                );
                //$form.get(0).submit();
            }
        }
    });
    //Stripe CARD Method Code

    // Function to get the cancellation date
    const getCancellationDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 7); // Add 7 days

        // Format the date as 'DD MMM YYYY'
        const day = today.getDate().toString().padStart(2, "0"); // Add leading zero for single digits
        const month = today.toLocaleString("default", { month: "short" }); // Get short month name
        const year = today.getFullYear();

        return `${day} ${month} ${year}`;
    };

    const cancellationDate = getCancellationDate();

    // Function to get the cancellation date

    // GETTING Parameters
    const { amount } = location.state || { amount: 0 };
    const { listing_id } = location.state || { listing_id: 0 };
    const { purpose } = location.state || { purpose: btoa(1) };
    const { percent } = location.state || { percent: btoa(1) };

    const purpos = base64_decode(purpose);
    var p = "";
    var amount_real = base64_decode(amount);
    var temp_price_total = 0;
    var temp_price = 0;

    if (purpos === "bids") {
        p = "Investment To Business (25%)";
        //amount_real = base64_decode(amount)*0.25;
        temp_price = amount_real * 0.25;
        temp_price_total =
            parseFloat(temp_price) + parseFloat(0.05 * temp_price); // Fixed price value
    } else if (purpos === "s_mile") {
        p = "Pay Service milestone";
    } else if (purpos === "awaiting_payment") {
        p = "Remaining Bid Payment";
    } else if (purpos === "grant_milestone") {
        p = "Grant Milestone Release";
    } else {
        p = "Small Fee To Unlock Business";
    }
    // GETTING Parameters

    const [showModal, setShowModal] = useState(false);
    const price = parseFloat(amount_real) + parseFloat(0.05 * amount_real); // Fixed price value

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const payload = {
                listing: atob(listing_id),
                percent: percent ? atob(percent) : 0,
                package: null,
                amount: price,
                amountOriginal: amount_real,
                partialAmount: temp_price_total,
                stripeToken: $("#stripeToken").val(),
                //stripeToken: event.target.stripeToken.value
            };

            console.log(payload);
            if (purpos === "small_fee") {
                axiosClient
                    .post("/stripe.post.coversation", payload)
                    .then(({ data }) => {
                        console.log(data);
                        if (data.status === 200) {
                            // Show success toast
                            showSuccessToast("Payment successful!");

                            // Wait for the toast to show before navigating
                            setTimeout(() => {
                                navigate("/listing/" + btoa(listing_id));
                            }, 2000); // 2-second delay before navigating
                        }
                        if (data.status === 400) {
                            showErrorToast(data.message);
                        }
                    })
                    .catch((err) => {
                        const response = err.response;
                        if (response && response.status === 422) {
                            console.log(response.data.errors);
                            showErrorToast(response.data.errors);
                        }
                    })
                    .finally(() => {
                        setLoading(false); // Stop loading spinner
                    });
            } else if (purpos == "bids") {
                axiosClient
                    .post("/bidCommits", payload)
                    .then(({ data }) => {
                        if (data.status == 200) {
                            $.confirm({
                                title: "Payment Successful",
                                content:
                                    "Go to Dashboard to see investment status.",
                                buttons: {
                                    yes: function () {
                                        navigate("/dashboard");
                                    },
                                    home: function () {
                                        navigate("/");
                                    },
                                    cancel: function () {
                                        $.alert("Canceled!");
                                    },
                                },
                            });
                        }
                        if (data.status == 400)
                            // alert(data.message);
                            showErrorToast(data.message);
                    })
                    .catch((err) => {
                        console.log(err);
                        setLoading(false);
                        const response = err.response;
                        showErrorToast(response.data.message);
                        if (response && response.status === 422) {
                            console.log(response.data.errors);
                            showErrorToast(response.data.errors);
                        }
                    })
                    .finally(() => {
                        setLoading(false); // Stop loading spinner
                    });
            } else if (purpos == "awaiting_payment") {
                const payloadAP = {
                    bid_id: atob(listing_id),
                    amount: price,
                    amountOriginal: amount_real,
                    stripeToken: $("#stripeToken").val(),
                };
                axiosClient
                    .post("/bidCommitsAwaiting", payloadAP)
                    .then(({ data }) => {
                        if (data.status == 200) {
                            $.confirm({
                                title: "Payment Successful",
                                content:
                                    "Go to Dashboard to see investment status.",
                                buttons: {
                                    yes: function () {
                                        navigate("/dashboard");
                                    },
                                    home: function () {
                                        navigate("/");
                                    },
                                    cancel: function () {
                                        $.alert("Canceled!");
                                    },
                                },
                            });
                        }
                        if (data.status == 400)
                            // alert(data.message);
                            showErrorToast(data.message);
                    })
                    .catch((err) => {
                        console.log(err);
                        setLoading(false);
                        const response = err.response;
                        showErrorToast(response.data.message);
                        if (response && response.status === 422) {
                            console.log(response.data.errors);
                            showErrorToast(response.data.errors);
                        }
                    })
                    .finally(() => {
                        setLoading(false); // Stop loading spinner
                    });
            } else if (purpos == "grant_milestone") {
                axiosClient
                    .post("grant/grant-milestone", payload)
                    .then(({ data }) => {
                        console.log(data);
                        if (data.status == 200) {
                            $.confirm({
                                title: "Payment Successful",
                                content:
                                    "Go to Dashboard to see investment status.",
                                buttons: {
                                    yes: function () {
                                        navigate("/grants-overview");
                                    },
                                    home: function () {
                                        navigate("/");
                                    },
                                    cancel: function () {
                                        $.alert("Canceled!");
                                    },
                                },
                            });
                        }
                        if (data.status == 400)
                            // alert(data.message);
                            showErrorToast(data.message);
                    })
                    .catch((err) => {
                        console.log(err);
                        setLoading(false);
                        const response = err.response;
                        showErrorToast(response.data.message);
                        if (response && response.status === 422) {
                            console.log(response.data.errors);
                            showErrorToast(response.data.errors);
                        }
                    })
                    .finally(() => {
                        setLoading(false); // Stop loading spinner
                    });
            } else {
                const payloadS = {
                    milestone_id: atob(listing_id),
                    amount: price,
                    amountOriginal: amount_real,
                    stripeToken: $("#stripeToken").val(),
                };
                axiosClient
                    .post("/milestoneService", payloadS)
                    .then(({ data }) => {
                        if (data.status == 200) {
                            $.confirm({
                                title: "Payment Successful",
                                content: "Go to Milestone page to see status.",
                                buttons: {
                                    yes: function () {
                                        navigate(
                                            "/service-milestones/" +
                                                data.service_id
                                        );
                                    },
                                    home: function () {
                                        navigate("/");
                                    },
                                    cancel: function () {
                                        $.alert("Canceled!");
                                    },
                                },
                            });
                        }
                        if (data.status == 400) {
                            //alert(data.message);
                            console.log(data);
                        }
                        console.log(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        const response = err.response;
                        showErrorToast(response.data.message);
                        if (response && response.status === 422) {
                            console.log(response.data.errors);
                        }
                    })
                    .finally(() => {
                        setLoading(false); // Stop loading spinner
                    });
            }

            //timeout
        }, 2000);
        //timeout
    };

    //S T R I P E  E N D S

    //O T H E R P A Y M E N T S
    // let partiesInfo;
    // const [user, setUser] = useState({});
    // const [owner, setOwner] = useState({});
    // if (purpos == "s_mile") partiesInfo = "/partiesServiceMile/";
    // else partiesInfo = "/partiesInfo/";
    // useEffect(() => {
    //     // $(".card-number").mask("9999 9999 9999 9999");
    //     axiosClient.get(partiesInfo + atob(listing_id)).then(({ data }) => {
    //         setUser(data.user);
    //         setOwner(data.owner);
    //         //console.log(data);
    //     });
    // }, []);

    //M P E S A
    const [status, setStatus] = useState("pending");
    const [mpesaloading, mpesasetLoading] = useState(false);
    const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState("");
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const [showMpesaModal, setShowMpesaModal] = useState(false);

    const LiprInit = () => {
        if (
            !mpesaPhoneNumber.startsWith("254") ||
            mpesaPhoneNumber.length !== 12
        ) {
            showErrorToast(
                "Please enter a valid Kenyan phone number starting with 254"
            );
            return;
        }
        setPaymentStatus("processing");
        mpesasetLoading(true);

        mpesasetLoading(true);
        const usdToKen = 128.5;
        const business_id = atob(listing_id);
        percent: percent ? atob(percent) : 0;
        const amountKES = purpos == 'bids'
            ?Math.round(parseFloat(temp_price_total) * usdToKen)
            :Math.round(parseFloat(price) * usdToKen);
        const amountToSend = amount_real + "_" + 10;
       // console.log(amountToSend);

        let status_url = ''; let redirect_url = ''; let content = '';
        if (purpos == "bids") {
            status_url = `/lipr-status-bids/${business_id}/${amountToSend}/${percent}`;
            redirect_url = 'dashboard/';
            content = "Go to Dashboard to see bid status.";
        }
        else if (purpos === "s_mile") {
            status_url = `/lipr-status-service/${business_id}/${amountToSend}`;
            //redirect_url = '/service-milestones/'+btoa(listing_id);
            content = "Go to Milestone page to see status.";
        }
        else if (purpos === "awaiting_payment") {
            status_url = `/lipr-status-bidsAwaiting/${business_id}/${amountToSend}`;
            redirect_url = '/dashboard';
            content = "Go to Dashboard to see bid status.";
        }
        else if (purpos === "grant_milestone") {
            status_url = `/lipr-status-grant/${business_id}/${amountToSend}/${percent}`;
            redirect_url = 'grants-overview/';
            content = "Go to Grants Dashboard to see bid status.";
        }
        else if (purpos === "capital_milestone") {
            status_url = `/lipr-status-capital/${business_id}/${amountToSend}/${percent}`;
            redirect_url = 'capital-overview/';
            content = "Go to Capital Dashboard to see bid status.";
        }
        else {
            status_url = `/lipr-status-smallFee/${business_id}/${amountToSend}`;
            redirect_url = '/listing/' + btoa(listing_id);
            content = "Go to the Listing page.";
        }

        const payload = {
            amount: amountKES,
            acc_number: mpesaPhoneNumber,
            purpose: p
        };

        setTimeout(() => {
            axiosClient
                .post("/initiate_payment", payload)
                .then(({ data }) => {
                    console.log(data);
                    if (data.status == 200) {
                        const referenceId = data.data.data.transaction.id;
                        setTransactionId(referenceId);

                        // Show processing modal
                        setPaymentStatus("processing");

                        // Start polling for payment status
                        const interval = setInterval(() => {
                            axiosClient
                                .get(
                                    status_url+`/${referenceId}`
                                )
                                .then((res) => {
                                    const result = res.data.status;
                                    setStatus(result);
                                    console.log(res);
                                    if(purpos == 's_mile')
                                        redirect_url = '/service-milestones/'+res.data.service_id;

                                    if (result === "processed") {
                                        clearInterval(interval);
                                        setPaymentStatus("success");
                                        //setPaymentStatus(result === "processed"?"success":"failed");
                                        mpesasetLoading(false);

                                        $.confirm({
                                            title: "Payment Successful",
                                            content: content,
                                            buttons: {
                                                yes: function () {
                                                    navigate(redirect_url);
                                                },
                                                cancel: function () {
                                                    $.alert("Canceled!");
                                                },
                                            },
                                        });

                                    } else if (
                                        result === "failed" ||
                                        result === 404 ||
                                        res.data.error ===
                                            "Payment not found"
                                    ) {
                                        clearInterval(interval);
                                        setPaymentStatus("failed");
                                        mpesasetLoading(false);
                                    }
                                })
                                .catch((err) => {
                                    console.error(err);
                                    clearInterval(interval);
                                    setPaymentStatus("failed");
                                    mpesasetLoading(false);
                                    showErrorToast(
                                        "Error checking payment status"
                                    );
                                });
                        }, 60000);
                        // every 60 sec because mpesa gives you 60 sec to pay if not it fails  so let me put 60 second
                    } else {
                        setPaymentStatus("failed");
                        mpesasetLoading(false);
                        showErrorToast(
                            data.message || "Payment initiation failed"
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setPaymentStatus("failed");
                    mpesasetLoading(false);
                    showErrorToast("Payment processing error");
                });

        }, 500);
    };
    //M P E S A  ENDS

    // if (result === "processed") {
    //     clearInterval(interval);
    //     setPaymentStatus("success");
    //     mpesasetLoading(false);
    //     setTimeout(
    //         () => navigate("/dashboard"),
    //         3000
    //     );
    // } else if (
    //     result === "failed" ||
    //     result === 404 ||
    //     res.data.error ===
    //         "Payment not found"
    // ) {
    //     clearInterval(interval);
    //     setPaymentStatus("failed");
    //     mpesasetLoading(false);
    // }

    //OTHER PAYMENTS

    const popupClose = () => {
        setShowModal(false);
    };

    return (
        <>
            <PaymentHero />
            <BackBtn />

            <div className="flex pt-[40px] px-2  text-[#334155] flex-col items-center justify-center">
                <h1 className="text-5xl font-bold">Checkout</h1>
                <p className="jakarta text-center text-[14px]">
                    A secure and easy checkout experience. Pay with your
                    Credit/Debit <br></br> cards or via stripe
                </p>
            </div>
            <ToastContainer />
            {!token ? (
                <div className="py-8  flex justify-center mx-6 my-8 space-x-8">
                    {/* Your content for authenticated users */}
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="px-6 py-2 bg-green text-slate-100 rounded-lg"
                    >
                        Login To Pay
                    </button>
                </div>
            ) : (
                <div className=" py-8  mx-6 my-8  space-x-8">
                    {showModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75"
                            id="exampleModal"
                        >
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <h2 className="my-4 text-center text-xl font-bold">
                                            Failed
                                        </h2>
                                        <p className="text-center text-red-600">
                                            Stripe failed message here.
                                        </p>
                                    </div>
                                    <div className="modal-footer flex justify-center">
                                        <button
                                            onClick={popupClose}
                                            type="button"
                                            className="w-1/2 py-2 my-3 text-lg font-semibold text-white bg-red-600"
                                        >
                                            Ok
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Card Section left */}
                    <div className="">
                        {/* <a
                        href="/"
                        className="text-black hover:text-green flex items-center"
                    >
                        <FaHome className="ml-1" /> Home
                    </a> */}
                        {/*
                    <div className="card-body mt-4">
                        <div className="pb-3 pt-2 text-center">
                            <h6 className="text-xl font-bold text-green-800">
                                A Secure and Easy Checkout Experience
                            </h6>
                            <h5 className="text-lg font-bold">
                                Pay with your Credit/Debit Card via Stripe
                            </h5>
                        </div> */}

                        {/*  action="{{ route('stripe.post.coversation') }}"*/}
                        <form
                            role="form"
                            onSubmit={
                                selectedPayment === "card"
                                    ? handleSubmit
                                    : selectedPayment === "bank"
                                    ? bankSubmit
                                    : paypalSubmit
                            }
                            method="post"
                            class="class2  require-validation m-auto"
                            data-cc-on-file="false"
                            data-stripe-publishable-key="pk_test_51JFWrpJkjwNxIm6zf1BN9frgMmLdlGWlSjkcdVpgVueYK5fosCf1fAKlMpGrkfGoiXGMb0PpcMEOdINTEVcJoCNa00tJop21w6"
                            id="payment-form"
                        >
                            <div className="grid lg:grid-cols-2 grid-cols-1 md:grid-cols-1 gap-0">
                                <div className="pb-[40px] sm:mx-[50px] bg-white flex flex-col">
                                    <h2 className="text-2xl text-[#0F172A] font-bold">
                                        Payment
                                    </h2>

                                    <div class="row error mx-1 text-center collapse">
                                        <p
                                            style={{
                                                color: "#e31313",
                                                background: "#cfcfcf82",
                                                fontWeight: "600",
                                            }}
                                            class="alert my-2 py-1 w-100"
                                        ></p>
                                    </div>

                                    <hr className="my-4" />
                                    <div className="bg-white rounded">
                                        <label
                                            className="text-[#0F172A] text-sm font-bold pt-3"
                                            htmlFor=""
                                        >
                                            Pay With
                                        </label>

                                        <div className="flex jakarta space-x-4">
                                            {["card", "paypal"].map(
                                                (method) => (
                                                    <label
                                                        key={method}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <div
                                                            className={`relative flex items-center justify-center h-5 w-5 border rounded-full ${
                                                                selectedPayment ===
                                                                method
                                                                    ? "border-green-500 bg-white border-2"
                                                                    : "border-gray-300"
                                                            }`}
                                                            onClick={() =>
                                                                setSelectedPayment(
                                                                    method
                                                                )
                                                            }
                                                        >
                                                            {selectedPayment ===
                                                                method && (
                                                                <div className="h-2 w-2 bg-green-500 rounded-full" />
                                                            )}
                                                        </div>
                                                        <span
                                                            className={`ml-2 text-[13px] ${
                                                                selectedPayment ===
                                                                method
                                                                    ? "text-black"
                                                                    : "text-[#ACACAC]"
                                                            }`}
                                                        >
                                                            {method
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                method.slice(1)}
                                                        </span>
                                                    </label>
                                                )
                                            )}{" "}
                                            &nbsp;&nbsp;{" "}
                                            <span className="mt-3">
                                                or Pay With &nbsp;{" "}
                                            </span>
                                            {/* <a
                                                onClick={
                                                    !mpesaloading
                                                        ? LiprInit
                                                        : null
                                                }
                                                className={`flex items-center mt-3 gap-2 px-4 py-2 rounded-lg font-semibold shadow-md transition-colors ${
                                                    mpesaloading
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-lime-700 hover:bg-lime-500 cursor-pointer"
                                                } text-white`}
                                            >
                                                <img
                                                    src={Mpesa}
                                                    alt="Mpesa"
                                                    className="w-6 h-6 rounded object-contain"
                                                />
                                                <span className="text-sm">
                                                    {mpesaloading
                                                        ? "Processing..."
                                                        : "Lipr"}
                                                </span>
                                                {mpesaloading && (
                                                    <svg
                                                        className="animate-spin h-4 w-4 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
                                                        />
                                                    </svg>
                                                )}
                                            </a> */}
                                            <a
                                                onClick={() => {
                                                    if (!mpesaloading) {
                                                        setShowMpesaModal(true);
                                                    }
                                                }}
                                                className={`flex items-center mt-3 gap-2 px-4 py-2 rounded-lg font-semibold shadow-md transition-colors ${
                                                    mpesaloading
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-lime-700 hover:bg-lime-500 cursor-pointer"
                                                } text-white`}
                                            >
                                                <img
                                                    src={Mpesa}
                                                    alt="Mpesa"
                                                    className="w-6 h-6 rounded object-contain"
                                                />
                                                <span className="text-sm">
                                                    {mpesaloading
                                                        ? "Processing..."
                                                        : "Lipr Na Mpesa"}
                                                </span>
                                                {mpesaloading && (
                                                    <svg
                                                        className="animate-spin h-4 w-4 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
                                                        />
                                                    </svg>
                                                )}
                                            </a>
                                        </div>

                                        {/* Conditional Rendering for Card Payment */}
                                        {selectedPayment === "card" && (
                                            <div className="space-y-4">
                                                <div className="py-4">
                                                    <label className="block text-sm font-semibold mb-2">
                                                        Card Number
                                                    </label>
                                                    <div className="flex items-center w-full max-w-[480px] border rounded-lg border-[#ACACAC] overflow-hidden">
                                                        <InputMask
                                                            mask="9999 9999 9999 9999"
                                                            maskChar=""
                                                            name="cc-number"
                                                            autoComplete="cc-number"
                                                            inputMode="numeric"
                                                            size="20"
                                                            className="card-number flex-1 py-2 px-6 border-0 outline-none"
                                                            type="text"
                                                            placeholder="1234 5678 9012 3456"
                                                            aria-label="Credit card number"
                                                            pattern="\d{4} \d{4} \d{4} \d{4}"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex gap-[10px] w-full max-w-[480px]">
                                                    <div className="w-full">
                                                        <label className="block text-sm font-semibold mb-2">
                                                            Exp. Month
                                                        </label>
                                                        <input
                                                            className="card-expiry-month w-full p-2 border border-gray-300 rounded"
                                                            type="text"
                                                            placeholder="MM"
                                                            size="2"
                                                        />
                                                    </div>

                                                    <div className="w-full">
                                                        <label className="block text-sm font-semibold mb-2">
                                                            Exp. Year
                                                        </label>
                                                        <input
                                                            className="card-expiry-year w-full p-2 border border-gray-300 rounded"
                                                            type="text"
                                                            placeholder="YYYY"
                                                            size="4"
                                                        />
                                                    </div>

                                                    <div className="w-full">
                                                        <label className="block text-sm font-semibold mb-2">
                                                            CVC
                                                        </label>
                                                        <input
                                                            autoComplete="off"
                                                            placeholder="ex. 311"
                                                            size="4"
                                                            className="card-cvc w-full p-2 border border-gray-300 rounded"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Conditional Rendering for Bank Payment */}
                                        {selectedPayment === "bank" && (
                                            <div className="space-y-4">
                                                <div className="py-4">
                                                    <label className="block text-sm font-semibold mb-2">
                                                        Bank Name
                                                    </label>
                                                    <div className="flex items-center w-full max-w-[480px] border rounded-lg border-[#ACACAC] overflow-hidden">
                                                        <input
                                                            id="bank_name"
                                                            autocomplete="on"
                                                            size="20"
                                                            className="bank-name flex-1 py-2 px-6 border-0 outline-none"
                                                            type="text"
                                                            placeholder="Enter Your Bank Name"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="py-4">
                                                    <label className="block text-sm font-semibold mb-2">
                                                        Bank Account Number
                                                    </label>
                                                    <div className="flex items-center w-full max-w-[480px] border rounded-lg border-[#ACACAC] overflow-hidden">
                                                        <input
                                                            id="bank_acc"
                                                            autocomplete="on"
                                                            size="20"
                                                            className="bank-account-number flex-1 py-2 px-6 border-0 outline-none"
                                                            type="text"
                                                            placeholder="Enter Your Bank Account Number"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Conditional Rendering for Paypal Payment */}
                                        {selectedPayment === "paypal" && (
                                            <div className="space-y-4"></div>
                                        )}

                                        <div className="flex items-center jakarta py-6 text-[#ACACAC]">
                                            <input
                                                type="checkbox"
                                                required
                                                id="AND"
                                                className="mr-2"
                                            />
                                            <label
                                                htmlFor="AND"
                                                className="text-xs flex items-center"
                                            >
                                                I HAVE READ AND AGREE TO THE
                                                <a
                                                    href="#"
                                                    className="ml-1 text-[#ACACAC]"
                                                    style={{
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    TERMS AND CONDITIONS
                                                </a>
                                            </label>
                                        </div>

                                        <div className="mt-6 w-full sm:w-[480px] text-center">
                                            {selectedPayment === "paypal" ? (
                                                <button
                                                    type=""
                                                    className="w-full py-2 my-4 text-white btn-primary rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                                                >
                                                    <a href="http://127.0.0.1:8000/paypal-payment">
                                                        Continue to PayPal
                                                    </a>
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    className="w-full py-2 my-4 text-white btn-primary rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <ClipLoader
                                                            color="#ffffff"
                                                            size={20}
                                                        />
                                                    ) : (
                                                        "Submit Payment"
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-[#ACACAC] jakarta text-sm">
                                                Your personal data will be used
                                                to process your order, support
                                                your experience throughout this
                                                website, and for other purposes
                                                described
                                                <br /> in our privacy policy.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-[30px] sm:px-[100px] border py-[70px] flex gap-4 flex-col">
                                    <div className="purpose ">
                                        <h2 className="ml-1 mb-2 text-xl text-[#0A0D13] font-bold mb-1">
                                            Purpose -{" "}
                                            <span className="font-light">
                                                {p}
                                            </span>
                                        </h2>
                                        <div className="bg-[#FFC107] jakarta rounded-lg p-3">
                                            <h2 className="font-bold">
                                                RISK-FREE PAYMENT
                                            </h2>
                                            <p className="text-md text-blue">
                                                <b> {p} </b>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border border-[#ACACAC]/50"></div>

                                    <div className="jakarta flex flex-col gap-3 ">
                                        <div className="flex justify-between">
                                            <h2 className="text-gray-500">
                                                Subtotal
                                            </h2>
                                            <h3>
                                                $
                                                {purpos === "bids"
                                                    ? temp_price
                                                    : amount_real}
                                            </h3>
                                        </div>

                                        <div className="flex justify-between">
                                            <h3 className="text-gray-600 ">
                                                {" "}
                                                Tax (5%){" "}
                                            </h3>
                                            <h3>
                                                $
                                                {(
                                                    (purpos === "bids"
                                                        ? temp_price
                                                        : amount_real) * 0.05
                                                ).toFixed(2)}{" "}
                                            </h3>
                                        </div>
                                        {/* <label className="block text-sm font-semibold">
                                        Amount (USD){" "}
                                        <small className="text-xs">
                                            5% + tax added
                                        </small>
                                    </label>
                                    <p className="w-full p-2  rounded  text-gray-700">
                                        ${price}
                                    </p> */}
                                    </div>
                                    <div className="border border-[#ACACAC]/50"></div>

                                    <div className="flex items-center justify-between ">
                                        <div className="jakarta">
                                            <h2 className=" text-2xl text-[#0A0D13] font-semibold">
                                                Total:
                                            </h2>
                                            {/*<h3 className="text-gray-400 text-sm">
                                            After trial ends on{" "}
                                            {cancellationDate}
                                        </h3>*/}
                                            <input
                                                id="amount"
                                                hidden
                                                value={
                                                    purpos === "bids"
                                                        ? temp_price_total
                                                        : price
                                                }
                                            />
                                            <input
                                                hidden
                                                name="package"
                                                id="package"
                                                type="text"
                                                value="gold"
                                                readonly
                                            />
                                        </div>

                                        <h2>
                                            {" "}
                                            $
                                            {purpos === "bids"
                                                ? temp_price_total
                                                : price}
                                        </h2>
                                    </div>

                                    {/* <div>
                                    <h1 className="font-semibold text-xl">
                                        Terms
                                    </h1>
                                </div> */}
                                    <div className="border border-[#ACACAC]"></div>
                                    {/* <div class="flex flex-col bg-white jakarta  rounded-lg ">
                                    <div class="flex items-center mb-2 ">
                                        <div class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                            <span class="text-white text-xs">
                                                ✔
                                            </span>
                                        </div>
                                        <span className="text-[#334155]">
                                            Billing automatically starts after
                                            free trial ends
                                        </span>
                                    </div>
                                    <div class="flex items-center mb-2">
                                        <div class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                            <span class="text-white text-xs">
                                                ✔
                                            </span>
                                        </div>
                                        <span className="text-[#334155]">
                                            Cancel before {cancellationDate} to
                                            avoid getting billed
                                        </span>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                            <span class="text-white text-xs">
                                                ✔
                                            </span>
                                        </div>
                                        <span className="text-[#334155]">
                                            We will remind you 7 days before
                                            trial ends
                                        </span>
                                    </div>
                                </div> */}
                                </div>
                            </div>

                            {/* <div class="row error mx-1 text-center collapse">
                                <p
                                    style={{
                                        color: "#e31313",
                                        background: "#cfcfcf82",
                                        fontWeight: "600",
                                    }}
                                    class="alert my-2 py-1 w-100"
                                ></p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold">
                                    Email
                                </label>
                                <input
                                    className="w-full p-2 border border-gray-300 rounded"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold">
                                    Name on Card
                                </label>
                                <input
                                    name="name"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    type="text"
                                    placeholder="Enter name on card"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">
                                    Card Number
                                </label>
                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                    <div className="flex items-center justify-center p-3 bg-green">
                                        <FaCreditCard className="text-white font-semibold" />
                                    </div>
                                    <input
                                        autocomplete="on"
                                        size="20"
                                        className="card-number flex-1 p-2 border-0 outline-none"
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mb-4">
                                <div className="w-1/3">
                                    <label className="block text-sm font-semibold">
                                        CVC
                                    </label>
                                    <input
                                        autocomplete="off"
                                        placeholder="ex. 311"
                                        size="4"
                                        className="card-cvc w-full p-2 border border-gray-300 rounded"
                                        type="text"
                                        // placeholder="ex. 311"
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-sm font-semibold">
                                        Exp. Month
                                    </label>
                                    <input
                                        className="card-expiry-month w-full p-2 border border-gray-300 rounded"
                                        type="text"
                                        placeholder="MM"
                                        size="2"
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-sm font-semibold">
                                        Exp. Year
                                    </label>
                                    <input
                                        className="card-expiry-year w-full p-2 border border-gray-300 rounded"
                                        type="text"
                                        placeholder="YYYY"
                                        size="4"
                                    />
                                </div>
                            </div>
                            {/* other form */}
                            {/* <div className="mt-12 w-50 mb-12"> */}
                            {/*<form
          onSubmit={handleSubmit}
          className="max-w-lg  p-6 "
        >*/}
                            {/* Hidden input for listing */}

                            {/* <div className="mb-4">
                                    <label className="block text-sm font-semibold">
                                        Amount (USD){" "}
                                        <small className="text-xs">
                                            5% + tax added
                                        </small>
                                    </label>
                                    <p className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-700">
                                        ${price}
                                    </p>
                                    <input
                                        hidden
                                        size="4"
                                        name="amount"
                                        id="amount"
                                        type="number"
                                        value={price}
                                        readonly
                                    />

                                    <input
                                        hidden
                                        name="package"
                                        id="package"
                                        type="text"
                                        value="gold"
                                        readonly
                                    />
                                </div>

                                <div className="flex flex-col gap-3 mb-4">
                                    <label className="font-bold">Purpose</label>
                                    <p id="purpose">{p}</p>
                                </div>

                                <h2 className="py-2 text-2xl font-semibold">
                                    Total: ${price}
                                </h2>

                                <div className="flex items-center mt-4">
                                    <input
                                        type="checkbox"
                                        required
                                        id="AND"
                                        className="mr-2"
                                    />
                                    <label
                                        htmlFor="AND"
                                        className="text-xs text-gray-600 flex items-center"
                                    >
                                        I HAVE READ AND AGREE TO THE
                                        <a
                                            href="#"
                                            className="ml-1 text-black font-bold"
                                            style={{ textDecoration: "none" }}
                                        >
                                            TERMS AND CONDITIONS
                                        </a>
                                    </label>
                                </div> */}

                            {/* <div className="mt-6 text-center">
                                    <button
                                        type="submit"
                                        className="w-full py-2 my-4 text-white btn-primary rounded  focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ClipLoader
                                                color="#ffffff"
                                                size={20}
                                            /> // Spinner appears when loading
                                        ) : (
                                            "Submit Payment"
                                        )}
                                    </button>
                                </div>  */}

                            {/*</form>*/}
                            {/* </div> */}

                            {/* other form */}
                        </form>
                    </div>
                </div>
            )}
            <Modal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
            {/* Form right */}
            {paymentStatus && (
                <PaymentStatusModal
                    status={paymentStatus}
                    transactionId={transactionId}
                    onClose={() => setPaymentStatus(null)}
                    onRetry={() => {
                        setPaymentStatus(null);
                        setShowMpesaModal(true);
                    }}
                />
            )}
            {/* </div> */}
            {showMpesaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
                        <h2 className="text-xl font-bold mb-2 text-gray-800">
                            Mpesa Payment
                        </h2>
                        <p className="text-sm text-gray-600 mb-1">
                            Please enter your **Safaricom phone number**
                            starting with{" "}
                            <span className="font-semibold text-gray-800">
                                254
                            </span>{" "}
                            (e.g., 254712345678).
                        </p>
                        <InputMask
                            mask="254999999999"
                            maskChar=""
                            value={mpesaPhoneNumber}
                            onChange={(e) =>
                                setMpesaPhoneNumber(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                            placeholder="2547XXXXXXXX"
                        />
                        <p className="text-sm text-gray-600 mb-1">
                            You’ll receive an <strong>STK Push</strong> prompt
                            on your phone to authorize the payment.
                        </p>

                        <p className="text-sm text-gray-600 mb-4">
                            <strong>Total amount:</strong>{" "}
                            <UsdToLocalCurrency amount={temp_price_total} />
                            <span className="text-gray-400">
                                {" "}
                                (${parseFloat(temp_price_total)} USD)
                            </span>
                        </p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-gray-400">
                                Powered by{" "}
                                <strong>Lipr Technologies Ltd</strong>
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setShowMpesaModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowMpesaModal(false);
                                        LiprInit();
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PaymentForm;

// const PayStackInitOld = () => {
//         const payload = {
//                 listing: atob(listing_id),
//                 percent: atob(percent),
//                 amount: price,
//                 amountOriginal: amount_real,
//             };

//         const popup = new PaystackPop({
//             onSuccess:(transaction) =>{
//              alert(`Succesful! Ref: ${transaction.reference}`);
//             }
//         });
//         const paystack = new Paystack();
//         setTimeout(() => {
//             axiosClient
//             .post("/initialize", payload)
//             .then(( response ) => {
//                 console.log(response);
//                 if(response.data.status == true){
//                     var accessCode = response.data.data.access_code;
//                     popup.resumeTransaction(accessCode);

//                     console.log(popup);
//                     if(popup.isLoaded) alert('closed')
//                         //alert(popup.transactions[0].status)

//                     }
//                     //setPaystackRef(response.data.data.reference);
//                     //console.log(response.data.data.reference)

//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//             }, 500)
//         }
