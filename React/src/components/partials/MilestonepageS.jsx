import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../axiosClient";
import React from "react";
import { useStateContext } from "../../contexts/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Navbar from "./Navbar";
import Modal from "./Authmodal";
import ServiceHero from "../Heros/ServiceHero";
import BackBtn from "./BackBtn";
import TujitumeLogo from "../../images/Tujitumelogo.svg";
import { BarLoader } from "react-spinners";

const MilestonePage = () => {
    const { id } = useParams();
    const listing_id = atob(atob(id));

    const [isPaid, setIsPaid] = useState([]);
    const [firstMileId, setFirstMileId] = useState([]);
    const [serviceFee, setServiceFee] = useState([]);
    const [miles, setMiles] = useState([]);setServiceFee
    const [no_mile, setNo_mile] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [booked, setbooked] = useState(false);
    const [allow, setallow] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [curr_step, setCurrStep] = useState(0);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { token } = useStateContext();
    const { setListing_id, amounts, setAmounts, setPurpose, setPercent } =
        useStateContext();
    const navigate = useNavigate();
    // const [miles, setMiles] = useState([]);
    const total_steps = miles.length;
    const [loading, setLoading] = useState(true); // Set to true when data is being loaded

    //const curr_step = 0;

    useEffect(() => {
        if (token) {
            setIsAuthModalOpen(false);
            setModalOpen(false);
        }

        const getMilestones = () => {
            axiosClient
                .get("/getMilestonesS_Auth/" + listing_id, {

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(({ data }) => {
                    setLoading(false);
                    if (Array.isArray(data.data)) {
                        console.log(data.data);
                        setMiles(data.data);
                        setServiceFee(data.service_fee);
                        setIsPaid(data.isPaid);
                        if (data.data.length !== 0) {
                            for (let i = 0; i < data.data.length; i++) {
                                if (data.data[i].active == 1)
                                    setCurrStep(i + 1);

                                //Set First Mile Id
                                if(i == 0)
                                    setFirstMileId(data.data[0].id);
                            }
                        }
                    } else {
                        setMiles([]);
                    }
                    setIsDone(data.done_msg);
                    setbooked(data.booked);
                    setallow(data.allow);
                })
                .catch((err) => {
                    setLoading(false);
                    setMiles([]);
                    console.log(err);
                    toast.error("An error occurred while fetching the data!");
                });
        };

        getMilestones();
    }, [listing_id, token]);

    const handleStatusChange = (milestoneName, status) => {
        //console.log(Milestone ${milestoneName} status changed to: ${status});
        // Update milestone status logic here
    };

    const handlePay = (mile_id, amount) => {
        //alert(mile_id+ amount)
        var amount = btoa(amount);
        var mile_id = btoa(mile_id);
        var purpose = btoa("s_mile");
        $.confirm({
            title: false,
            content: `<img src="${TujitumeLogo}" alt="Tujitume Logo" style="max-width: 100px; margin-right: 10px;" class="jconfirm-logo"><div>Are you sure?</div>`,

            buttons: {
                confirm: function () {
                    //window.location.href =
                    //"/checkoutS/" +mile_id +"/" +amount +"/" +purpose +"/" +btoa("null");
                    navigate("/checkout", {
                        state: {
                            amount: amount,
                            listing_id: mile_id,
                            purpose: purpose,
                        },
                    });
                },
                cancel: function () {
                    $.alert("Canceled!");
                },
            },
        });
    };

    //DOWNLOAD
    const download_doc = (mile_id) => (e) => {
        axiosClient({
            url: "download_milestoneDocS/" + listing_id + "/" + mile_id, //your url
            method: "GET",
            responseType: "blob",
        }).then((data) => {
            //console.log(data);
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
                    link.setAttribute("download", "milestone.docx");
                //or any other extension
                else link.setAttribute("download", "milestone.pdf");

                document.body.appendChild(link);
                link.click();
            }
        });
    };

    const handleAuthModalOpen = (event) => {
        event.preventDefault();
        if (!token) {
            setIsAuthModalOpen(true); // Open auth modal if not authenticated
        }
    };
    const handleCloseModal = () => {
        setIsAuthModalOpen(false); // Manual close
    };

    return (
        <>
            <ServiceHero />
            <BackBtn />

            <div className="container mx-auto p-5">
                <div className="text-center mb-10 mt-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#334155]">
                        Milestones
                    </h1>
                    <p className="text-gray-500 mt-4">
                        Here keep track of your milestones
                    </p>
                </div>
                {loading ? (
                    <div className="flex flex-col items-center my-10 space-y-4">
                        <h5 className="w-full max-w-md  text-[#334155] py-3 text-center rounded-lg shadow-lg text-xl font-semibold">
                            Please wait while we load the milestones...
                        </h5>
                        <BarLoader width="100%" color="#198754" />
                    </div>
                ) : (
                    <>
                        {" "}
                        {!token && (
                            <div class="w-75 h-100 py-5 my-5 my-auto justify-content-center my-2 text-center mx-auto">
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="btn-primary py-2 px-6 rounded-xl mt-3"
                                >
                                    {" "}
                                    Login To Pay{" "}
                                </button>
                            </div>
                        )}
                        {no_mile && (
                            <div class="w-75 h-100 py-5 my-5 my-auto justify-content-center my-2 text-center mx-auto">
                                <h5 class="w-75 mx-auto bg-light py-3 my-3 text-secondary">
                                    No Milestones Yet!
                                </h5>
                            </div>
                        )}
                        {isDone && (
                            <div class="w-75 my-5 h-100 text-center mx-auto">
                                <h5 class="w-75 mx-auto bg-light py-3 my-3 text-secondary">
                                    Milestones completed, Service delivered!
                                </h5>
                            </div>
                        )}
                        {/* Steps 1-4 */}
                        <div className="flex justify-center  items-center mb-16 px-8 lg:px-96 sm:px-8">
                            {Array.from({ length: total_steps }, (_, index) => (
                                <React.Fragment key={index}>
                                    {/* Step Circle and Text */}
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-semibold text-sm sm:text-base ${
                                                index < curr_step
                                                    ? "bg-[#198754] text-white" // Completed steps
                                                    : "bg-white border border-gray-400 text-gray-700" // Inactive steps
                                            }`}
                                        >
                                            {index + 1}
                                        </div>

                                        {/* Step Label */}
                                        <span className="text-sm sm:text-base text-gray-600">
                                            Step {index + 1}
                                        </span>
                                    </div>

                                    {/* Centered Dashed Line */}
                                    {index < total_steps - 1 && (
                                        <div className="flex-grow h-1 mx-2 sm:mx-4 flex items-center">
                                            <div className="w-full border-t-2 border-dashed border-gray-400"></div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}

                        </div>
                        <div className="overflow-x-auto sm:rounded-lg  mx-auto border  border-gray-300 ">
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-[#E5E7EB]">
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                            Milestone Name
                                        </th>
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                            Documentation
                                        </th>
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                            Action
                                        </th>
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                            Time Left
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {miles
                                        .filter(
                                            (milestone) =>
                                                milestone.status === "Done"
                                        )
                                        .map((milestone, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-100"
                                            >
                                                <td className="border border-gray-300 px-6 py-3 text-[#0F172A]">
                                                    {milestone.title}
                                                </td>
                                                <td className="border border-gray-300 px-6 py-3 text-[#0F172A]">
                                                    {milestone.amount}
                                                </td>
                                                <td className="border border-gray-300 px-6 py-3 text-[#0F172A]">
                                                    <button
                                                        onClick={download_doc(
                                                            milestone.mile_id
                                                        )}
                                                        className="text-black hover:underline"
                                                    >
                                                        Download Milestone
                                                        Documentation
                                                    </button>
                                                </td>
                                                <td className="border border-gray-300 px-6 py-3 text-[#0F172A]">
                                                    <div className="flex space-x-2">
                                                        <button className="px-3 py-1 rounded bg-green-500 text-white">
                                                            Done
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-6 py-3 text-[#0F172A]">
                                                    {"-"}
                                                </td>


                                                <td className="bg-gray-200 text-green-700 border border-gray-300 px-6 py-3 text-[#0F172A]">
                                                    {milestone.time_left}
                                                </td>
                                            </tr>
                                        ))}

                                    {miles
                                        .filter(
                                            (milestone) =>
                                                milestone.status ===
                                                    "In Progress" ||
                                                milestone.status === "To Do"
                                        )
                                        .map((milestone, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-100"
                                            >
                                                <td className="border border-gray-300 px-6 py-3 text-[#0F172A]">
                                                    {milestone.title}
                                                </td>
                                                <td className="border border-gray-300 px-6 py-3 text-[#0F172A]">
                                                    {milestone.amount}
                                                </td>
                                                <td className="border border-gray-300 px-6 py-3 text-[#0F172A]">
                                                    <button
                                                        onClick={download_doc(
                                                            milestone.mile_id
                                                        )}
                                                        className="text-black hover:underline"
                                                    >
                                                        Download Milestone
                                                        Documentation
                                                    </button>
                                                </td>
                                                <td className="border border-gray-300 px-6 py-3 text-[#0F172A]">
                                                    <div className="flex space-x-2">
                                                        {milestone.status ===
                                                            "To Do" && (
                                                            <button className="px-3 py-1 rounded bg-gray-200 text-gray-700">
                                                                To Do
                                                            </button>
                                                        )}
                                                        {milestone.status ===
                                                            "In Progress" && (
                                                            <button className="px-3 py-1 rounded bg-yellow-500 text-white">
                                                                In Progress
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                
                                                {milestone.id && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        to={
                                                            "/raise-dispute/" +
                                                            btoa(
                                                                btoa(
                                                                    milestone.id
                                                                )
                                                            ) +
                                                            "/" +
                                                            milestone.title
                                                        }
                                                        className="bg-yellow-300 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md"
                                                    >
                                                        Raise Dispute
                                                    </Link>
                                                </td>
                                            )}


                                                <td className="border border-gray-300 px-6 py-3 text-[#0F172A]">
                                                    {milestone.time_left}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table> 

                            {booked && !isPaid &&
                                <div className="float-right my-4 px-4" style={{height:'100px'}}>
                                <p className="text-center text-md"><b>Total Service Fee:</b> ${serviceFee}</p>

                                <button
                                    onClick={() =>
                                        handlePay(
                                            firstMileId,
                                            serviceFee
                                        )
                                    }
                                    className="px-4 py-1 mt-3 float-right rounded bg-green-800 text-gray-200"
                                >
                                    Pay Now
                                </button>
                                                    
                            </div>
                            }

                        </div>


                        <ToastContainer />
                        <Modal
                            isOpen={isAuthModalOpen}
                            onClose={() => setIsAuthModalOpen(false)}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default MilestonePage;
