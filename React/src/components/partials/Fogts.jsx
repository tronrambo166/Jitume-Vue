import { useState } from "react";
import ForgotPassModal from "./ForgotPassModal";

const ForgotPassword = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="text-center py-4">
            <a
                // href="#"
                className="text-center hover:text-green text-black underline text-[14px]"
                onClick={handleModalToggle}
            >
                Forgot Password
            </a>
            {isModalOpen && <ForgotPassModal onClose={handleModalToggle} />}
        </div>
    );
};

export default ForgotPassword;
