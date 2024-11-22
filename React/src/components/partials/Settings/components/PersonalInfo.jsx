import React, { useState, useEffect } from "react";
import { FaCamera, FaPen } from "react-icons/fa";
import { useAlert } from "../../../partials/AlertContext"; // Import useAlert context
import Img from "../../../../assets/profile.png"; // Default Image
import axiosClient from "../../../../axiosClient";

const PersonalInfo = () => {
    const { showAlert } = useAlert();

    const [isEditing, setIsEditing] = useState(false);

    const [imageFile, setImageFile] = useState(null); // Store the image file
    const [imagePreview, setImagePreview] = useState(Img); // Store the image preview URL
    const [isFormChanged, setIsFormChanged] = useState(false); // Track form changes
    const [user, setUser] = useState({});

    const initialState = {
        fname: 'John',
        mname: "Entreprenuer",
        lname: "Doe",
        gender: "Male",
        dob: { month: "January", day: "1", year: "2000" },
        email: "john.doe@example.com",
        image: Img, // Default avatar image
    };
    const [formData, setFormData] = useState(initialState);
    const [tempData, setTempData] = useState(initialState);

    useEffect(() => {
        // Compare the current form data with the original form data and set the isFormChanged state
        const isDataChanged =
            JSON.stringify(formData) !== JSON.stringify(tempData) ||
            imageFile !== null;
        setIsFormChanged(isDataChanged); // Set true if changes exist

        //Get Details
        axiosClient
            .get("/checkAuth")
            .then(({ data }) => {
                setUser(data.user);
                console.log(user.fname)
            }).catch(() => {
                showAlert("error", "Failed to load user data. Redirecting...");
                navigate("/");
            });
        

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
            setImageFile(file); // Store the image file
            setImagePreview(URL.createObjectURL(file)); // Generate the image preview URL
        }
    };

    const validateForm = () => {
        const { firstName, middleName, lastName, email } = tempData;

        // Name Validation
        const nameRegex = /^[a-zA-Z]+$/;
        if (!nameRegex.test(firstName)) {
            showAlert("error", "First name must only contain letters.");
            return false;
        }
        if (!nameRegex.test(middleName)) {
            showAlert("error", "Middle name must only contain letters.");
            return false;
        }
        if (!nameRegex.test(lastName)) {
            showAlert("error", "Last name must only contain letters.");
            return false;
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert("error", "Please enter a valid email address.");
            return false;
        }

        return true;
    };

    const saveChanges = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Add the image file to the formData when saving
            setFormData({
                ...tempData,
                avatar: imageFile ? imageFile : formData.avatar, // Use the new image file if provided, otherwise keep the old one
            });
            setIsEditing(false);


            const response = await axiosClient.post(
                `/business/update-profile`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Handle response statuses
            console.log(response)
                if (response.data.status === 200) {
                    showAlert("success", "Profile updated successfully!");
                } else {
                    showAlert(
                        "error",
                        response.data.message || "Something went wrong."
                    );
                }

            
            console.log("Updated Form Data:", {
                ...formData,
                avatar: imageFile,
            }); // Log the updated form data with the new image
        }
    };

    const discardChanges = () => {
        setTempData(formData);
        setIsEditing(false);
        setImagePreview(formData.avatar); // Revert image preview to the original
        setImageFile(null); // Clear the image file
        showAlert("info", "Changes were not saved.");
    };

    const handleEditClick = () => {
        setIsEditing(true);
        showAlert(
            "info",
            "Edit mode activated! You can now update your profile."
        );
    };

    const hasUnsavedChanges = isFormChanged; // Use the isFormChanged state to track unsaved changes

    return (
        <div className="p-6 md:p-10 rounded-lg w-full max-w-4xl mx-auto bg-white ">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-3 md:mb-0">
                    Personal Information
                </h2>
                <div className="relative group cursor-pointer">
                    <FaPen
                        className="text-gray-600 text-xl hover:text-green-500 transition duration-200"
                        onClick={handleEditClick}
                    />
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out z-20">
                        Edit Profile
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-3 h-3 bg-white rotate-45"></div>
                    </div>
                </div>
            </div>

            {/* Avatar Section */}
             <div className="relative w-36 h-36 mb-8">
                <div className="w-36 h-36 rounded-lg overflow-hidden group">
                    <img
                        src={imagePreview} // Display the preview image
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
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
                        onChange={handleImageChange} // Handle image change
                    />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    {imageFile ? imageFile.name : "Click to upload"}{" "}
                    {/* Show file name */}
                </p>
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    {
                        label: "First Name",
                        name: "firstName",
                        value: tempData.firstName,
                    },
                    {
                        label: "Middle Name",
                        name: "middleName",
                        value: tempData.middleName,
                    },
                    {
                        label: "Last Name",
                        name: "lastName",
                        value: tempData.lastName,
                    },
                    { label: "Email", name: "email", value: tempData.email },
                ].map((field, index) => (
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

                {/* Gender Field */}
                <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Gender
                    </label>
                    <select
                        name="gender"
                        value={tempData.gender}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg p-3 bg-white border border-gray-300 text-gray-900 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                        disabled={!isEditing}
                    >
                        <option value="">Select Gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Non-Binary">Non-Binary</option>
                    </select>
                </div>

                {/* Date of Birth Field */}
                <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Date of Birth
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        <select
                            name="dobMonth"
                            value={tempData.dob.month}
                            onChange={(e) =>
                                setTempData((prev) => ({
                                    ...prev,
                                    dob: { ...prev.dob, month: e.target.value },
                                }))
                            }
                            className="w-full rounded-lg p-3 bg-white border border-gray-300 text-gray-900 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                            disabled={!isEditing}
                        >
                            {[
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                            ].map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>

                        <select
                            name="dobDay"
                            value={tempData.dob.day}
                            onChange={(e) =>
                                setTempData((prev) => ({
                                    ...prev,
                                    dob: { ...prev.dob, day: e.target.value },
                                }))
                            }
                            className="w-full rounded-lg p-3 bg-white border border-gray-300 text-gray-900 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                            disabled={!isEditing}
                        >
                            {[...Array(31).keys()].map((i) => (
                                <option key={i} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>

                        <select
                            name="dobYear"
                            value={tempData.dob.year}
                            onChange={(e) =>
                                setTempData((prev) => ({
                                    ...prev,
                                    dob: { ...prev.dob, year: e.target.value },
                                }))
                            }
                            className="w-full rounded-lg p-3 bg-white border border-gray-300 text-gray-900 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                            disabled={!isEditing}
                        >
                            {[...Array(100).keys()].reverse().map((i) => (
                                <option
                                    key={i}
                                    value={new Date().getFullYear() - i}
                                >
                                    {new Date().getFullYear() - i}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-between gap-4">
                {isEditing && (
                    <>
                        <button
                            onClick={discardChanges}
                            className="px-6 py-3 rounded-md text-sm font-semibold bg-gray-300 text-gray-900 transition duration-200 hover:bg-gray-400"
                        >
                            Discard Changes
                        </button>
                        <button
                            onClick={saveChanges}
                            disabled={!isFormChanged}
                            className={`px-6 py-3 rounded-md text-sm font-semibold ${
                                isFormChanged
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-400 text-gray-700"
                            } transition duration-200`}
                        >
                            Save Changes
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PersonalInfo;
