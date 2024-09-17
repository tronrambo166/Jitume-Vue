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
import profile from "../../../images/profile.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from '../../contexts/contextProvider'

const Dashboardhero = () => {
    const { token, setToken } = useStateContext();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [id, setId] = useState("");

    useEffect(() => {
        axiosClient
            .get("/checkAuth")
            .then(({ data }) => {
                setUser(data.user);
                setId(data.user.id);
            })
            .catch(console.error);
    }, []);

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient
            .get('/logout')
            .then(({}) => {
                setUser(null);
                setToken(null);
                navigate("/"); // Redirect to the guest layout
            })
            .catch(console.error);
    };

    return (
        <div
            id="dashbg"
            className="relative max-w-[95%] mx-auto rounded-xl mb-[20px] h-[200px] mt-4 p-4"
        >
            <div className="flex justify-between">
                <div>
                    <h1 className="text-white">Pages / Dashboard</h1>
                    <h2 className="text-white font-semibold">Dashboard</h2>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="flex text-sm gap-1 items-center text-white"
                    >
                        <FaHome />
                        <span>Home</span>
                    </Link>
                    <div onClick={onLogout} className="flex items-center text-sm gap-2 pointer text-white">
                        <FaUser />
                        <span >Sign out</span>
                    </div>
                    <FaCog className="text-white" />
                    <FaBell className="text-white" />
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full">
                <div className="bg-gray-100/50 max-w-[95%] mx-auto px-6 py-3 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <img
                                src={profile}
                                className="rounded-xl"
                                alt="Profile"
                            />
                            <div className="flex flex-col gap-2">
                                <h2 className="text-black text-lg font-bold">
                                    {user.fname} {user.lname}
                                </h2>
                                <h3>{user.email || "test@email.com"}</h3>
                            </div>
                        </div>
                        <div className="flex text-[13px] gap-[33px] items-center">
                            <Link to="" className="flex items-center hover:text-green gap-1">
                                <FaWrench />
                                <span>Overview</span>
                            </Link>
                            <Link
                                to="/dashboard/addbusiness"
                                className="flex items-center hover:text-green gap-1"
                            >
                                <FaCopy />
                                <span>Add Business</span>
                            </Link>
                            <Link
                                to="/dashboard/add-service"
                                className="flex items-center hover:text-green gap-1"
                            >
                                <FaWrench />
                                <span>Add Service</span>
                            </Link>
                            <Link
                                to="/dashboard/messages"
                                className="flex items-center hover:text-green gap-1"
                            >
                                <FaEnvelope />
                                <span>Messages</span>
                            </Link>
                            {id && (
                                <Link
                                    to={`./account/${id}`}
                                    className="flex items-center hover:text-green gap-1"
                                >
                                    <FaDollarSign />
                                    <span>Account</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboardhero;
