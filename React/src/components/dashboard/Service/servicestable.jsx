import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosClient from "../../../axiosClient";
import ServEditModal from "./ServEditModal";
import { useAlert } from "../../partials/AlertContext";
import ReusableTable from "../business/ReusableTable";
import { BsThreeDots } from "react-icons/bs";
import { FaCogs } from 'react-icons/fa'; // Gears icon, symbolizing a service being done

const ServiceTable = () => {
    const [business, setBusiness] = useState([]);
    const [service, setService] = useState([]);
    const [myInvest, setMyInvest] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null); // To track the selected service for editing
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    useEffect(() => {
        const getBusinessAndServices = () => {
            setTimeout(() => {
                axiosClient
                    .get("/business/dashhome/"+'service')
                    .then(({ data }) => {
                        //setBusiness(data.business);
                        setService(data.services);
                        //setMyInvest(data.results);
                        console.log("services", data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }, 500);
        };
        getBusinessAndServices();
    }, []);

    const openEditModal = (service) => {
        setSelectedService(service); // Set the service being edited
        setIsEditModalOpen(true); // Open the modal
    };

    const handleDelete = (id) => {
        axiosClient
            .get("/business/delete_service/" + id)
            .then(() => {
                setService(service.filter((item) => item.id !== id));
                showAlert("success", "Service deleted successfully.");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleUpdate = (updatedService) => {
        setService(
            service.map((item) =>
                item.id === updatedService.id ? updatedService : item
            )
        );
        setIsEditModalOpen(false);
    };


   const ActionDropdown = ({ item }) => {
       const [showDropdown, setShowDropdown] = useState(false);
       const dropdownRef = useRef(null);

       const toggleDropdown = () => setShowDropdown((prev) => !prev);

       // Close dropdown when clicking outside
       useEffect(() => {
           const handleClickOutside = (event) => {
               if (
                   dropdownRef.current &&
                   !dropdownRef.current.contains(event.target)
               ) {
                   setShowDropdown(false);
               }
           };

           document.addEventListener("mousedown", handleClickOutside);
           return () => {
               document.removeEventListener("mousedown", handleClickOutside);
           };
       }, []);

       return (
           <div className="relative" ref={dropdownRef}>
               {/* Three dots button */}
               <button
                   onClick={toggleDropdown}
                   className="p-2 rounded-full hover:bg-gray-200"
               >
                   <BsThreeDots size={20} />
               </button>

               {/* Dropdown */}
               {showDropdown && (
                   <div className="absolute right-0 top-full z-50 mt-0 -ml-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                       <Link to={`/service-milestones/${btoa(btoa(item.id))}`}>
                           <button className="block w-full px-4 py-2 text-left text-green-500 hover:bg-gray-100">
                               View Milestones
                           </button>
                       </Link>
                       <button
                           onClick={() => {
                               openEditModal(item);
                               setShowDropdown(false);
                           }}
                           className="block w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100"
                       >
                           Edit
                       </button>
                       <button
                           onClick={() => {
                               handleDelete(item.id);
                               setShowDropdown(false);
                           }}
                           className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                       >
                           Delete
                       </button>
                   </div>
               )}
           </div>
       );
   };


    const headers = ["Name", "Category", "Details", "Service Fee", "Actions"];

    // Map service data to match ReusableTable format
    const tableData = service.map((item) => ({
        name: (
            <div className="flex items-center space-x-4">
                <img
                    className="w-10 h-10 rounded-lg object-cover"
                    src={item.image}
                    alt="Service"
                />
                <div className="text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div>{item.contact}</div>
                </div>
            </div>
        ),
        category: item.category,
        //details: item.details,
        details: (
            <div className="max-w-[170px] truncate overflow-ellipsis">
                {item.details}
            </div>
        ),

        "service fee": (
            <span className="-ml-5">${item.price.toLocaleString()}</span>
        ),

        actions: <ActionDropdown item={item} />,
    }));

    return (
        <div className="py-4 mt-8 lg:mt-0 px-0 sm:px-[21px]">
            {/* My Services Section */}
            {service.length > 0 ? (
                <section className="bg-white border rounded-xl w-full">
                    <h1 className="text-[#2D3748] ml-6 mt-6 font-semibold text-xl sm:text-2xl mb-6">
                        My Services
                    </h1>
                    <ReusableTable
                        headers={headers}
                        data={tableData}
                        rowsPerPage={5}
                        tableId="service-table" // Pass unique table ID
                    />
                </section>
            ) : (
                <section className="bg-white border border-gray-300 rounded-xl w-full py-6 px-6">
                    <div className="flex flex-col items-center">
                        {/* Icon */}
                        <FaCogs size={30} className="text-gray-500 mb-4" />
                        <h3 className="text-[#2D3748] font-semibold text-xl sm:text-l mb-4">
                            No Services Found
                        </h3>
                        <p className="text-gray-600 text-center">
                            You don't have any services listed yet. Please add
                            one to get started.
                            <Link to="/dashboard/add-service">
                                <span className="text-green font-bold hover:underline">
                                    {" "}
                                    Add Service
                                </span>
                            </Link>
                        </p>
                    </div>
                </section>
            )}
            {isEditModalOpen && (
                <ServEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    service={selectedService} // Pass selectedService data
                    onUpdate={handleUpdate} // Update service in state
                />
            )}
        </div>
    );
};

export default ServiceTable;
