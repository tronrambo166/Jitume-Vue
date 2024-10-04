import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import React from "react";

const MilestonePage = () => {
    const { id } = useParams();
    const listing_id = atob(atob(id));
    const [miles, setMiles] = useState([]);
    const [hasMile, setHasmile] = useState(false);

    useEffect(() => {
        const getMilestones = () => {
            axiosClient
                .get("/getMilestones/" + listing_id)
                .then(({ data }) => {
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
                    
                    console.log(data.data)
                })
                .catch((err) => {
                    console.log(err);
                    setMiles([]);
                    setHasmile(true);
                });
        };
        getMilestones();
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
        <div className="container mx-auto p-5">
            <h3 className="text-left my-5 text-2xl font-bold">Milestones</h3>

            {/* Dynamically Render Steps */}
            <div className="flex justify-center items-center mb-8">
                {miles.map((milestone, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                    index === miles.length - 1
                                        ? "bg-gray-200 text-gray-700" // Highlight the last step as active
                                        : "bg-green text-white" // Highlight the other steps as inactive
                                }`}
                            >
                                {index + 1}
                            </div>
                            <span className="mt-2 text-sm">
                                Step {index + 1}
                            </span>
                        </div>
                        {index < miles.length - 1 && (
                            <div className="w-12 border-t-2 border-gray-300"></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">
                            Milestone Name
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                            Amount
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                            Documentation
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {miles.map((milestone, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">
                                {milestone.title}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {milestone.amount}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={download_doc(milestone.id)}
                                    className="text-black hover:underline"
                                >
                                    Download Milestone Documentation
                                </button>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <div className="flex space-x-2">
                                    <button
                                        className={`px-3 py-1 rounded ${
                                            milestone.status === "In Progress"
                                                ? "bg-green text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        {milestone.status}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MilestonePage;
