import React from "react";
import { FaBars } from "react-icons/fa";

const BarIcon = ({ toggleSidebar }) => {
    return (
        <button
            onClick={toggleSidebar}
            className="fixed top-4 right-4 z-50 p-2 bg-white border rounded-md shadow-md md:hidden"
            aria-label="Toggle Sidebar"
        >
            <FaBars size={24} />
        </button>
    );
};

export default BarIcon;
