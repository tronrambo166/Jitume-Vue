import { Outlet } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import btmicon from "../../images/btmicon.png";
import DashboardHero from "../partials/Dashboardhero";
import Footer from "../Landing-page/global/Footer2";
import { useState } from "react";

const Dashboard = () => {
      const [isShrunk, setIsShrunk] = useState(false);

    const handleSidebarToggle = (shrunk) => {
        setIsShrunk(shrunk);
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-screen">
            {/* Sidebar */}
            <div className="relative md:w-64">
                <Sidebar onToggle={handleSidebarToggle} />
                {/* Help Section */}
                {/* <div className="fixed right-4 bottom-4 p-4 mx-auto w-[250px] h-[220px] rounded-xl bg-white z-50 md:hidden">
          <img src={btmicon} alt="Help" />
          <div className="mt-[60px]">
            <h1 className="text-gray-800 font-semibold">Need help?</h1>
            <h2 className="py-1 text-gray-600 text-[13px]">Please check our docs</h2>
            <button className="bg-gray-800 rounded-xl uppercase text-[12px] w-full px-5 py-2 text-white">
              Contact Us
            </button>
          </div>
        </div> */}
            </div>

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-500 ${
                    isShrunk ? "ml-[-220px]" : ""
                }`}
            >
                {/* Hero Section */}
                <div className="flex-none">
                    <DashboardHero />
                </div>

                {/* Content Area for Nested Routes */}
                <div className="flex-1 mt-4 p-4">
                    <Outlet /> {/* Render nested routes here */}
                </div>

                {/* Footer */}
                <div className="flex-none">{/* <Footer /> */}</div>
            </div>
        </div>
    );
};

export default Dashboard;
