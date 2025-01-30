import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextProvider";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAlert } from "../partials/AlertContext";
import TujitumeLogo from "../../images/Tujitumelogo.svg";
const EquipmentRelease = () => {
    const { token, setUser, setAuth, auth } = useStateContext();
    const { b_owner_id } = useParams();
    const { manager_id } = useParams();
    const { bid_id } = useParams();
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
                "You have cancelled the process ,You can again go back to inbox and choose to proceed."
            );
            setTimeout(() => {
                                navigate("/");
                            }, 3000);// Prevent further execution

        }

        if (b_owner_id && manager_id) {
            setLoading(true);

            axiosClient
                .get("releaseEquipment/" + b_owner_id + "/" + manager_id + "/"+ bid_id)
                .then((data) => {
                    console.log(data);
                    if (data.status == 200) {
                        showAlert(
                        "info",
                        "Equipment Released."
                    ); //console.log(data);
                        setTimeout(() => { navigate('/dashboard'); }, 2000);
                        const content = `
                            <img src="${TujitumeLogo}" alt="Tujitume Logo" style="max-width: 100px; margin-right: 10px;" class="jconfirm-logo">
                            <div>
                                The process has begun between the parties below...
                                <br> <b>Business:</b> ${data.business}
                                <br> <b>Business Owner:</b> ${data.owner}
                                <br> <b>Project Manager:</b> ${data.manager}
                                <br> <b>Investor:</b> ${data.investor}
                                <br> Go to the dashboard to see status.
                            </div>
                        `;
                        // $.confirm({
                        //         title: false,
                        //         content: content,
                        //         buttons: {
                        //             ok: function () {
                        //                 navigate("/dashboard");
                        //             },
                        //             home: function () {
                        //                 navigate("/");
                        //             },
                        //             cancel: function () {
                        //                 $.alert("Canceled!");
                        //             },
                        //         },
                        //     });
                    }
                    else{
                        showAlert("error", data.message);
                    }
                })
                .catch((error) => {
                    console.log(error);
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
        <div className="border min-h-screen flex justify-center items-center p-6">
            <div className="border card py-5 mx-auto w-full sm:w-1/2" id="cancel">
                <div className="text-center mb-6">
                    <h5 className="text-xl font-semibold">
                        Do you want to release equipment now?
                    </h5>
                </div>

                {!token ? (
                <div className="mb-6">
                    <div className="w-75 h-100 py-5 my-5 my-auto justify-content-center my-2 text-center mx-auto">
                        <button
                            // onClick={() => setIsAuthModalOpen(true)}
                            className=" py-2 px-6 rounded-xl mt-3"
                        >
                            {" "}
                            Sign in To View{" "}
                        </button>
                    </div>
                </div>
            ):(
            <div className="card-body py-5 mb-5">
                    <div className="w-3/4 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <button
                            className={`w-full py-2 px-3 bg-green-500 rounded-lg text-white font-semibold flex justify-center items-center ${
                                loading ? "opacity-50" : ""
                            }`}
                            onClick={releaseEquipment("yes")} // No need for an additional wrapper
                            disabled={loading}
                        >
                            {loading ? (
                                <AiOutlineLoading3Quarters className="mr-2 animate-spin" />
                            ) : (
                                <small>YES</small>
                            )}
                        </button>

                        <button
                            className="w-full py-2 px-3 bg-red-500 rounded-lg text-white text-center font-semibold"
                            onClick={releaseEquipment("no")} // No need for an additional wrapper
                        >
                            <small>Cancel</small>
                        </button>
                    </div>
                </div>
                )}

            </div>
        </div>
    );
};

export default EquipmentRelease;
