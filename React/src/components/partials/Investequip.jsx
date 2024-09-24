import { FaUpload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState } from "react";
import axiosClient from "../../axiosClient";
import { IoArrowBack } from "react-icons/io5"; // Import React icon
import { useNavigate } from "react-router-dom";
const Investequip = () => {
    const { amount, id, percent } = useParams();

    const [formData, setFormData] = useState({
        amount: atob(amount),
        listing_id: atob(id),
        percent: atob(percent),
        photos: null,
        legal_doc: null,
        serial: "",
        optional_doc: null,
    });

    // Handle file changes
    const handleFileChange = (e, field) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: e.target.files[0],
        }));
    };
    const handleGoBack = () => {
        navigate(-1);
    };
    const navigate = useNavigate();
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        for (const key in formData) {
            form.append(key, formData[key]);
        }

        // Convert FormData to a JSON object for logging
        const formDataObject = {};
        form.forEach((value, key) => {
            formDataObject[key] = value instanceof File ? value.name : value;
        });

        // Log the formDataObject directly
        console.log("FormData Object:", formDataObject);

        try {
            const response = await axiosClient.post("bidCommitsEQP", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.success) {
                alert(response.data.success);
            } else {
                alert(response.data.failed);
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("An error occurred while submitting the form.");
        }
    };

    return (
        <div className="mx-auto w-[700px] h-[500px] my-6 border shadow-md p-3 ">
            <button
                onClick={handleGoBack}
className="btn-primary p-4 rounded-full"            >
<IoArrowBack className="h-[30px]  w-auto" />
</button>
            <form className="my-3" onSubmit={handleSubmit}>
                <div className="flex justify-between my-3 gap-[150px] py-3">
                    <h1 className="text-[13px]">
                        Please upload good quality photos of the assets*
                    </h1>
                    <button
                        type="button"
                        className="border p-3 flex items-center"
                        onClick={() =>
                            document.getElementById("photos-input").click()
                        }
                    >
                        <FaUpload />
                    </button>
                    <input
                        id="photos-input"
                        type="file"
                        onChange={(e) => handleFileChange(e, "photos")}
                        className="hidden"
                    />
                </div>

                <div className="flex justify-between my-3 gap-[150px] py-3">
                    <h1 className="whitespace-nowrap text-[13px]">
                        Please provide legal documents that act as evidence of
                        the ownership of the Assets <br />
                        (Original purchase receipt/titles/certificates etc)*
                    </h1>
                    <button
                        type="button"
                        className="border p-3 flex items-center"
                        onClick={() =>
                            document.getElementById("legal-doc-input").click()
                        }
                    >
                        <FaUpload />
                    </button>
                    <input
                        id="legal-doc-input"
                        type="file"
                        onChange={(e) => handleFileChange(e, "legal_doc")}
                        className="hidden"
                    />
                </div>

                <div className="flex flex-col gap-2 justify-between py-3">
                    <h1 className="whitespace-nowrap text-[13px]">
                        Please provide the Asset’s make, model, and serial
                        number*
                    </h1>
                    <input
                        type="text"
                        name="serial"
                        value={formData.serial}
                        onChange={handleInputChange}
                        className="border p-3 rounded-md w-[350px] border-slate-500"
                        required
                    />
                </div>

                <div className="flex justify-between my-4 gap-[150px] py-3">
                    <h1 className="whitespace-nowrap text-[13px]">
                        Any other Asset records (Optional)
                    </h1>
                    <button
                        type="button"
                        className="border p-3 flex items-center"
                        onClick={() =>
                            document
                                .getElementById("optional-doc-input")
                                .click()
                        }
                    >
                        <FaUpload />
                    </button>
                    <input
                        id="optional-doc-input"
                        type="file"
                        onChange={(e) => handleFileChange(e, "optional_doc")}
                        className="hidden"
                    />
                </div>

                <div className="flex justify-center gap-6 items-center my-4">
                    <button
                        type="submit"
                        className="btn-primary rounded-xl py-2 px-6"
                    >
                        OK
                    </button>
                    <button
                        type="button"
                        className="bg-black text-white hover:bg-gray-700 rounded-xl py-2 px-6"
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Investequip;
