import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="bg-white w-full mt-8 my-8 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-center text-sm py-5 gap-8 md:gap-[150px]">
        {/* First column */}
        <div className="">
          <ul className="list-none flex flex-col gap-3">
            <li>
              <a href="#" className="text-green hover:text-black" onClick={() => alert('Sign Up/Sign In as A Project Manager')}>
                Sign Up/Sign In as A Project Manager
              </a>
            </li>
            <li>
              <a href="#" className="text-green hover:text-black" onClick={() => alert('Add a Service')}>
                Add a Service
              </a>
            </li>
            <li>
              <a href="#" className="text-green hover:text-black">
                How It Works
              </a>
            </li>
          </ul>
        </div>

        {/* Second column */}
        <div className="">
          <ul className="list-none flex flex-col gap-3">
            <li>
              <a href="#" className="text-green hover:text-black">About</a>
            </li>
            <li>
              <a href="#" className="text-green hover:text-black">FAQs</a>
            </li>
            <li>
              <a href="#" className="text-green hover:text-black">Contact Us</a>
            </li>
            <li>
              <a href="#" className="text-green hover:text-black">Help</a>
            </li>
          </ul>
        </div>

        {/* Third column */}
        <div className="">
          <ul className="list-none flex flex-col gap-3">
            <li>
              <a href="/policy" target="_blank" className="text-green hover:text-black">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms" target="_blank" className="text-green hover:text-black">Terms and Conditions</a>
            </li>
          </ul>
          <ul className="flex space-x-4 mt-4">
            <li>
              <a href="#" className="text-black hover:text-black">
                <IoClose className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a href="#" className="text-green hover:text-black" style={{ color: '#C13584' }}>
                <FaInstagram className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a href="#" className="text-green hover:text-black" style={{ color: '#1877F2' }}>
                <FaFacebook className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a href="#" className="text-green hover:text-black" style={{ color: '#FF0000' }}>
                <FaYoutube className="h-5 w-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
