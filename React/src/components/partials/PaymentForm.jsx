import { useState, useRef } from "react";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { useParams, useNavigate } from "react-router-dom";
import { FaCreditCard, FaHome } from "react-icons/fa";
import axiosClient from "../../axiosClient";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const PaymentForm = () => {
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
    //Stripe Code
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
    //Stripe Code

    const { listing_id } = useParams();
    let { purpose } = useParams();
    const purpos = base64_decode(purpose);

    var p = '';
    if(purpos === "bids")
     p = 'Investment bid';
    else if(purpos === "s_mile")
     p = 'Service milestone';
    else  p = purpos;

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
                            alert(
                                "Success, you will be notified if bid is accepted!"
                            );
                            navigate("/");
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

    const popupClose = () => {
        setShowModal(false);
    };

    return (
        <>
            <ToastContainer />
            <div className="container flex mx-auto my-8 justify-center space-x-8">
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
                <div className="card bg-white w-[500px] shadow-md text-[#343a40] p-6">
                    <a
                        href="/"
                        className="text-black hover:text-green flex items-center"
                    >
                        <FaHome className="ml-1" /> Home
                    </a>

                    <div className="card-body mt-4">
                        <div className="pb-3 pt-2 text-center">
                            <h6 className="text-xl font-bold text-green-800">
                                A Secure and Easy Checkout Experience
                            </h6>
                            <h5 className="text-lg font-bold">
                                Pay with your Credit/Debit Card via Stripe
                            </h5>
                        </div>

                        {/*  action="{{ route('stripe.post.coversation') }}"*/}
                        <form
                            role="form"
                            onSubmit={handleSubmit}
                            method="post"
                            class="class2 require-validation m-auto"
                            data-cc-on-file="false"
                            data-stripe-publishable-key="pk_test_51JFWrpJkjwNxIm6zf1BN9frgMmLdlGWlSjkcdVpgVueYK5fosCf1fAKlMpGrkfGoiXGMb0PpcMEOdINTEVcJoCNa00tJop21w6"
                            id="payment-form"
                        >
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
                            <div className="mt-12 w-50 mb-12">
                                {/*<form
          onSubmit={handleSubmit}
          className="max-w-lg  p-6 "
        >*/}
                                {/* Hidden input for listing */}

                                <div className="mb-4">
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
                                </div>

                                <div className="mt-6 text-center">
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
                                </div>

                                {/*</form>*/}
                            </div>

                            {/* other form */}
                        </form>
                    </div>
                </div>

                {/* Form right */}
            </div>
        </>
    );
};

export default PaymentForm;
