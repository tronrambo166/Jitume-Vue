import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../../images/logo.png';
import Modal from './Authmodal';
import { useStateContext } from '../../contexts/contextProvider'
import axiosClient from "../../axiosClient";

const Navbar = () => {
  const{user,token,setUser, setToken} = useStateContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onLogout =  (ev) =>{
        ev.preventDefault();
        axiosClient.get('/logout')
        .then(({}) => {
           setUser(null)
           setToken(null)
        })
    }

  return (
  <nav className="bg-white  sm:px-8 dark:bg-dark-bg border-b-black/50" style={{ borderBottom: '1px solid #0000002b' }}>
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex flex-row-reverse items-center justify-between w-full md:w-auto">
          <div className="text-xl text-black dark:text-dark-text order-2 md:order-1">
            <img src={logo} alt='jitume-logo'/>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-green dark:text-dark-green order-1 md:order-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        <div className="hidden md:flex flex-1 text-sm font-semibold justify-center md:gap-0 lg:gap-[50px] sm:gap-[50px] md:px-3 space-x-6">
          <Link to="/home" className="hover:text-green dark:hover:text-dark-green">Home</Link>
          <Link to="/services" className="hover:text-green dark:hover:text-dark-green">Services</Link>
          <Link to="/dashboard" className="hover:text-green dark:hover:text-dark-green">Add Your Business</Link>
          <Link to="/dashboard" className="hover:text-green dark:hover:text-dark-green">Create Investor Account</Link>
          <Link to="/dashboard" className="hover:text-green dark:hover:text-dark-green">Dashboard</Link>

        </div>

        <div >
          <button onClick={onLogout}
            className="btn-logout hidden md:block border hover:text-green border-black text-black px-4 py-2 text-sm font-semibold rounded-lg hover:bg-green-700 dark:bg-dark-green dark:hover:bg-dark-slate"
          >    Sign Out

          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-white shadow-lg dark:bg-dark-bg transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-green dark:text-dark-green"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="flex flex-col py-6 px-4 justify-center mt-10 space-y-6">
          <Link to="/" className="hover:text-green dark:hover:text-dark-green">Home</Link>
          <Link to="/services" className="hover:text-green dark:hover:text-dark-green">Services</Link>
          <Link to="/add-business" className="hover:text-green dark:hover:text-dark-green">Add Your Business</Link>
          <Link to="/create-investor" className="hover:text-green dark:hover:text-dark-green">Create Investor Account</Link>
        </div>
        <div className="flex px-4 mt-6">
          <button
            className="bg-green text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-dark-green dark:hover:bg-dark-slate"
            onClick={() => setIsModalOpen(true)}
          >
            Sign In
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
