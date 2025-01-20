import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";

const LightBoxPopup = ({ image, onClose }) => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white p-1 rounded-lg z-60">
                {/* Move the button outside the image container */}
                <button
                    onClick={onClose} // Close the lightbox
                    className="absolute top-[-10px] right-[-35px]  text-white hover:text-green-400 font-bold text-2xl z-70"
                >
                    <FaTimes />
                </button>
                <div className="overflow-hidden">
                    <img
                        src={image}
                        alt="Enlarged Image"
                        className="max-w-[90vw] max-h-[90vh] object-contain"
                    />
                </div>
            </div>
        </div>,
        document.body // Render outside the component hierarchy
    );
};

export default LightBoxPopup;
