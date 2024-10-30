import { Navigate,Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/contextProvider'
import { Link } from "react-router-dom";

import Navbar from './partials/Navbar';
import NavbarGuest from './partials/NavbarGuest';
import Footer from './partials/footer';
import ServiceTable from './partials/servicestable';
import Table from './partials/Table';
import Homepage from './pages/Homepage';
import Servicepage from './pages/Servicepage';
import ListingResults from './partials/listingResults';
import ListingDetails from './partials/ListingDetails';
import PaymentForm from './partials/PaymentForm';
import ServiceDetails from './partials/ServiceDetails';
import UserRegistrationForm from './partials/Investorreg';

export default function GuestLayout() {
	const{token} = useStateContext();
	if(token){
		return <Navigate to='/'/>
	}
	return (
            <div className="bg-white bg-dark-bg flex flex-col min-h-screen">
              <NavbarGuest />

              <main>
	          <Outlet />
			  <UserRegistrationForm/>
	          </main>
			
              <Footer />
            </div>
 
  );
}
