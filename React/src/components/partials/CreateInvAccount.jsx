import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo2 from "../../images/logo2.png";
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axiosClient";

function CreateInvestorAccount({ isOpen, onClose }) {
    const [isSignIn, setIsSignIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { setUser, setToken } = useStateContext();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [registrationData, setRegistrationData] = useState({
        fname: "",
        mname: "",
        lname: "",
        email: "",
        password: "",
        confirmPassword: "",
        id_passport: "",
        tax_pin: "",
        attached_id: null,
        pin: null,
        investor: 1,
        id_no: "",
        past_investment: "",
        website: "",
        terms: false,
        inv_range: [],
        interested_cats: [],
    });

    const [dropdowns, setDropdowns] = useState({
        invRangeOpen: false,
        industriesOpen: false,
    });

    if (!isOpen) return null;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRegistrationChange = (e) => {
        const { name, value, type, files, checked } = e.target;
        setRegistrationData((prev) => ({
            ...prev,
            [name]:
                type === "file"
                    ? files[0]
                    : type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleDropdownToggle = (type) => {
        setDropdowns((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handleCheckboxChange = (e, category) => {
        const { name, checked } = e.target;
        setRegistrationData((prev) => {
            const updatedList = checked
                ? [...prev[category], name]
                : prev[category].filter((item) => item !== name);

            return {
                ...prev,
                [category]: updatedList,
            };
        });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log("Login Data:", loginData);
        onClose();
    };

    const handleRegistrationSubmit = (e) => {
        e.preventDefault();
        const submitData = new FormData();
        for (const key in registrationData) {
            submitData.append(key, registrationData[key]);
        }
        console.log("Registration Data:", registrationData);

        // Uncomment and update as necessary
        axiosClient.post("/register", submitData).then(({data})=>{
            console.log(data);
            if(data.status == 400)
            alert(data.message);

            setUser(data.user);
            setToken(data.token);
        }).catch(err => {
            console.log(err);
            const response = err.response;
            if(response && response.status === 422){
                console.log(response.data.errors);
                //show(response.data.errors);
            }
        });

        // Handle registration logic here
        // Close the modal after submission
    };

   return (
       <div className="fixed inset-0 bg-blue-900 bg-opacity-25 flex justify-center items-center z-50">
           <div
               className={`bg-white p-6 shadow-lg ${
                   isSignIn ? "max-w-md min-h-[500px]" : "max-w-2xl"
               } w-full h-[550px] no-scrollbar overflow-y-auto relative rounded-xl`}
           >
               <button
                   onClick={onClose}
                   className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl bg-white border-none p-1 rounded-full"
               >
                   &times;
               </button>

               <div className="flex justify-center mb-4 mt-2">
                   <img src={logo2} alt="Logo" className="w-12 h-12" />
               </div>

               <div className="flex justify-center mb-6 border-b border-gray-300 space-x-4">
                   <button
                       className={`px-4 py-2 text-sm ${
                           isSignIn
                               ? "font-semibold border-b-2 border-green-500"
                               : "text-gray-600 hover:text-gray-800"
                       }`}
                       onClick={() => setIsSignIn(true)}
                   >
                       Investor Sign In
                   </button>
                   <button
                       className={`px-4 py-2 text-sm ${
                           !isSignIn
                               ? "font-semibold border-b-2 border-green-500"
                               : "text-gray-600 hover:text-gray-800"
                       }`}
                       onClick={() => setIsSignIn(false)}
                   >
                       Create Investor Account
                   </button>
               </div>

               {isSignIn ? (
                   <form
                       onSubmit={handleLoginSubmit}
                       className="flex flex-col items-center space-y-4"
                   >
                       <h2 className="text-2xl font-semibold text-gray-800">
                           Sign In
                       </h2>
                       <p className="text-sm text-gray-600">
                           Enter your details to log in
                       </p>

                       <div className="flex flex-col w-full max-w-sm space-y-4">
                           <div className="flex flex-col">
                               <label className="text-gray-700 text-sm">
                                   Email
                               </label>
                               <input
                                   type="email"
                                   name="email"
                                   value={loginData.email}
                                   onChange={handleLoginChange}
                                   className="border rounded-lg px-3 py-2 text-sm"
                                   required
                               />
                           </div>
                           <div className="flex flex-col relative">
                               <label className="text-gray-700 text-sm">
                                   Password
                               </label>
                               <input
                                   type={showPassword ? "text" : "password"}
                                   name="password"
                                   value={loginData.password}
                                   onChange={handleLoginChange}
                                   className="border rounded-lg px-3 py-2 text-sm pr-10"
                                   required
                               />
                               <button
                                   type="button"
                                   onClick={togglePasswordVisibility}
                                   className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                               >
                                   {showPassword ? <FaEyeSlash /> : <FaEye />}
                               </button>
                           </div>

                           <a
                               href="#"
                               className="text-black hover:underline text-sm text-center"
                           >
                               Forgot Password?
                           </a>

                           <button
                               type="submit"
                               className="btn btn-primary rounded-full py-2 px-4 text-white  "
                           >
                               Log In
                           </button>
                       </div>
                   </form>
               ) : (
                   <form
                       onSubmit={handleRegistrationSubmit}
                       className="flex flex-col items-center space-y-4"
                   >
                       <h2 className="text-2xl font-semibold text-gray-800">
                           Create Account
                       </h2>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="relative">
                               <label className="block text-gray-700 text-sm">
                                   First Name{" "}
                                   <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type="text"
                                   name="fname"
                                   value={registrationData.fname}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm"
                                   required
                               />
                           </div>

                           <div className="relative">
                               <label className="block text-gray-700 text-sm">
                                   Middle Name
                               </label>
                               <input
                                   type="text"
                                   name="mname"
                                   value={registrationData.mname}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm"
                               />
                           </div>

                           <div className="relative">
                               <label className="block text-gray-700 text-sm">
                                   Last Name{" "}
                                   <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type="text"
                                   name="lname"
                                   value={registrationData.lname}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm"
                                   required
                               />
                           </div>

                           <div className="relative">
                               <label className="block text-gray-700 text-sm">
                                   Email <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type="email"
                                   name="email"
                                   value={registrationData.email}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm"
                                   required
                               />
                           </div>

                           <div className="relative">
                               <label className="block text-gray-700 text-sm">
                                   Password{" "}
                                   <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type={showPassword ? "text" : "password"}
                                   name="password"
                                   value={registrationData.password}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm"
                                   required
                               />
                               <button
                                   type="button"
                                   onClick={togglePasswordVisibility}
                                   className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                               >
                                   {showPassword ? <FaEyeSlash /> : <FaEye />}
                               </button>
                           </div>

                           <div className="relative">
                               <label className="block text-gray-700 text-sm">
                                   Confirm Password{" "}
                                   <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type={
                                       showConfirmPassword ? "text" : "password"
                                   }
                                   name="confirmPassword"
                                   value={registrationData.confirmPassword}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm"
                                   required
                               />
                               <button
                                   type="button"
                                   onClick={toggleConfirmPasswordVisibility}
                                   className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                               >
                                   {showConfirmPassword ? (
                                       <FaEyeSlash />
                                   ) : (
                                       <FaEye />
                                   )}
                               </button>
                           </div>

                           <div className="relative">
                               <label className="block text-gray-700 text-sm">
                                   ID/Passport Number{" "}
                                   <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type="text"
                                   name="id_no"
                                   value={registrationData.id_no}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm"
                                   required
                               />
                           </div>

                           <div>
                               <label className="block text-gray-700 text-sm mb-1">
                                   Tax PIN
                               </label>
                               <input
                                   type="text"
                                   name="tax_pin"
                                   value={registrationData.tax_pin}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
                               />
                           </div>

                           <div>
                               <label className="block text-gray-700 text-sm mb-1">
                                   Attach ID/Passport{" "}
                                   <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type="file"
                                   name="id_passport"
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm file:border-none file:bg-blue-100 file:text-blue-700 file:rounded-lg focus:ring-2 focus:ring-blue-500"
                                   required
                               />
                           </div>

                           <div>
                               <label className="block text-gray-700 text-sm mb-1">
                                   PIN <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type="file"
                                   name="pin"
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm file:border-none file:bg-blue-100 file:text-blue-700 file:rounded-lg focus:ring-2 focus:ring-blue-500"
                                   required
                               />
                           </div>
{/*
                           <div>
                               <label className="block text-gray-700 text-sm mb-1">
                                   Investor Type{" "}
                                   <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type="text"
                                   name="investor"
                                   value={registrationData.investor}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
                                   required
                               />
                           </div>

                           <div>
                               <label className="block text-gray-700 text-sm mb-1">
                                   ID Number{" "}
                                   <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type="text"
                                   name="id_no"
                                   value={registrationData.id_no}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
                                   required
                               />
                           </div>*/}

                           <div>
                               <label className="block text-gray-700 text-sm mb-1">
                                   Past Investment
                               </label>
                               <input
                                   type="text"
                                   name="past_investment"
                                   value={registrationData.past_investment}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
                               />
                           </div>

                           <div>
                               <label className="block text-gray-700 text-sm mb-1">
                                   Website
                               </label>
                               <input
                                   type="url"
                                   name="website"
                                   value={registrationData.website}
                                   onChange={handleRegistrationChange}
                                   className="border rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
                               />
                           </div>

                           <div className="relative">
                               <label className="block text-gray-700 text-sm mb-1">
                                   Potential Investment Range
                               </label>
                               <div
                                   className="border rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-blue-500"
                                   onClick={() =>
                                       handleDropdownToggle("invRangeOpen")
                                   }
                               >
                                   {registrationData.inv_range.length > 0
                                       ? registrationData.inv_range.join(", ")
                                       : "Select ranges"}
                               </div>
                               {dropdowns.invRangeOpen && (
                                   <div className="absolute bg-white border rounded-lg mt-2 w-full shadow-lg z-10">
                                       {["0-10000", "0-100000", "10000-100000", "100000-250000", "250000-500000", "500000-"].map(
                                           (range) => (
                                               <label
                                                   key={range}
                                                   className="block p-2 cursor-pointer hover:bg-blue-50"
                                               >
                                                   <input
                                                       type="checkbox"
                                                       name={range}
                                                       checked={registrationData.inv_range.includes(
                                                           range
                                                       )}
                                                       onChange={(e) =>
                                                           handleCheckboxChange(
                                                               e,
                                                               "inv_range"
                                                           )
                                                       }
                                                       className="mr-2"
                                                   />
                                                   {range}
                                               </label>
                                           )
                                       )}
                                   </div>
                               )}
                           </div>

                           <div className="relative">
                               <label className="block text-gray-700 text-sm mb-1">
                                   Which industries are you interested in
                                   investing?
                               </label>
                               <div
                                   className="border rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-blue-500"
                                   onClick={() =>
                                       handleDropdownToggle("industriesOpen")
                                   }
                               >
                                   {registrationData.interested_cats.length > 0
                                       ? registrationData.interested_cats.join(
                                             ", "
                                         )
                                       : "Select industries"}
                               </div>
                               {dropdowns.industriesOpen && (
                                   <div className="absolute bg-white border rounded-lg mt-2 w-full shadow-lg z-10">
                                       {[
                                           "Agriculture",
                                           "Arts/Culture",
                                           "Sports/Gaming",
                                           "Auto",
                                           "Real State",
                                           "Food",
                                           "Legal",
                                           "Security",
                                           "Media/Internet",
                                           "Technology/Communications",
                                           "Retail",
                                           "Finance/Accounting",
                                           "Pets",
                                           "Domestic (Home Help etc)",
                                       ].map((industry) => (
                                           <label
                                               key={industry}
                                               className="block p-2 cursor-pointer hover:bg-blue-50"
                                           >
                                               <input
                                                   type="checkbox"
                                                   name={industry}
                                                   checked={registrationData.interested_cats.includes(
                                                       industry
                                                   )}
                                                   onChange={(e) =>
                                                       handleCheckboxChange(
                                                           e,
                                                           "interested_cats"
                                                       )
                                                   }
                                                   className="mr-2"
                                               />
                                               {industry}
                                           </label>
                                       ))}
                                   </div>
                               )}
                           </div>

                           <div className="flex items-center space-x-2 mt-4">
                               <input
                                   type="checkbox"
                                   name="terms"
                                   checked={registrationData.terms}
                                   onChange={handleRegistrationChange}
                                   className="mr-2"
                               />
                               <label className="text-gray-700 text-sm">
                                   I have read and agree to the{" "}
                                   <a
                                       href="#"
                                       className="text-blue-500 hover:underline"
                                   >
                                       Terms of Use
                                   </a>{" "}
                                   and{" "}
                                   <a
                                       href="#"
                                       className="text-blue-500 hover:underline"
                                   >
                                       Privacy Policy
                                   </a>
                               </label>
                           </div>

                           <button
                               type="submit"
                               className="btn btn-primary rounded-full mt-4"
                           >
                               Create Account
                           </button>
                       </div>
                   </form>
               )}
           </div>
       </div>
   );
}

export default CreateInvestorAccount;
