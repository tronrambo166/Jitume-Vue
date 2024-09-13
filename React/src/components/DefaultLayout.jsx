import { Outlet, useLocation } from 'react-router-dom';
import { useStateContext } from '../contexts/contextProvider';
import axiosClient from "../axiosClient";
import NavbarGuest from './partials/NavbarGuest';
import Navbar from './partials/Navbar';
import Footer from './partials/footer';

export default function DefaultLayout() {
  const { token } = useStateContext();
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div id="defaultLayout" className="bg-white bg-dark-bg flex flex-col min-h-screen">
      {!token ? <NavbarGuest /> : <Navbar />}
      <main>
        <Outlet />
      </main>
      {/* Conditionally render Footer */}
      {!isDashboardRoute && <Footer />}
    </div>
  );
}
