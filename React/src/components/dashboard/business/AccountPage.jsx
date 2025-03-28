import {
    FaUser,
    FaCog,
    FaBell,
    FaWrench,
    FaEnvelope,
    FaCopy,
    FaDollarSign,
    FaHome,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BarLoader } from "react-spinners";

function AccountPage() {
    const location = useLocation();
    const { user_id } = location.state || { user_id: 0 };

    //const { user_id } = useParams();
    const navigate = useNavigate();

    const connectToStripe = () => {
        window.location.href = `https://tujitume.com/connect/${user_id}`;
    };

    const [details, setDetails] = useState([]);
    const [bal, setBal] = useState("");
    const [balP, setBalP] = useState("");
    const [C, setC] = useState("");

    useEffect(() => {
        const getAccount = () => {
            axiosClient
                .get("/business/account")
                .then(({ data }) => {
                    setBal(data.balanceA);
                    setBalP(data.balanceP);
                    setC(data.connected);
                    setDetails(data.user);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getAccount();
    }, []);

    return (
        <div className="min-h-screen  flex flex-col py-[50px] items-center ">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-8">
                    <FaUser className="text-green w-12 h-12" />
                    <div className="ml-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Account Details
                        </h1>
                        <p className="text-sm text-gray-600">
                            Manage your business account
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">First Name:</span>
                        <span className="font-semibold text-gray-800">
                            {details.fname}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Last Name:</span>
                        <span className="font-semibold text-gray-800">
                            {details.lname}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            Balance Available:
                        </span>
                        <span className="font-semibold text-green-600">
                            {bal}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Balance Pending:</span>
                        <span className="font-semibold text-yellow-600">
                            {balP}
                        </span>
                    </div>

                    <div className="mt-6">
                        {C === "" ? (
                            <div className="flex justify-center py-4">
                                <BarLoader color="#38a169" width={150} />
                            </div>
                        ) : C ? (
                            <button
                                onClick={connectToStripe}
                                className="w-full btn-primary  text-white py-3 rounded-lg transition-all ease-in-out duration-200"
                            >
                                View Stripe Account
                            </button>
                        ) : (
                            <div>
                                <p className="text-center text-gray-700 mb-4 py-1">
                                    You must connect to the Stripe platform to
                                    receive payments.
                                </p>
                                <button
                                    onClick={connectToStripe}
                                    className="w-full btn-primary text-white py-3 rounded-lg transition-all ease-in-out duration-200"
                                >
                                    Connect to Stripe
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountPage;
