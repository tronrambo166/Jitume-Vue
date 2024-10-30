import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../images/logo.png';
import calendarIcon from '../../images/calendar.svg';
import addIcon from '../../images/add.png';
import chartIcon from '../../images/chart.png';
import btmIcon from '../../images/btmicon.png';
import { FaHome, FaWrench, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import doc from "../../images/doc.png";
import sharp from "../../images/sharp.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 h-screen bg-white shadow-lg flex flex-col transition-transform duration-300 ${isOpen ? 'w-64' : 'w-16'} md:w-64 z-40`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link className='flex items-center' to="/">
          <img src={logo} alt="Logo" className={`w-[120px] ${isOpen ? 'ml-4' : 'ml-0'} transition-transform duration-300`} />
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-gray-500 md:hidden"
        >
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
      <div className="flex-1 no-scrollbar overflow-y-auto px-4">
        <ul className="space-y-2">
          <li className="nav-item py-2">
            <NavLink
              className={`navLink flex items-center gap-4 py-2 px-4 rounded hover:bg-gray-200 text-[12px] ${!isOpen && 'justify-center'}`}
              to="/dashboard"
            >
              <FaHome className={`text-[18px] text-green ${!isOpen && 'mx-auto'}`} />
              {isOpen && <span className="text-gray-400">Dashboard</span>}
            </NavLink>
          </li>

          <li className="nav-item py-2">
            <NavLink
              className={`navLink flex items-center gap-4 py-2 px-4 rounded hover:bg-gray-200 text-[12px] ${!isOpen && 'justify-center'}`}
              to="/dashboard/my-businesses"
            >
              <img src={doc} alt="My Businesses" className={`w-4 h-4 ${!isOpen && 'mx-auto'}`} />
              {isOpen && <span className="text-gray-400">My Businesses</span>}
            </NavLink>
          </li>

          <li className="nav-item py-2">
            <NavLink
              className={`navLink flex items-center gap-4 py-2 px-4 rounded hover:bg-gray-200 text-[12px] ${!isOpen && 'justify-center'}`}
              to="/dashboard/milestones"
            >
              <img src={sharp} alt="Service Milestones" className={`w-4 h-4 ${!isOpen && 'mx-auto'}`} />
              {isOpen && <span className="text-gray-400">Milestones</span>}
            </NavLink>
          </li>

          <li className="nav-item py-2">
            <NavLink
              className={`navLink flex items-center gap-4 py-2 px-4 rounded hover:bg-gray-200 text-[12px] ${!isOpen && 'justify-center'}`}
              to="/dashboard/add-milestone"
            >
              <img src={addIcon} alt="Add Service Milestone" className={`w-[17px] h-4 ${!isOpen && 'mx-auto'}`} />
              {isOpen && <span className="text-gray-400">Add Business Milestone</span>}
            </NavLink>
          </li>

          <li className="nav-item py-2">
            <NavLink
              className={`navLink flex items-center gap-4 py-2 px-4 rounded hover:bg-gray-200 text-[12px] ${!isOpen && 'justify-center'}`}
              to="/dashboard/investment-bids"
            >
              <img src={chartIcon} alt="Business Bids" className={`w-4 h-4 ${!isOpen && 'mx-auto'}`} />
              {isOpen && <span className="text-gray-400">Business Bids</span>}
            </NavLink>
          </li>

          <hr />

          <ul className="space-y-2 mt-6">
            <li className="nav-item py-2">
              <NavLink
                className={`navLink flex items-center gap-4 py-2 px-4 rounded hover:bg-gray-200 text-[12px] ${!isOpen && 'justify-center'}`}
                to="/dashboard/services-table"
              >
                <FaWrench className={`text-green w-4 h-4 ${!isOpen && 'mx-auto'}`} />
                {isOpen && <span className="text-gray-400">My Services</span>}
              </NavLink>
            </li>

            <li className="nav-item py-2">
              <NavLink
                className={`navLink flex items-center gap-4 py-2 px-4 rounded hover:bg-gray-200 text-[12px] ${!isOpen && 'justify-center'}`}
                to="/dashboard/add-service"
              >
                <img src={sharp} alt="Add Service" className={`w-4 h-4 ${!isOpen && 'mx-auto'}`} />
                {isOpen && <span className="text-gray-400">Add Service</span>}
              </NavLink>
            </li>

            <li className="nav-item py-2">
              <NavLink
                className={`navLink flex items-center gap-4 py-2 px-4 rounded hover:bg-gray-200 text-[12px] ${!isOpen && 'justify-center'}`}
                to="/dashboard/service-milestone"
              >
                <img src={addIcon} alt="Milestone" className={`w-[17px] h-4 ${!isOpen && 'mx-auto'}`} />
                {isOpen && <span className="text-gray-400">Milestone</span>}
              </NavLink>
            </li>

            <li className="nav-item py-2">
              <NavLink
                className={`navLink flex items-center gap-4 py-2 px-4 rounded hover:bg-gray-200 text-[12px] ${!isOpen && 'justify-center'}`}
                to="/dashboard/addservicemilestone"
              >
                <img src={calendarIcon} alt="Add Service Milestone" className={`w-4 h-4 ${!isOpen && 'mx-auto'}`} />
                {isOpen && <span className="text-gray-400">Add Service Milestone</span>}
              </NavLink>
            </li>

            <li className="nav-item py-2">
              <NavLink
                className={`navLink flex items-center gap-4 py-2 px-4 rounded hover:bg-gray-200 text-[12px] ${!isOpen && 'justify-center'}`}
                to="/dashboard/service-bookings"
              >
                <img src={chartIcon} alt="Service Booking" className={`w-4 h-4 ${!isOpen && 'mx-auto'}`} />
                {isOpen && <span className="text-gray-400">Service Booking</span>}
              </NavLink>
            </li>

            <li className="nav-item my-6 bg-green-700  rounded-xl py-2 ">
              <NavLink
                className={`navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] ${!isOpen && 'justify-center'}`}
                to="/dashboard/mybookings"
              >
                <img src={btmIcon} alt="My Bookings" className={`w-5 h-5 ${!isOpen && 'mx-auto'}`} />
                {isOpen && <span className="text-white">My Bookings</span>}
              </NavLink>
            </li>
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
