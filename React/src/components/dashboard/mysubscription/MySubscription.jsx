import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { IoFlashOutline } from "react-icons/io5";
const MySubscription = () => {
    const [isAutoRenewEnabled, setAutoRenewEnabled] = useState(true);

    const handleToggle = () => {
        const newState = !isAutoRenewEnabled;
        setAutoRenewEnabled(newState);
        console.log(`Auto Renew is now ${newState ? "enabled" : "disabled"}`);
    };
    const [subscribeData, setSubscribeData] = useState("");
    const [count, setCount] = useState(null);

    // Subscriptions data (to be replaced with API data later)
    const subscriptions = [
        {
            name: subscribeData.plan,
            daysRemaining: subscribeData.expire,
            price: subscribeData.amount,
            endDate: subscribeData.end_date,
            token_left:subscribeData.token_left,
            isActive: true,
         },
    ];

    // Billing history data (to be replaced with API data later)
    const billingHistory = [
        {
            subscriptionType: "Beginner Plan",
            startDate: "06/01/2021",
            endDate: "07/01/2021",
            amount: "$30.00",
        },
    ];


    useEffect(() =>{
            const isSubscribed = () => {
            axiosClient
                .get("/isSubscribed/" + 0)
                .then(({ data }) => {
                    console.log(data.data);
                    setCount(data.count)
                    if (data.count > 0) {
                        setSubscribeData(data.data);
                        console.log(data);
                    }    
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        isSubscribed();
    }, []);


        const cancelSubscription = () => {
        try {
            $.confirm({
                title: "Cancel Subscription?",
                content: "Are you sure?",
                buttons: {
                    confirm: function () {
                        axiosClient
                            .get("business/cancelSubscription/" + subscribeData.stripe_sub_id)
                            .then((data) => {
                                console.log(data);
                                if (response.data.status === 200) {
                                    showAlert("success", response.data.message);
                                } else {
                                    showAlert("error", response.data.message);
                                }
                            });
                    },
                    cancel: function () {
                        $.alert("Canceled!");
                    },
                },
            });
        } catch (error) {
            console.error("Error saving data:", error.response);
        }
    };

    return (
        <div className="p-4 lg:p-8 min-h-screen flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 lg:p-8 w-full max-w-4xl space-y-8">
                <h2 className="text-2xl font-bold text-green-700">
                    <span className="text-black"> Your Subscription Plan </span>{" "}
                    {/* {subscriptions.find((sub) => sub.isActive)?.name || "None"} */}
                    {(subscriptions.find((sub) => sub.isActive)?.name || "None")
                        .split("-")
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join("-")}
                </h2>

                {/* Subscription Plans */}
                {count ?(
                <div className="flex flex-col lg:flex-row gap-6">
                    {subscriptions.map((sub, index) => (
                        <div
                            key={index}
                            className={`border-2 ${
                                sub.isActive
                                    ? "border-green-500 bg-green-100"
                                    : "border-transparent bg-white hover:bg-green-100"
                            } rounded-lg p-6 w-full lg:w-1/2 relative hover:shadow-md transition-shadow`}
                        >
                            <div className="bg-transparent w-16 p-1">
                                <IoFlashOutline
                                    size={40}
                                    className="text-black"
                                />
                            </div>

                            {sub.isActive && (
                                <div className="absolute top-4 right-4 bg-green-500 text-white w-6 h-6 flex items-center justify-center rounded-full">
                                    ✓
                                </div>
                            )}
                            <h3
                                style={{ textTransform: "capitalize" }}
                                className="text-lg font-bold text-green-800"
                            >
                                {sub.name} {sub.subcribed}
                            </h3>
                            {sub.isActive ? (
                                <p className="text-gray-600">
                                    {sub.daysRemaining} days remaining
                                </p>
                            ) : (
                                <p className="text-gray-600 italic">
                                    Upgrade to this plan
                                </p>
                            )}

                            <p className="text-gray-600 text-sm">
                                <strong>End Date:</strong> {sub.endDate}
                            </p>
                            <p className="text-gray-600 text-sm">
                                <strong>Token Left:</strong> {sub.token_left}
                            </p>
                            <p className="text-3xl font-semibold mt-4 text-green-800">
                                ${sub.price} / mo
                            </p>
                            <div className="flex justify-center">
                                <button
                                    onClick={cancelSubscription}
                                    className={`mt-6 px-4 py-2 rounded-lg  ${
                                        sub.isActive
                                            ? "text-black border border-green-600 hover:bg-green-200 bg-white"
                                            : "text-white bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    Cancel Subscription
                                </button>
                            </div>

                            {!sub.isActive && (
                                <p className="mt-2 text-sm text-green-600 cursor-pointer hover:underline">
                                    Learn more about this plan
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ):(
            <p className="text-center">You don't have any subscriptions, please 
            <a className="text-green-600" href="../subscribe/TUE9PQ=="> Subscribe </a> </p>
            )}


                {/* Auto Renew Toggle */}
                {/*<div className="mt-8 border-t pt-6">
                    <label className="flex items-center gap-4">
                        <span
                            className={`toggle-label block w-12 h-6 rounded-full relative cursor-pointer ${
                                isAutoRenewEnabled
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                            }`}
                            onClick={handleToggle}
                        >
                            <span
                                className={`dot absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                    isAutoRenewEnabled
                                        ? "translate-x-6"
                                        : "translate-x-0"
                                }`}
                            />
                        </span>
                        <span className="text-green-800 font-semibold">
                            Enable auto renew
                        </span>
                    </label>
                    <p className="text-gray-600 text-sm mt-2">
                        This option, if checked, will renew your subscription
                        when your current plan expires.
                    </p>
                </div>*/}

                {/* Billing History Section */}
                {/*      <div className="mt-8">
                    <h3 className="text-xl font-bold text-green-800">
                        Billing History
                    </h3>
                    <table className="w-full mt-4 text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b py-2 text-gray-700 font-semibold">
                                    Subscription Type
                                </th>
                                <th className="border-b py-2 text-gray-700 font-semibold">
                                    Start Date
                                </th>
                                <th className="border-b py-2 text-gray-700 font-semibold">
                                    End Date
                                </th>
                                <th className="border-b py-2 text-gray-700 font-semibold">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {billingHistory.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2 text-gray-800">
                                        {item.subscriptionType}
                                    </td>
                                    <td className="py-2 text-gray-800">
                                        {item.startDate}
                                    </td>
                                    <td className="py-2 text-gray-800">
                                        {item.endDate}
                                    </td>
                                    <td className="py-2 text-gray-800 font-bold">
                                        {item.amount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>*/}
            </div>
        </div>
    );
};

export default MySubscription;
