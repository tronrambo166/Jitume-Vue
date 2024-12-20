import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";

import "rc-slider/assets/index.css";
import BackBtn from "./BackBtn";
const RaiseDispute = () => {

    const [business, setBusiness] = useState([]);
    const [loading, setLoading] = useState(true);
    const [maxPrice, setMaxPrice] = useState(100);

    const getListings = () => {
            setLoading(true);
            axiosClient
                .get("/latBusiness")
                .then(({ data }) => {
                    //setLoading(false);
                    setBusiness(data.data);
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                    //setLoading(false);
                });
        };

    useEffect(() => {
        getListings();
    }, []);

    const [project, setProject] = useState("");
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");

    const handleDropdownToggle = (e) => {
        setReason(e.target.value); // Close if already open
    };
    const handleNameChange = (e) => {
        setProject(e.target.value); // Close if already open
    };
    const handleDetails = (e) => {
        setDetails(e.target.value); // Close if already open
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //const project = $('#project-name').val();
        const payload = {
            project_id:parseInt(project),
            reason:reason,
            details:details,
        }
        console.log(payload); return;
        // if (email == "" || email == null) {
        //     showAlert("error", "Please enter your email!");
        //     return;
        // }

       const response = await axiosClient.post(
                "raise-dispute", payload);
        console.log(response);
        if (response.data.status == 200) 
        alert(response.data.message); //showAlert 
        else 
            alert("error", "Something went wrong!");
    };

    
        return (
        <div
            style={{
                fontFamily: "Arial, sans-serif",
                maxWidth: "75%",
                margin: "40px auto",
                backgroundColor: "rgb(254 254 254)",
                padding: "30px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
        <BackBtn/>
            <h1 className="h1" style={{ fontSize:"30px", textAlign: "center", color: "#333", marginBottom: "20px" }}>
                Resolution Center
            </h1>

            {/* Current Disputes Section */}
            {/* <div style={{ marginBottom: "30px" }}>
                <h2 style={{ fontSize: "20px", color: "#0056b3", marginBottom: "15px" }}>
                    Current Disputes
                </h2>
                <p>View and manage your ongoing disputes below:</p>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Dispute ID</th>
                            <th style={tableHeaderStyle}>Project Name</th>
                            <th style={tableHeaderStyle}>Status</th>
                            <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={tableCellStyle}>#12345</td>
                            <td style={tableCellStyle}>Website Design</td>
                            <td style={tableCellStyle}>Under Review</td>
                            <td style={tableCellStyle}>
                                <button style={buttonStyle}>View Details</button>
                            </td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>#12346</td>
                            <td style={tableCellStyle}>Logo Design</td>
                            <td style={tableCellStyle}>Resolved</td>
                            <td style={tableCellStyle}>
                                <button style={buttonStyle}>View Details</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            */}

            {/* Raise a New Dispute Section */}
            <div style={{ marginBottom: "30px" }}>
                <h2 style={{ fontSize: "20px", color: "black", marginBottom: "7px" }}>
                    Raise a New Dispute
                </h2>
                <p style={{ marginBottom: "12px" }}>If you are facing an issue with a project, raise a dispute here:</p>
                
                <form onSubmit={handleSubmit} method="POST">
                    <div style={formGroupStyle}>
                        <label htmlFor="project-name" style={labelStyle}>
                            Project or Business Name
                        </label>
                        <select
                    name="business_id"
                    className="flex-1 border rounded-lg p-2 focus:outline-none"
                    onChange={handleNameChange}
                    required
                >
                    <option value="" hidden>
                        Select Business
                    </option>
                    {business.map((business) => (
                        <option key={business.id} value={business.id}>
                            {business.name}
                        </option>
                    ))}
                </select>
                    </div>
                    <div style={formGroupStyle}>
                        <label htmlFor="dispute-reason" style={labelStyle}>
                            Reason for Dispute
                        </label>
                        <select
                        onChange={handleDropdownToggle} id="dispute-reason" name="dispute-reason" style={inputStyle} required>
                            <option value="">Select a reason</option>
                            <option value="non-delivery">Non-Delivery of Services</option>
                            <option value="partial-delivery">Partial Delivery</option>
                            <option value="quality-issues">Quality Issues</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div style={formGroupStyle}>
                        <label htmlFor="details" style={labelStyle}>
                            Details
                        </label>
                        <textarea
                            id="details"
                            name="details"
                            style={textareaStyle}
                            placeholder="Provide detailed information about the dispute"
                            rows="5"
                            onKeyUp={handleDetails}
                            required
                        ></textarea>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button type="submit" style={buttonStyle}>
                            Submit Dispute
                        </button>
                    </div>
                </form>
            </div>

            {/* Support Section */}
            <div>
                <h2 style={{ fontSize: "20px", color: "rgb(0 179 138)", marginBottom: "15px" }}>
                    Contact Support
                </h2>
                <p>If you need further assistance, contact our support team:</p>
                <ul>
                    <li>Email: <a href="mailto:support@jitume.com">support@jitume.com</a></li>
                    <li>Live Chat: Available on your dashboard</li>
                </ul>
            </div>
        </div>
    );
};

const tableHeaderStyle = {
    padding: "12px",
    backgroundColor: "#f2f2f2",
    border: "1px solid #ddd",
    color: "#333",
    textAlign: "left",
};

const tableCellStyle = {
    padding: "12px",
    border: "1px solid #ddd",
};

const buttonStyle = {
    padding: "10px 15px",
    backgroundColor: "rgb(0 179 138)",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
};

const formGroupStyle = {
    marginBottom: "15px",
};

const labelStyle = {
    display: "block",
    marginBottom: "10px",
    fontWeight: "bold",
    fontSize:"14px",
};

const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
};

const textareaStyle = {
    ...inputStyle,
    resize: "vertical",
};

export default RaiseDispute;
