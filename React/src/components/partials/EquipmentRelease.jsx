import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextProvider";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAlert } from "../partials/AlertContext";

const EquipmentRelease = () => {
    const { token, setUser, setAuth, auth } = useStateContext();
    const { b_owner_id } = useParams();
    const { manager_id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    // useEffect(()=> {
    const releaseEquipment = (status) => (e) => {
        e.preventDefault();

        if (status == "no") {
            showAlert(
                "info",
                "You have cancelled the process ,You can always go back to inbox and choose to proceed."
            );
            return; // Prevent further execution

            // navigate("/");
        }

        if (b_owner_id && manager_id) {
            setLoading(true);

            axiosClient
                .get("releaseEquipment/" + b_owner_id + "/" + manager_id)
                .then((data) => {
                    console.log(data);
                    if (data.status == 200) {
                        showAlert("success", "The process has begun");
                        // navigate("/");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert("Something went wrong!");
                })
                .finally(() => {
                    setLoading(false); // Stop loading
                });
        } else {
            showAlert("error", "An error occurred. Please try again later.");
        }
    };
    // }, []);

    return (
        //     <div className="p-6 max-w-screen-xl mx-auto">

        //  <div className="card py-5" id="cancel" style={{width:'50%', margin:'auto'}}  >
        //           <div className="">
        //             <h5 className="" style={{marginLeft:'30px'}} id="">Do you want to release equipment now?</h5>

        //           </div>
        //           <div className="card-body py-5 mb-5">
        //             <div className="row w-75 mx-auto" >

        //                 <div style={{display:'inlineBlock'}} className="col-md-6">
        //                 <button style=
        //                 {{width:'30%', background:'#108946', padding:'10px',display:'block',borderRadius:'10px', color:'white'}} className="my-3 primary_bg text-center text-light"
        //                  target="_blank" onClick={releaseEquipment('yes')} >
        //                    <small><b>OK</b></small>
        //                 </button>
        //                 </div>

        //                 <div style={{display:'inlineBlock'}} className="col-md-6">
        //                 <button style={{width:'30%', padding:'10px',display:'block',borderRadius:'10px', color:'white', background:'red'}} onClick={releaseEquipment('no')} className=" border bg-success border-dark text-center">
        //                 <span className="text-dark" aria-hidden="true"><small>Cancel</small></span>
        //                 </button>

        //                 </div>
        //         </div>
        //       </div>
        //     </div>

        //     </div>
        <div className="min-h-screen flex justify-center items-center p-6">
            <div className="card py-5 mx-auto w-full sm:w-1/2" id="cancel">
                <div className="text-center mb-6">
                    <h5 className="text-xl font-semibold">
                        Do you want to release equipment now?
                    </h5>
                </div>
                <div className="card-body py-5 mb-5">
                    <div className="w-3/4 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <button
                            className={`w-full py-3 bg-green-700 rounded-lg text-white font-semibold flex justify-center items-center ${
                                loading ? "opacity-50" : ""
                            }`}
                            onClick={releaseEquipment("yes")} // No need for an additional wrapper
                            disabled={loading}
                        >
                            {loading ? (
                                <AiOutlineLoading3Quarters className="mr-2 animate-spin" />
                            ) : (
                                <small>OK</small>
                            )}
                        </button>

                        <button
                            className="w-full py-3 bg-red-700 rounded-lg text-white text-center font-semibold"
                            onClick={releaseEquipment("no")} // No need for an additional wrapper
                        >
                            <small>Cancel</small>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentRelease;
