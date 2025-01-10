import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import BusinessHero from "../Heros/BusinessHero";
import { FaBolt, FaRegLightbulb } from "react-icons/fa";
import lightbulb from "../../images/light-bulb.png";
import whitebulb from "../../images/bulbwhite.png";
import user from "../../images/greenuser.png";
import flash from "../../images/flash.png";
import flashblack from "../../images/flashblack.png";
import userwhite from "../../images/userwhite.png";
import BackBtn from "./BackBtn";
//import { useParams } from 'react-router-dom';
import ScrollToTop from "../pages/ScrollToTop";
const Subscribepage = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [subscribed, setSubscribed] = useState(true);
    const [plan, setPlan] = useState("gold");
    const [tokenLeft, setTokenLeft] = useState(5);
    const [expire, setExpire] = useState(5);
    const [frequency, setFrequency] = useState("monthly");
    const navigate = useNavigate();
    const { id } = useParams();
    const [u_id, setid] = useState("");

    const [amount, setAmount] = useState("0");
    const [range, setRange] = useState("all");
    const [days, setDays] = useState("");
    const form = {
        business_id: atob(atob(id)),
    };

    const packagePrices = {
        silver: {
            monthly: "9.99",
            annual: "95.99",
        },
        gold: {
            monthly: "29.99",
            annual: "287.99",
        },
        platinum: {
            monthly: "69.99",
            annual: "671.99",
        },
    };

    const handlePackageSelect = (pkg) => {
        setSelectedPackage(pkg);
        setAmount(pkg);

        if (pkg == "9.99") {
            setPlan("silver");
            setDays(30);
        }
        if (pkg == "29.99") {
            setPlan("gold");
            setDays(30);
        }
        if (pkg == "69.99") {
            setPlan("platinum");
            setDays(30);
        }
        if (pkg == "95.99") {
            setPlan("silver");
            setDays(365);
        }
        if (pkg == "287.99") {
            setPlan("gold");
            setDays(365);
        }
        if (pkg == "671.99") {
            setPlan("platinum");
            setDays(365);
        }

        if (
            pkg == "platinum-trial" ||
            pkg == "gold-trial" ||
            pkg == "silver-trial"
        ) {
            setPlan(pkg);
            setDays(7);
            setAmount(0);
        }
    };

    const handleFrequencyChange = (freq) => {
        setFrequency(freq);
    };

    const Checkout = () => {
        //alert(amount+plan+days)

        if (!plan) alert("Please select a plan!");
        else {
            if (selectedPackage) {
                const range_e = btoa(form.range);
                const amount_e = btoa(amount);
                const business_id_e = btoa(form.business_id);
                const plan_e = btoa(plan);
                const days_e = btoa(days);
                const inv = u_id;

                $.confirm({
                    title: "Are you sure?",
                    content: "Are you sure to pay?",
                    buttons: {
                        confirm: function () {
                            window.location.href =
                                "https://test.jitume.com/stripeSubscribe/" +
                                amount_e +
                                "/" +
                                plan_e +
                                "/" +
                                days_e +
                                "/" +
                                range_e +
                                "/" +
                                inv;
                            //navigate('/stripeSubscribe/' + amount_e+'/'+plan_e+'/'+days_e+'/'+range_e);
                        },
                        cancel: function () {
                            $.alert("Canceled!");
                        },
                    },
                });
            } else setShowAlert(true);
        }
    };

    const confirmCheckout = () => {
        setShowConfirmation(false);
        navigate("/checkout");
    };

    const closeAlert = () => {
        setShowAlert(false);
    };

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const getUser = () => {
            axiosClient
                .get("/checkAuth")
                .then(({ data }) => {
                    setid(data.user.id);
                    console.log(data.user.id);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getUser();
    }, []);

    return (
        <div>
            <BusinessHero />
            <BackBtn />
            
            <div className="flex  py-[70px] justify-center items-center">
                <div className="flex flex-col  items-center">
                    <h1 className="font-bold text-center  text-[#334155] text-4xl">
                        Let's get you started!
                    </h1>
                    <h2 className="text-center jakarta  text-[16px] text-[#334155]">
                        All plans start with a 7 days free trial.
                    </h2>
                    <div>
                        <div className="flex flex-row mt-5 border rounded-md sm:flex-row jakarta text-[13px] justify-center whitespace-nowrap">
                            <button
                                className={`flex items-center px-6 py-2 rounded-l-md ${
                                    frequency === "monthly"
                                        ? "bg-[#198754] text-white"
                                        : "bg-gray-200"
                                }`}
                                onClick={() => handleFrequencyChange("monthly")}
                            >
                                Monthly
                            </button>
                            <button
                                className={`flex items-center px-6 py-2 rounded-r-md ${
                                    frequency === "annual"
                                        ? "bg-[#198754] text-white"
                                        : "bg-gray-200"
                                }`}
                                onClick={() => handleFrequencyChange("annual")}
                            >
                                Annually
                            </button>
                        </div>
                    </div>

                    {/* <div>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="subscription"
                                    value="monthly"
                                    checked={frequency === 'monthly'}
                                    onChange={() => handleFrequencyChange('monthly')}
                                />
                                <span className="px-1">Monthly</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="subscription"
                                    value="annual"
                                    checked={frequency === 'annual'}
                                    onChange={() => handleFrequencyChange('annual')}
                                />
                                <span className="px-1">Annually (save 20%)</span>
                            </label>
                        </div>
                    </div> */}
                    <div className="flex my-8 flex-col border border-[#18181B]/20 lg:flex-row justify-center items-stretch w-full max-w-5xl mb-12 gap-4">
                        {/* Silver Card */}
                        <div
                            onClick={() =>
                                handlePackageSelect(
                                    packagePrices.silver[frequency]
                                )
                            }
                            className={`flex flex-col px-5 py-10 w-full sm:w-[400px] cursor-pointer transition duration-200 
        ${plan === "silver" ? "bg-[#15803D]" : "bg-white"}`} // Change bg based on selection
                        >
                            <img
                                src={plan === "silver" ? userwhite : user} // Change `alternativeUser` to your non-selected image path
                                className="my-3"
                                width={plan === "silver" ? 25 : 35}
                                alt=""
                            />
                            <h1
                                className={`text-xl font-semibold ${
                                    plan === "silver"
                                        ? "text-white"
                                        : "text-[#0F172A]"
                                }`}
                            >
                                Silver
                            </h1>
                            <div className="rounded-xl shadow-sm w-full cursor-pointer">
                                <p
                                    className={`whitespace-nowrap text-[#334155] mt-2 jakarta text-[13px] ${
                                        plan === "silver"
                                            ? "text-white"
                                            : "text-[#334155]"
                                    }`}
                                >
                                    {packagePrices.silver[frequency]}
                                    10 free "Unlock tokens" per month <br></br>{" "}
                                    from any range.
                                </p>
                            </div>

                            <div className="pt-[40px] space-y-3">
                                <p
                                    className={`jakarta text-[15px] ${
                                        plan === "silver"
                                            ? "text-white"
                                            : "text-[#334155]"
                                    }`}
                                >
                                    Starting from{" "}
                                    <span className="font-semibold text-[17px]">
                                        ${packagePrices.silver[frequency]}
                                    </span>
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePackageSelect("silver-trial");
                                    }}
                                    className={`w-full border rounded-md py-2 
    ${plan === "silver" ? "bg-white text-gray-700" : "bg-[#15803D] text-white"} 
    ${frequency === "annual" ? "cursor-not-allowed" : "hover:bg-green-700"}`}
                                    disabled={frequency === "annual"}
                                >
                                    Try free for 7 days
                                </button>
                            </div>
                        </div>

                        {/* Gold Card (Center Card) */}
                        <div
                            onClick={() =>
                                handlePackageSelect(
                                    packagePrices.gold[frequency]
                                )
                            }
                            className={`flex flex-col px-5 py-10 w-full sm:w-[400px] cursor-pointer transition duration-200 
        ${plan === "gold" ? "bg-[#15803D]" : "bg-white"}`} // Green when selected
                        >
                            <img
                                src={plan === "gold" ? flash : flashblack}
                                className="my-3"
                                width={30}
                                alt=""
                            />
                            <h1
                                className={`text-xl font-semibold ${
                                    plan === "gold"
                                        ? "text-white"
                                        : "text-[#0F172A]"
                                }`}
                            >
                                Gold
                            </h1>
                            <div className="rounded-xl shadow-sm w-full cursor-pointer">
                                <p
                                    className={`whitespace-nowrap mt-2 jakarta text-[13px] ${
                                        plan === "gold"
                                            ? "text-white"
                                            : "text-[#334155]"
                                    }`}
                                >
                                    {packagePrices.gold[frequency]}
                                    30 free "Unlock tokens" per month
                                    <br /> for any range.
                                </p>
                            </div>

                            <div className="pt-[48px] space-y-3">
                                <p
                                    className={`jakarta text-[15px] ${
                                        plan === "gold"
                                            ? "text-gray-100"
                                            : "#F3F4F6"
                                    }`}
                                >
                                    Starting from{" "}
                                    <span className="font-semibold  text-[17px]">
                                        ${packagePrices.gold[frequency]}
                                    </span>
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePackageSelect("gold-trial");
                                    }}
                                    className={`w-full border rounded-md py-2 
    ${plan === "gold" ? "bg-white text-gray-700" : "bg-green-600 text-white"} 
    ${frequency === "annual" ? "cursor-not-allowed" : "hover:bg-green-700"}`}
                                    disabled={frequency === "annual"}
                                >
                                    Try free for 7 days
                                </button>
                            </div>
                        </div>

                        {/* Platinum Card */}
                        <div
                            onClick={() =>
                                handlePackageSelect(
                                    packagePrices.platinum[frequency]
                                )
                            }
                            className={`flex flex-col px-5 py-10 w-full sm:w-[400px] cursor-pointer transition duration-200 
        ${plan === "platinum" ? "bg-[#15803D]" : "bg-white"}`} // Change bg based on selection
                        >
                            <img
                                src={
                                    plan === "platinum" ? whitebulb : lightbulb
                                }
                                className="my-3"
                                width={45}
                                alt=""
                            />

                            <h1
                                className={`text-xl font-semibold ${
                                    plan === "platinum"
                                        ? "text-[#ffffff]"
                                        : "text-[#334155]"
                                }`}
                            >
                                Platinum
                            </h1>
                            <div className="rounded-xl shadow-sm w-full cursor-pointer">
                                <p
                                    className={`whitespace-nowrap mt-2 jakarta text-[13px] ${
                                        plan === "platinum"
                                            ? "text-white"
                                            : "text-[#334155]"
                                    }`}
                                >
                                    {packagePrices.platinum[frequency]}
                                    Silver access + Gold access to <br /> all
                                    data.
                                </p>
                            </div>

                            <div className="pt-[40px] space-y-3">
                                <p
                                    className={`jakarta text-[15px] ${
                                        plan === "platinum"
                                            ? "text-[#ffffff]"
                                            : "#334155"
                                    }`}
                                >
                                    Starting from{" "}
                                    <span className="font-semibold text-[17px]">
                                        ${packagePrices.platinum[frequency]}
                                    </span>
                                </p>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePackageSelect("platinum-trial");
                                    }}
                                    className={`w-full border rounded-md py-2  
    ${
        plan === "platinum"
            ? "bg-white text-gray-700"
            : "bg-green-600 text-white"
    } 
    ${frequency === "annual" ? "cursor-not-allowed" : "hover:bg-green-700"}`}
                                    disabled={frequency === "annual"}
                                >
                                    Try free for 7 days
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-100 flex flex-col lg:flex-row w-full max-w-[1040px] mx-auto items-start lg:items-center p-4 relative">
                        <div className="p-4 mt-8 lg:mt-0 lg:mr-8">
                            <h1 className="text-xl font-semibold">
                                Turnover ranges
                            </h1>
                            <h2 className="mt-2">$0-$10,000</h2>
                            <h2 className="mt-2">$10,000-$100,000</h2>
                            <h2 className="mt-2">$100,000-$250,000</h2>
                            <h2 className="mt-2">$250,000-$500,000</h2>
                            <h2 className="mt-2">$500,000+</h2>
                        </div>
                        {/* Button container positioned at the bottom right */}
                        <div className="absolute bottom-4 right-4 flex gap-4">
                            <button
                                className="bg-black px-6 py-2 rounded-lg text-gray-100 border-gray-400"
                                onClick={goBack}
                            >
                                Back
                            </button>
                            <button
                                className="btn-primary px-6 py-2 rounded-lg text-white"
                                onClick={Checkout}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>

                    {/* 
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-center w-full max-w-4xl mb-12">
                        <div className="flex flex-col items-center w-full sm:w-1/3">
                            <h1 className="text-xl mb-4">Silver</h1>
                            <div
                                className={`border rounded-xl p-4 text-center shadow-sm w-full sm:w-[300px] cursor-pointer 
                                ${plan === 'silver' ? 'bg-green-100 border-green' : ''}`}
                                onClick={() => handlePackageSelect(packagePrices.silver[frequency])}
                            >
                                <h1>{packagePrices.silver[frequency]}</h1>
                                <p className="whitespace-nowrap">
                                    10 free "Unlock tokens" per<br /> month from any range.
                                </p>
                                
                            </div>

                            <button onClick={() => handlePackageSelect('silver-trial')}
                                    className={`w-full sm:w-[250px] border rounded-md py-2 my-2 
                                    ${frequency === 'annual' ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green hover:bg-green-700 text-white'}`}
                                    disabled={frequency === 'annual'}
                                >
                                    Try free for 7 days
                                </button>
                        </div>

                        <div className="flex flex-col items-center w-full sm:w-1/3">
                            <h1 className="text-xl mb-4">Gold</h1>
                            <div
                                className={`border text-center p-4 rounded-md shadow-sm w-full sm:w-[300px] cursor-pointer 
                                ${plan === 'gold' ? 'bg-green-100 border-green' : ''}`}
                                onClick={() => handlePackageSelect(packagePrices.gold[frequency])}
                            >
                                <h1>{packagePrices.gold[frequency]}</h1>
                                <p className="whitespace-nowrap">
                                     30 free "Unlock tokens" per<br /> month for any range.
                                </p>
                                
                            </div>
                            <button onClick={() => handlePackageSelect('gold-trial')}
                                    className={`w-full sm:w-[250px] border rounded-md py-2 my-2 
                                    ${frequency === 'annual' ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green hover:bg-green-700 text-white'}`}
                                    disabled={frequency === 'annual'}
                                >
                                    Try free for 7 days
                                </button>
                        </div>

                        <div className="flex flex-col items-center w-full sm:w-1/3">
                            <h1 className="text-xl mb-4">Platinum</h1>
                            <div
                                className={`border text-center p-4 rounded-md shadow-sm w-full sm:w-[300px] cursor-pointer 
                                ${plan === 'platinum' ? 'bg-green-100 border-green' : ''}`}
                                onClick={() => handlePackageSelect(packagePrices.platinum[frequency])}
                            >
                                <h1>{packagePrices.platinum[frequency]}</h1>
                                <p className="whitespace-nowrap">
                                    Silver access + Gold access to all data.
                                </p>
                               
                            </div>
                             <button onClick={() => handlePackageSelect('platinum-trial')}
                                    className={`w-full sm:w-[250px] border rounded-md py-2 my-2 
                                    ${frequency === 'annual' ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green hover:bg-green-700 text-white'}`}
                                    disabled={frequency === 'annual'}
                                >
                                    Try free for 7 days
                                </button>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className="flex jc">
                <div className=" "></div>
            </div>
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Confirm Your Selection
                        </h2>
                        <p>
                            You have selected the{" "}
                            <b>
                                {selectedPackage.charAt(0).toUpperCase() +
                                    selectedPackage.slice(1)}
                            </b>{" "}
                            package.
                        </p>
                        <p>
                            {selectedPackage === "silver" ? (
                                <>
                                    <p>
                                        Your plan expires in <b>{expire}</b>{" "}
                                        days.
                                    </p>
                                    <p className="text-dark small d-block">
                                        Are you sure you want to use one of your{" "}
                                        {tokenLeft} business information tokens?
                                    </p>
                                </>
                            ) : (
                                <p>
                                    Please use <b>'Small fee'</b> option to
                                    unlock
                                </p>
                            )}
                        </p>
                        <div className="flex flex-col">
                            {selectedPackage === "silver" ? (
                                <div className="flex gap-3">
                                    <button
                                        className="modal_ok_btn w-75 m-auto d-inline btn rounded mr-3 px-3"
                                        onClick={confirmCheckout}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="modal_cancel_btn w-75 m-auto d-inline btn rounded mr-3 px-3"
                                        onClick={() =>
                                            setShowConfirmation(false)
                                        }
                                    >
                                        No
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        className="modal_ok_btn w-75 m-auto d-inline btn rounded mr-3 px-3"
                                        onClick={() =>
                                            setShowConfirmation(false)
                                        }
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Alert</h2>
                        <p>Please select a package before proceeding.</p>
                        <button
                            className="btn-primary px-6 py-2 rounded-full text-white"
                            onClick={closeAlert}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <ScrollToTop/>
        </div>
    );
};

export default Subscribepage;
