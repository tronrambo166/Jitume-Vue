import React, { useState, useEffect } from "react";
import { FaCamera, FaPen, FaTrash } from "react-icons/fa";
import { useAlert } from "../../../partials/AlertContext";
import axiosClient from "../../../../axiosClient";
import DefaultImg from "./DefaultImg";
import ChangePassword from "./ChangePassword";

const PersonalInfo = () => {
    const { showAlert } = useAlert();
    const userImage = DefaultImg();

    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [formData, setFormData] = useState({});
    const [tempData, setTempData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Fetch user data from the API
        axiosClient
            .get("/checkAuth")
            .then(({ data }) => {
                setFormData(data.user);
                setTempData(data.user);
                //setImagePreview(data.user.image); // Assume the API returns an image URL
            })
            // .catch(() => {
            //     showAlert(
            //         "error",
            //         "Failed to load user data. Please try again."
            //     );
            // });
    }, []);

    useEffect(() => {
        const isDataChanged =
            JSON.stringify(formData) !== JSON.stringify(tempData) ||
            imageFile !== null;
        setIsFormChanged(isDataChanged);
    }, [tempData, imageFile, formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Store the file for later submission
            setImagePreview(URL.createObjectURL(file)); // Create and set the preview URL
        }
    };

    const validateForm = () => {
        const { fname, mname, lname, email } = tempData;
        const nameRegex = /^[a-zA-Z]+$/;
        if (!nameRegex.test(fname)) {
            showAlert("error", "First name must only contain letters.");
            return false;
        }
        // if (!nameRegex.test(mname)) {
        //     showAlert("error", "Middle name must only contain letters.");
        //     return false;
        // }
        if (!nameRegex.test(lname)) {
            showAlert("error", "Last name must only contain letters.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert("error", "Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const saveChanges = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSaving(true);
        const formDataToSend = new FormData();
        Object.keys(tempData).forEach((key) => {
            formDataToSend.append(key, tempData[key]);
        });
        if (imageFile) formDataToSend.append("image", imageFile);

        try {
            const response = await axiosClient.post(
                "/business/update-profile",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.status === 200) {
                setFormData(tempData);
                setIsEditing(false);
                setImageFile(null);
                showAlert("success", "Profile updated successfully!");
                notifyParent(response.data.user || tempData);
                console.log("MYRES", response);
            } else {
                showAlert(
                    "error",
                    response.data.message || "Something went wrong."
                );
            }
        } catch (error) {
            showAlert("error", "An error occurred while saving changes.");
            console.log(error);
        } finally {
            setIsSaving(false);
        }
    };

    const notifyParent = (updatedData) => {
        window.dispatchEvent(
            new CustomEvent("userUpdated", { detail: updatedData })
        );
    };

    const discardChanges = () => {
        setTempData(formData);
        setIsEditing(false);
        setImagePreview(formData.image);
        setImageFile(null);
        showAlert("info", "Changes were not saved.");
    };

    const handleEditClick = () => {
        setIsEditing(true);
        showAlert(
            "info",
            "Edit mode activated! You can now update your profile."
        );
    };
    const logImageUrl = () => {
        console.log(
            "THE IMAGE THAT IS GOING TO BE SEEN IS THIS :",
            tempData.image ? `../${tempData.image}` : userImage
        );
    };
    logImageUrl(); // This will log the image URL to the console

    // Function to check for null and return a placeholder
    const handleNullValue = (value, placeholder) => {
        return value === null || value === undefined || value === "null"
            ? placeholder
            : value;
    };

    return (
        <div className="p-6 md:p-10 rounded-lg mt-4 w-full max-w-4xl mx-auto bg-white">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-3 md:mb-0">
                    Personal Information
                </h2>
                {/* <FaPen
                    className="text-gray-600 text-xl hover:text-green-500 transition duration-200 cursor-pointer"
                    onClick={handleEditClick}
                /> */}
            </div>

            <div className="relative w-36 h-36 mb-8">
                <div className="w-36 h-36 rounded-lg overflow-hidden group">
                    {imagePreview ? (
                        <img id="img1"
                        src={ imagePreview }
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                        ):(
                        <img id="img2"
                        src={tempData.image?
                            tempData.image
                            : userImage
                        }
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                        )}

                    

                    <label
                        htmlFor="avatar-upload"
                        className={`absolute inset-0 bg-black bg-opacity-10 backdrop-filter backdrop-blur-md opacity-0 group-hover:opacity-100 rounded-lg flex justify-center items-center transition-opacity duration-300 cursor-pointer ${
                            isEditing ? "" : "hidden"
                        }`}
                    >
                        <FaCamera className="text-white text-3xl" />
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={!isEditing}
                        onChange={handleImageChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    {
                        label: "First Name",
                        name: "fname",
                        value: handleNullValue(
                            tempData.fname,
                            ""
                        ),
                    },
                    {
                        label: "Middle Name",
                        name: "mname",
                        value: handleNullValue(
                            tempData.mname,
                            ""
                        ),
                    },
                    {
                        label: "Last Name",
                        name: "lname",
                        value: handleNullValue(
                            tempData.lname,
                            ""
                        ),
                    },
                    {
                        label: "Email",
                        name: "email",
                        value: handleNullValue(
                            tempData.email,
                            ""
                        ),
                    },
                ].map((field) => (
                    <div key={field.name} className="flex flex-col">
                        <label
                            htmlFor={field.name}
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            {field.label}
                        </label>
                        <input
                            id={field.name}
                            type="text"
                            name={field.name}
                            value={field.value}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-lg p-3 bg-white border border-gray-300 text-gray-900 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                            disabled={!isEditing}
                        />
                    </div>
                ))}

                <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Gender
                    </label>
                    <select
                        name="gender"
                        value={handleNullValue(
                            tempData.gender,
                            "Gender not selected"
                        )}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg p-3 bg-white border border-gray-300 text-gray-900 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                        disabled={!isEditing}
                    >
                        <option value={tempData.gender}>{tempData.gender}</option>
                        <option value="M">M</option>
                        <option value="F">F</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                {isEditing ? (
                    <>
                        <button
                            onClick={saveChanges}
                            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            onClick={discardChanges}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
                        >
                            Discard
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleEditClick}
                        className="bg-green btn-primary text-white font-semibold py-2 px-4 rounded-lg"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
            <div className="mt-4">
                <ChangePassword />
            </div>
        </div>
    );
};

export default PersonalInfo;
