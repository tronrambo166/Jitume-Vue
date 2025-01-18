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

    // Cance logic here 
    const handleCancel = (id) => {
        alert("cancel", id);
    };

    // Define headers for ReusableTable
    const headers = [
        "Name",
        "Category",
        "Value Needed",
        "Contact",
        "Amount",
        "Business Share Request",
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
        "business share request": `${item.share}%`,
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
            <div className="flex space-x-2">
                {/* View Milestones Button */}
                <Link to={`/business-milestones/${btoa(btoa(item.id))}`}>
                    <button className="text-yellow-500 border border-green-500 rounded-lg py-1 px-3 text-xs">
                        View milestones
                    </button>
                </Link>
                {/* Cancel Button */}
                <button
                    onClick={() => handleCancel(item.id)} // Replace with your cancel logic
                    className="text-black border border-red-500 hover:bg-red-100 rounded-lg py-1 px-3 text-xs"
                >
                    Cancel
                </button>
            </div>
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
