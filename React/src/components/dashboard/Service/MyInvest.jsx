import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import { useAlert } from "../../partials/AlertContext";
import ReusableTable from "../business/ReusableTable";
import { FaChartLine } from "react-icons/fa";

const MyInvest = () => {
    const [myInvest, setMyInvest] = useState([]);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    useEffect(() => {
        const getInvestments = () => {
            setTimeout(() => {
                axiosClient
                    .get("/business/dashhome")
                    .then(({ data }) => {
                        setMyInvest(data.results);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }, 500);
        };
        getInvestments();
    }, []);

    const openEditModal = (service) => {
        setSelectedService(service); // Set the service being edited
        setIsEditModalOpen(true); // Open the modal
    };

    const handleDelete = (id) => {
        axiosClient
            .get("/business/delete_service/" + id)
            .then(() => {
                setMyInvest(myInvest.filter((item) => item.id !== id));
                showAlert("success", "Investment deleted successfully.");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // Define headers for ReusableTable
    const headers = [
        "Name",
        "Category",
        "Value Needed",
        "Contact",
        "Amount",
        "Business Share",
        "My Share",
        "Total Shares",
        "Status",
        "Action",
    ];

    // Map data for ReusableTable
    const tableData = myInvest.map((item) => ({
        name: item.name,
        category: item.category,
        "value needed": item.investment_needed,
        contact: item.contact,
        amount: item.amount,
        "business share": `${item.share}%`,
        "my share": `${item.myShare.toFixed()}%`,
        "total shares": (
            <p className="text-green-500 font-bold text-center">
                {/* ! You will update here to get real data from the api  */}
                {item.totalShares || 90}
            </p>
        ),
        status: (
            <p className="text-green-500 font-bold text-center">
                {item.status}
            </p>
        ),
        action: (
            <Link to={`/business-milestones/${btoa(btoa(item.id))}`}>
                <button className="text-yellow-500 border border-green-500 rounded-lg py-1 px-3 text-xs">
                    View milestones
                </button>
            </Link>
        ),
    }));

    return (
        <div className="py-4 mt-8 lg:mt-0 px-0 sm:px-[21px]">
            <section className="bg-white border rounded-xl w-full">
                {myInvest.length > 0 ? (
                    <section>
                        <h1 className="text-[#2D3748] ml-6 mt-6 font-semibold text-xl sm:text-2xl mb-6">
                            My Investments
                        </h1>
                        <div className="whitespace-nowrap justify-center">
                            <ReusableTable
                                headers={headers}
                                data={tableData}
                                rowsPerPage={5}
                                tableId="myInvestTable"
                            />
                        </div>
                    </section>
                ) : (
                    <section className="bg-white border border-gray-300 rounded-xl w-full py-6 px-6">
                        <div className="flex flex-col items-center">
                            {/* Investment Icon */}
                            <FaChartLine
                                size={30}
                                className="text-gray-500 mb-4"
                            />
                            <h3 className="text-[#2D3748] font-semibold text-xl sm:text-l mb-4">
                                No Investments Found
                            </h3>
                            <p className="text-gray-600 text-center">
                                You don't have any investments yet. Please start
                                investing to see your portfolio grow.
                                {/* <Link to="/dashboard/add-investment">
                                    <span className="text-green font-bold hover:underline">
                                        {" "}
                                        Add Investment
                                    </span>
                                </Link> */}
                            </p>
                        </div>
                    </section>
                )}
            </section>
        </div>
    );
};

export default MyInvest;
