import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";

const ServiceTable = () => {
    const [business, setBusiness] = useState([]);
    const [service, setService] = useState([]);
    const [myInvest, setMyInvest] = useState([]);

    useEffect(() => {
        const getBusinessAndServices = () => {
            setTimeout(() => {
                axiosClient
                    .get("/business/dashhome")
                    .then(({ data }) => {
                        setBusiness(data.business);
                        setService(data.services);
                        setMyInvest(data.results);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }, 500);
        };
        getBusinessAndServices();
    }, []);

    return (
        <div className="p-4">
            {
                <section className="bg-white shadow-md rounded-lg mb-6 p-4">
                    <h1 className="text-[#2D3748] font-semibold text-xl mb-3">
                        My Investments
                    </h1>
                    {myInvest.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr className="text-gray-500">
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Value Needed
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Details
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Business Share
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            My Share
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {myInvest.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                {item.name}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                {item.category}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                {item.investment_needed}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                {item.details}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                {item.contact}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                {item.share}%
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                {item.myShare.toFixed()}%
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                <img
                                                    className="w-10 h-10 rounded-lg"
                                                    src={"../" + item.image}
                                                    alt="Service"
                                                />
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-center text-sm">
                                                <Link
                                                    to={`/business-milestones/${btoa(
                                                        btoa(item.id)
                                                    )}`}
                                                >
                                                    <button className="text-green-500 border border-green-500 rounded-lg py-1 px-3 text-xs">
                                                        View milestones
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            }

            <section className="bg-white shadow-md rounded-lg mb-6 p-4">
                <h1 className="text-[#2D3748] font-semibold text-xl mb-3">
                    My Service
                </h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr className="text-gray-500">
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Details
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Required
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {service.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-4 flex items-center">
                                        <img
                                            className="w-10 h-10 rounded-lg"
                                            src={"../" + item.image}
                                            alt="Service"
                                        />
                                        <div className="ml-3 text-sm">
                                            <div className="font-medium">
                                                {item.name}
                                            </div>
                                            <div>{item.contact}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        {item.category}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        {item.details}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        {item.amount}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-center text-sm">
                                        <Link
                                            to={`/service-milestones/${btoa(
                                                btoa(item.id)
                                            )}`}
                                        >
                                            <button className="text-green-500 border border-green-500 rounded-lg py-1 px-3 text-xs">
                                                View milestones
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="bg-white shadow-md rounded-lg mb-6 p-4">
                <h1 className="text-[#2D3748] font-semibold text-xl mb-3">
                    My Businesses
                </h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr className="text-gray-500">
                                <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Details
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {business.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-4 flex items-center">
                                        <img
                                            className="w-10 h-10 rounded-lg"
                                            src={"../" + item.image}
                                            alt="Service"
                                        />
                                        <div className="ml-3 text-sm">
                                            <div className="font-medium">
                                                {item.name}
                                            </div>
                                            <div>{item.contact}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        {item.category}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        {item.details}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        {item.amount}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-center text-sm">
                                        <Link
                                            to={`/business-milestones/${btoa(
                                                btoa(item.id)
                                            )}`}
                                        >
                                            <button className="text-green-500 border border-green-500 rounded-lg py-1 px-3 text-xs">
                                                View milestones
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default ServiceTable;
