import { Outlet, useLocation } from 'react-router-dom';
import { useStateContext } from '../contexts/contextProvider';
import axiosClient from "../axiosClient";
import Topsection from "./Landing-page/Topsection"
import Footer from "./Landing-page/Footer"
import Navbar from "./Landing-page/Navbar"

import NavbarGuest from './partials/NavbarGuest';
import Navbar_old from './partials/Navbar';

export default function DefaultLayout() {
  const { token } = useStateContext();
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div id="defaultLayout" className="relative z-20">
      
      {/*{!token ? <Navbar /> : <Navbar />}*/}
      <Topsection/>
      <main>
        <Outlet />
      </main>
      <Footer/> 

      {/* Conditionally render Footer */}
      {/*{!isDashboardRoute && <Footer />}*/}
    </div>
  );
}
