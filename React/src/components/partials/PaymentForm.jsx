import { useState, useRef } from "react";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { useParams, useNavigate } from "react-router-dom";
import { FaCreditCard, FaHome } from "react-icons/fa";
import axiosClient from "../../axiosClient";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackBtn from "./BackBtn";
const PaymentForm = () => {
    const [selectedPayment, setSelectedPayment] = useState("card");
    const [loading, setLoading] = useState(false); // Loader state
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

    const { listing_id } = useParams();
    let { purpose } = useParams();
    const purpos = base64_decode(purpose);

    var p = "";
    if (purpos === "bids") p = "Investment To Business";
    else if (purpos === "s_mile") p = "Pay Service milestone";
    else p = "Small Fee To Unlock Business";

    let { amount } = useParams();
    const amount_real = base64_decode(amount);
    const { percent } = useParams(); //alert(atob(percent))

    const [showModal, setShowModal] = useState(false);
    const price = parseFloat(amount_real) + parseFloat(0.05 * amount_real); // Fixed price value

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const payload = {
                listing: atob(listing_id),
                percent: atob(percent),
                package: $("#package").val(),
                amount: $("#amount").val(),
                amountOriginal: amount_real,
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
                            showSuccessToast(
                                "Bid placed, you will be notified if bid is accepted!"
                            );

                            // alert('Bid placed, you will be notified if bid is accepted!');
                            navigate("/");
                        }
                        if (data.status == 400)
                            // alert(data.message);
                            showErrorToast(data.message);
                    })
                    .catch((err) => {
                        console.log(err);
                        const response = err.response;
                        if (response && response.status === 422) {
                            console.log(response.data.errors);
                            showErrorToast(response.data.errors);
                        }
                    });
            } else {
                const payloadS = {
                    milestone_id: atob(listing_id),
                    amount: $("#amount").val(),
                    amountOriginal: amount_real,
                    stripeToken: $("#stripeToken").val(),
                };
                axiosClient
                    .post("/milestoneService", payloadS)
                    .then(({ data }) => {
                        if (data.status == 200) {
                            alert("Success!");
                            navigate("/service-milestones/" + btoa(listing_id));
                        }
                        if (data.status == 400) alert(data.message);
                    })
                    .catch((err) => {
                        console.log(err);
                        const response = err.response;
                        if (response && response.status === 422) {
                            console.log(response.data.errors);
                        }
                    });
            }

            //timeout
        }, 1000);
        //timeout
    };


    //OTHER PAYMENTS

    const bankSubmit = (event) => {
        event.preventDefault();
        setLoading(true); alert('bank'); return;
        setTimeout(() => {
            const payload = {
                listing: atob(listing_id),
                percent: atob(percent),
                package: $("#package").val(),
                amount: $("#amount").val(),
                amountOriginal: amount_real,
                stripeToken: $("#stripeToken").val(),
            };
            //console.log(payload);
                axiosClient
                    .post("/stripe.post.coversation", payload)
                    .then(({ data }) => {
                        console.log(data);
                        if (data.status === 200) { }
                    });
                }, 1000); 
    };



    const paypalSubmit = (event) => {
        event.preventDefault();
        setLoading(true); alert('paypal'); return;
        setTimeout(() => {
            const payload = {
                listing: atob(listing_id),
                percent: atob(percent),
                package: $("#package").val(),
                amount: $("#amount").val(),
                amountOriginal: amount_real,
                stripeToken: $("#stripeToken").val(),
            };
            //console.log(payload);
                axiosClient
                    .post("/stripe.post.coversation", payload)
                    .then(({ data }) => {
                        console.log(data);
                        if (data.status === 200) { }
                    });
                }, 1000); 
    }

    const popupClose = () => {
        setShowModal(false);
    };

    return (
        <>
            <BackBtn />

            <div className="flex pt-[40px] px-2  text-[#334155] flex-col items-center justify-center">
                <h1 className="text-5xl font-bold">Checkout</h1>
                <p className="jakarta text-center text-[14px]">
                    A secure and easy checkout experience. Pay with your
                    Credit/Debit <br></br> cards or via stripe
                </p>
            </div>
            <ToastContainer />
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
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
                                        {["card", "bank", "paypal"].map(
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
                                        )}
                                    </div>

                                    {/* Conditional Rendering for Card Payment */}
                                    {selectedPayment === "card" && (
                                        <div className="space-y-4">
                                            <div className="py-4">
                                                <label className="block text-sm font-semibold mb-2">
                                                    Card Number
                                                </label>
                                                <div className="flex items-center w-full max-w-[480px] border rounded-lg border-[#ACACAC] overflow-hidden">
                                                    <input
                                                        autocomplete="on"
                                                        size="20"
                                                        className="card-number flex-1 py-2 px-6 border-0 outline-none"
                                                        type="text"
                                                        placeholder="1234 5678 9012 3456"
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
                                        <div className="space-y-4">
                                            <div className="py-4">
                                                <label className="block text-sm font-semibold mb-2">
                                                    PayPal Account Name
                                                </label>
                                                <div className="flex items-center w-full max-w-[480px] border rounded-lg border-[#ACACAC] overflow-hidden">
                                                    <input
                                                        id="paypal_name"
                                                        autocomplete="on"
                                                        size="20"
                                                        className="paypal-account-name flex-1 py-2 px-6 border-0 outline-none"
                                                        type="text"
                                                        placeholder="Enter Your PayPal Account Name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="py-4">
                                                <label className="block text-sm font-semibold mb-2">
                                                    PayPal Email or Phone Number
                                                </label>
                                                <div className="flex items-center w-full max-w-[480px] border rounded-lg border-[#ACACAC] overflow-hidden">
                                                    <input
                                                        id="paypal_email"
                                                        autocomplete="on"
                                                        size="20"
                                                        className="paypal-email-phone flex-1 py-2 px-6 border-0 outline-none"
                                                        type="text"
                                                        placeholder="Your PayPal Email or Phone Number"
                                                    />
                                                </div>
                                            </div>
                                        </div>
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
                                    </div>

                                    <div>
                                        <p className="text-[#ACACAC] jakarta text-sm">
                                            Your personal data will be used to
                                            process your order, support your
                                            experience throughout this website,
                                            and for other purposes described
                                            <br /> in our privacy policy.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className=" px-[100px] border  px-8 py-[70px] flex gap-4 flex-col">
                                <div className="purpose ">
                                    <h2 className="ml-1 text-xl text-[#0A0D13] font-bold mb-1">
                                        Purpose
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
                                        <h3>${amount_real}</h3>
                                    </div>

                                    <div className="flex justify-between">
                                        <h3 className="text-gray-600 ">
                                            {" "}
                                            Tax (5%){" "}
                                        </h3>
                                        <h3>
                                            ${(amount_real * 0.05).toFixed()}{" "}
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
                                        <h3 className="text-gray-400 text-sm">
                                            After trial ends on 06 Nov, 2024
                                        </h3>
                                        <input
                                            id="amount"
                                            hidden
                                            value={price}
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

                                    <h2> ${price}</h2>
                                </div>

                                <div>
                                    <h1 className="font-semibold text-xl">
                                        Terms
                                    </h1>
                                </div>
                                <div className="border border-[#ACACAC]"></div>
                                <div class="flex flex-col bg-white jakarta  rounded-lg ">
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
                                            Cancel before 06 Nov to avoid
                                            getting billed
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
                                </div>
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

            {/* Form right */}
            {/* </div> */}
        </>
    );
};

export default PaymentForm;
