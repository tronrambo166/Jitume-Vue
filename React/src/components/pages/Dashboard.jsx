import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

// Lazy load components
const Sidebar = lazy(() => import("../partials/Sidebar"));
const DashboardHero = lazy(() => import("../partials/Dashboardhero"));
const Footer = lazy(() => import("../Landing-page/global/Footer2"));

const Dashboard = () => {
    return (
        <div className="flex flex-col md:flex-row w-full h-screen">
            {/* Sidebar */}
            <div className="relative md:w-64">
                <Suspense fallback={<div>Loading Sidebar...</div>}>
                    <Sidebar />
                </Suspense>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Hero Section */}
                <div className="flex-none">
                    <Suspense fallback={<div>Loading Hero...</div>}>
                        <DashboardHero />
                    </Suspense>
                </div>

                {/* Content Area for Nested Routes */}
                <div className="flex-1 mt-4 p-4">
                    <Outlet /> {/* Render nested routes here */}
                </div>

                {/* Footer */}
                <div className="flex-none">
                    <Suspense fallback={<div>Loading Footer...</div>}>
                        <Footer />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
