import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../axiosClient";
import React from "react";
import BusinessStepHero from "../Heros/BusinessStepHero";
import BackBtn from "./BackBtn";
import { BarLoader } from "react-spinners";
const MilestonePage = () => {
    const { id } = useParams();
    const listing_id = atob(atob(id));
    const [miles, setMiles] = useState([]);
    const [hasMile, setHasmile] = useState(false);
    const [dispute, setDispute] = useState(false);
    const [loading, setLoading] = useState(true); // Set to true when data is being loaded

    useEffect(() => {
        const getMilestones = () => {
            axiosClient
                .get("/getMilestones/" + listing_id)
                .then(({ data }) => {
                    setLoading(false);
                    if (Array.isArray(data.data)) {
                        setMiles(data.data);
                        if (data.data.length === 0) {
                            setHasmile(true);
                        }
                    } else {
                        console.error("API did not return an array:", data);
                        setMiles([]);
                        setHasmile(true);
                    }

                    console.log(data.data);
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err);
                    setMiles([]);
                    setHasmile(true);
                });
        };

        const checkDispute = () => {
            axiosClient
                .get("/checkDispute/" + listing_id + '/B')
                .then(({ data }) => {
                    console.log(data);
                    if (data.status == 200) setDispute(data.dispute);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        getMilestones();
        checkDispute();
    }, [listing_id]);

    const handleStatusChange = (milestoneName, status) => {
        // Update milestone status logic here
    };

    // DOWNLOAD
    const download_doc = (mile_id) => (e) => {
        axiosClient({
            url: "download_milestoneDoc/" + listing_id + "/" + mile_id,
            method: "GET",
            responseType: "blob",
        }).then((data) => {
            console.log(data);
            if (data.data.size === 3) {
                alert(
                    "The business has no such document or the file not found!"
                );
            } else {
                const href = URL.createObjectURL(data.data);
                const link = document.createElement("a");
                link.href = href;

                if (
                    data.data.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ) {
                    link.setAttribute("download", "milestone.docx");
                } else {
                    link.setAttribute("download", "milestone.pdf");
                }

                document.body.appendChild(link);
                link.click();
            }
        });
    };

    // Calculate the number of steps based on the milestones count
    const totalSteps = miles.length;

    return (
        <>
            <BusinessStepHero />
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
                    <div className="flex justify-center my-10">
                        <BarLoader width="100%" color="#198754" />
                    </div>
                ) : (
                    <>
                        {/* Dynamically Render Steps */}
                        <div className="flex justify-center px-8 lg:px-96 lg:mb-6 sm:px-8">
                            <div className="flex justify-center items-center mb-8 space-x-2 sm:space-x-4 container max-w-screen-md">
                                {miles.map((milestone, index) => (
                                    <React.Fragment key={index}>
                                        {/* Step and Number */}
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base ${
                                                    index === miles.length - 1
                                                        ? "bg-white border border-gray-400 text-gray-700" // Inactive step: white with gray border
                                                        : "bg-[#198754] text-white" // Completed steps
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <span className="text-xs sm:text-sm text-gray-600">
                                                Step {index + 1}
                                            </span>
                                        </div>

                                        {/* Centered Dots */}
                                        {index < miles.length - 1 && (
                                            <div className="flex-grow h-1 mx-2 sm:mx-4 flex items-center">
                                                <div className="w-full border-t-2 border-dashed border-gray-400"></div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="overflow-x-auto  sm:rounded-lg  mx-auto border border-gray-300">
                            <table className="min-w-full bg-white border-collapse">
                                <thead className="bg-[#E5E7EB]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#334155] uppercase tracking-wider">
                                            Milestone Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#334155] uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#334155] uppercase tracking-wider hidden sm:table-cell">
                                            Documentation
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#334155] uppercase tracking-wider">
                                            Status
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#334155] uppercase tracking-wider">
                                            Resolution
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#334155] uppercase tracking-wider">
                                            Due
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {miles.map((milestone, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#334155]">
                                                {milestone.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#334155]">
                                                {milestone.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell">
                                                <button
                                                    onClick={download_doc(
                                                        milestone.id
                                                    )}
                                                    className="text-[#334155] hover:underline transition duration-200"
                                                >
                                                    Download Milestone
                                                    Documentation
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap  text-start">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                                                        milestone.status ===
                                                        "In Progress"
                                                            ? "bg-[#198754] text-white"
                                                            : "bg-black text-white"
                                                    }`}
                                                >
                                                    {milestone.status}
                                                </span>
                                            </td>

                                            {dispute && (
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
                                                            milestone.title+
                                                            "/" +
                                                            "B"
                                                        }
                                                        className="bg-yellow-300 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md"
                                                    >
                                                        Raise Dispute
                                                    </Link>
                                                </td>
                                            )}

                                            <td className="px-6 py-4 whitespace-nowrap  text-start">
                                                <span className="bg-gray-200 text-green-700 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md">
                                                    {milestone.time_left}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default MilestonePage;
