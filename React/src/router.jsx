import { createBrowserRouter } from 'react-router-dom';
import DefaultLayout from './components/DefaultLayout';
import Homepage from './components/pages/Homepage';
import Servicepage from './components/pages/Servicepage';
import ListingResults from './components/partials/listingResults';
import ListingDetails from './components/partials/ListingDetails';

// Dashboard Components
import Dashboard from './components/pages/Dashboard';
import MyBusinesses from './components/partials/MyBusinesses';
import Dashhome from './components/partials/Dashhome';
import AddMilestone from './components/partials/Addmilestone';
import Milestones from './components/partials/Milestone';
import InvestmentBids from './components/partials/InvestmentBids';
import AddService from './components/partials/Addservice';
import ServiceMilestone from './components/partials/ServiceMilestone';
import ServiceBookings from './components/partials/Servicebookings';
import Messages from './components/partials/Messages';
import AccountPage from './components/dashboard/business/AccountPage';
import AddBusiness from './components/partials/Addbusiness';
import PaymentForm from './components/partials/PaymentForm';
import ServiceDetails from './components/partials/ServiceDetails';
import MilestonesPage from './components/partials/Milestonepage';
import MilestonesPageS from './components/partials/MilestonepageS';
import ServiceResults from './components/partials/Serviceresults';
import Subscribepage from './components/partials/Subscribepage';
import Mile from './components/partials/mile';
import Invest from './components/partials/Investequip';
import Users from './views/users'; // Ensure this path is correct
import UserForm from './views/userForm';
import Register from './views/register';
import Login from './views/login';
import ServiceTable from './components/partials/servicestable';
import CategoryPage from './components/partials/Categorypage';
import ProjectManagers from './components/partials/projectManagers';
import EquipmentRelease from './components/partials/EquipmentRelease';
import InvestorRegistration from './components/partials/Investreg';
import Addservicemilestone from './components/partials/Addservicemilestone';
import MyBookings from './components/partials/Mybookings';
import AddBusinesS from './components/dashboard/business/AddBusiness';

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            { path: "/", element: <Homepage /> },
            { path: "/home", element: <Homepage /> },
            { path: "/services", element: <Servicepage /> },
            { path: "/users", element: <Users /> },
            {
                path: "/listingResults/:resIds/:loc",
                name: "listingResults",
                element: <ListingResults />,
            },
            { path: "/listing/:id", element: <ListingDetails /> },
            { path: "/service-details/:id", element: <ServiceDetails /> },
            { path: "/asset-service-details/:id/:bid_id", element: <ServiceDetails /> },
            { path: "/business-milestones/:id", element: <MilestonesPage /> },
            { path: "/service-milestones/:id", element: <MilestonesPageS /> },
            {
                path: "/checkout/:amount/:listing_id/:percent/:purpose",
                element: <PaymentForm />,
            },
            {
                path: "/checkoutS/:listing_id/:amount/:purpose/:percent",
                element: <PaymentForm />,
            },
            {
                path: "/serviceresults/:resIds/:loc",
                name: "serviceresults",
                element: <ServiceResults />,
            },
            { path: "/projectManagers/:bid_id", element: <ProjectManagers /> },
            { path: "/equipmentRelease/:b_owner_id/:manager_id", element: <EquipmentRelease /> },
            { path: "/subscribe/:id", element: <Subscribepage /> },
            { path: "/checkout", element: <PaymentForm /> },
            { path: "/category/:name", element: <CategoryPage /> },
            { path: "/createinvestor", element: <InvestorRegistration /> },

            { path: "/mile", element: <Mile /> },
            { path: "/investEquip/:amount/:id/:percent", element: <Invest /> },
            { path: "/register", element: <Register /> },
            { path: "/login", element: <Login /> },
            { path: "/user-form", element: <UserForm /> },
        ],
    },
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
            { path: "account/:user_id", element: <AccountPage /> },
            { path: "add-business", element: <AddBusiness /> },
            { path: "payment-form", element: <PaymentForm /> },
            { path: "services-table", element: <ServiceTable /> },
            { path: "addservicemilestone", element: <Addservicemilestone /> },
            { path: "mybookings", element: <MyBookings /> },
            { path: "addbusiness", element: <AddBusinesS /> }
        ],
    },
]);

export default router;
