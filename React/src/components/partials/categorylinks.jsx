import { Link } from 'react-router-dom'; // Import Link from react-router-dom


const CategoryLinks = () => {
    return (
        <div className="text-center py-3 pb-0">
            <div className="max-w-4xl mx-auto">   
                 <ul className="flex flex-wrap justify-center gap-2">
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/arts-culture" className="no-underline">
                            Arts/Culture
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/auto" className="no-underline">
                            Auto
                      </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to={`/category/${'Domestic'}`} className="no-underline">
                            Domestic (HomeHelp etc)
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/fashion" className="no-underline">
                            Fashion
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/finance-accounting" className="no-underline">
                            Finance/Accounting
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/food" className="no-underline">
                            Food
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/legal" className="no-underline">
                            Legal
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/media-internet" className="no-underline">
                            Media/Internet
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/pets" className="no-underline">
                            Pets
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/retail" className="no-underline">
                            Retail
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/real-estate" className="no-underline">
                            Real Estate
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/security" className="no-underline">
                            Security
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/sports-gaming" className="no-underline">
                            Sports/Gaming
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link
        to  ="/category#technology-communications"
                            className="no-underline"
                        >
                            Technology/Communications
                        </Link>
                    </li>
                    <li className="border border-gray-300 text-black rounded-md p-2 hover:text-green-700">
                        <Link to="/category/other" className="no-underline">
                            Other
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CategoryLinks;
