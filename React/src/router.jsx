import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import Homepage from "./components/pages/Homepage";
import Servicepage from "./components/pages/Servicepage";
import ListingResults from "./components/partials/listingResults";
import ListingDetails from "./components/partials/ListingDetails";
import Test from "./contexts/Test";
// Dashboard Components
import Dashboard from "./components/pages/Dashboard";
import MyBusinesses from "./components/dashboard/business/MyBusinesses";
import Dashhome from "./components/partials/Dashhome";
import AddMilestone from "./components/dashboard/business/Addmilestone";
import Milestones from "./components/dashboard/business/Milestone";
import InvestmentBids from "./components/dashboard/business/InvestmentBids";
import AddService from "./components/dashboard/Service/Addservice";
import ServiceMilestone from "./components/dashboard/Service/ServiceMilestone";
import ServiceBookings from "./components/dashboard/Service/Servicebookings";
import Messages from "./components/partials/Messages";
import AccountPage from "./components/dashboard/business/AccountPage";
import PaymentForm from "./components/partials/PaymentForm";
import ServiceDetails from "./components/partials/ServiceDetails";
import MilestonesPage from "./components/partials/Milestonepage";
import MilestonesPageS from "./components/partials/MilestonepageS";
import ServiceResults from "./components/partials/Serviceresults";
import Subscribepage from "./components/partials/Subscribepage";
import Mile from "./components/partials/mile";
import Invest from "./components/partials/Investequip";
import ServiceTable from "./components/dashboard/Service/servicestable";
import CategoryPage from "./components/partials/Categorypage";
import ProjectManagers from "./components/partials/ProjectResults";
import EquipmentRelease from "./components/partials/EquipmentRelease";
import Addservicemilestone from "./components/dashboard/Service/Addservicemilestone";
import MyBookings from "./components/dashboard/Service/Mybookings";
import AddBusinesS from "./components/dashboard/business/AddBusiness";
import ServiceCategory from "./components/partials/ServiceCategory";
import Settings from "./components/partials/Settings/Settings";
import MySubscription from "./components/dashboard/mysubscription/MySubscription";
// Footer Components
import Careers from "./components/footer-pages/Careers";
import ReferAbusiness from "./components/footer-pages/ReferAbusiness";
import HelpCenter from "./components/footer-pages/HelpCenter";
import KnowledgeHub from "./components/footer-pages/KnowledgeHub";
import Partner from "./components/footer-pages/Partner";
import WhatIsJitume from "./components/footer-pages/WhatIsJitume";
import DueDiligence from "./components/footer-pages/DueDiligence";
import RaiseDispute from "./components/partials/RaiseDispute";
import Dispute from "./components/footer-pages/Dispute";
import Tutorials from "./components/footer-pages/Tutorials";
// Portals
import InvestmentCapital from "./components/Landing-page/Portals/InvestmentCapitalPortal/InvestmentCapital";
import GrantFunding from "./components/Landing-page/Portals/GrantFundingPortal/GrantFunding";
// // src/components/ScrollToTop.js
import ScrollToTop from "./components/partials/ScrollToTop";
import { GrantsOverview } from "./components/Grants/screens/Grantsoverview";
import DashboardHome from "./components/Grants/components/Grantshome";
import InvestmentDashboard from "./components/Grants/screens/InvestmentDashboard";
import DealRoom from "./components/Grants/screens/Dealroom";
import TujitumeGrantPortal from "./components/Grants/screens/Grantsportal";
import TujitumeDashboard from "./components/Grants/screens/Analytics";
import ProfilePage from "./components/Grants/screens/Investorprofile";
import PitchDashboard from "./components/Grants/screens/PitchDeck";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                {/* <ScrollToTop /> */}
                <DefaultLayout />
            </>
        ),
        children: [
            { path: "/", element: <Homepage /> },
            { path: "/home", element: <Homepage /> },
            { path: "/services", element: <Servicepage /> },
            {
                path: "/listingResults/:resIds/:loc",
                name: "listingResults",
                element: <ListingResults />,
            },
            { path: "/listing/:id", element: <ListingDetails /> },
            { path: "/service-details/:id", element: <ServiceDetails /> },
            {
                path: "/asset-service-details/:id/:bid_id",
                element: <ServiceDetails />,
            },
            { path: "/business-milestones/:id", element: <MilestonesPage /> },
            { path: "/service-milestones/:id", element: <MilestonesPageS /> },
            {
                path: "/raise-dispute/:id/:name/:type",
                element: <RaiseDispute />,
            },

            {
                path: "/serviceresults/:resIds/:loc",
                name: "serviceresults",
                element: <ServiceResults />,
            },
            {
                path: "/projectManagers/:resIds/:loc/:bid_id",
                element: <ProjectManagers />,
            },
            {
                path: "/equipmentRelease/:b_owner_id/:manager_id/:bid_id",
                element: <EquipmentRelease />,
            },
            { path: "/subscribe/:id", element: <Subscribepage /> },
            { path: "/checkout", element: <PaymentForm /> },
            { path: "/category/:name", element: <CategoryPage /> },
            { path: "/servicecategory/:name", element: <ServiceCategory /> },

            { path: "/mile", element: <Mile /> },
            { path: "/investEquip/:amount/:id/:percent", element: <Invest /> },
            // test test
            { path: "/test", element: <Test /> },

            // test test

            //FOOTER
            { path: "/careers", element: <Careers /> },
            { path: "/refer-a-business", element: <ReferAbusiness /> },
            { path: "/help-center", element: <HelpCenter /> },
            { path: "/knowledge-hub", element: <KnowledgeHub /> },
            { path: "/partner-with-jitume", element: <Partner /> },
            { path: "/what-is-jitume", element: <WhatIsJitume /> },
            { path: "/due-diligence", element: <DueDiligence /> },
            { path: "/Resolution-center", element: <Dispute /> },
            { path: "/tutorials", element: <Tutorials /> },
        ],
    },
    {
        path: "/grants-overview",
        element: <GrantsOverview />,
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "funding/investments", element: <InvestmentDashboard /> },
          {
            path: "funding/deals",
            children: [{ path: ":opportunityId", element: <DealRoom /> }],
          },
          { path: "grants/discover", element: <TujitumeGrantPortal /> },
          // Add analytics as a child route
          { path: "analytics", element: <TujitumeDashboard /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "pitch", element: <PitchDashboard /> }


        ],
      },
      // Remove the standalone analytics route
      // { path: "/analytics", element: <TujitumeDashboard /> },
    { path: "/investment-capital", element: <InvestmentCapital /> },
    { path: "/grant-funding", element: <GrantFunding /> },

    {
        path: "/dashboard",
        element: <Dashboard />, // This ensures the Dashboard doesn't use the DefaultLayout
        children: [
            { path: "", element: <Dashhome /> },
            { path: "my-businesses", element: <MyBusinesses /> },
            { path: "add-milestone", element: <AddMilestone /> },
            { path: "milestones", element: <Milestones /> },
            { path: "investment-bids", element: <InvestmentBids /> },
            { path: "add-service", element: <AddService /> },
            { path: "service-milestone", element: <ServiceMilestone /> },
            { path: "service-bookings", element: <ServiceBookings /> },
            { path: "messages", element: <Messages /> },
            { path: "account", element: <AccountPage /> },
            { path: "payment-form", element: <PaymentForm /> },
            { path: "services-table", element: <ServiceTable /> },
            { path: "addservicemilestone", element: <Addservicemilestone /> },
            { path: "mybookings", element: <MyBookings /> },
            { path: "my-subscription", element: <MySubscription /> },
            { path: "addbusiness", element: <AddBusinesS /> },
            { path: "settings/", element: <Settings /> },
        ],
    },
]);

export default router;
