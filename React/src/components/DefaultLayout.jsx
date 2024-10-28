import { Outlet, useLocation } from 'react-router-dom';
import { useStateContext } from '../contexts/contextProvider';
import axiosClient from "../axiosClient";
import Topsection from "./Landing-page/Topsection"
import Footer from "./Landing-page/Footer"
import Navbar from "./Landing-page/Navbar"
import Nav2 from './Landing-page/global/Nav2'

import NavbarGuest from './partials/NavbarGuest';
import Navbar_old from './partials/Navbar';

export default function DefaultLayout() {
  const { token } = useStateContext();
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isHome = location.pathname.startsWith('/home');

  return (
      <div id="defaultLayout" className="relative z-20">
          {/*{!token ? <Nav2 /> : <Navbar />}*/}
          {/*{!isHome ? <Nav2 /> : <Topsection />}*/}
          {location.pathname === "/services" ? null : window.location
                .pathname === "/" || window.location.pathname === "/home" ? (
              <Topsection />
          ) : (
              <Nav2 />
          )}{" "}
          <main>
              <Outlet />
          </main>
          <Footer />
          {/* Conditionally render Footer */}
          {/*{!isDashboardRoute && <Footer />}*/}
      </div>
  );
}
