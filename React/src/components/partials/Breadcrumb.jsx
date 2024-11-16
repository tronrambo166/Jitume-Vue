import React from "react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumb = () => {
    const location = useLocation();
    const paths = location.pathname.split("/").filter(Boolean);

    return (
        <nav className="text-white  text-sm md:text-lg" aria-label="breadcrumb">
            <ol className="flex">
                {/* Render Home Link */}
                <li>
                    <Link to="/" className="text-white hover:underline">
                        Home
                    </Link>
                </li>
                {paths.map((path, index) => {
                    // Build the path for each breadcrumb
                    const routeTo = `/${paths.slice(0, index + 1).join("/")}`;
                    const isLast = index === paths.length - 1;

                    return (
                        <li key={routeTo} className="flex items-center">
                            <span className="mx-1 text-white">/</span>
                            {isLast ? (
                                <span className="text-white">
                                    {decodeURIComponent(path)}
                                </span>
                            ) : (
                                <Link
                                    to={routeTo}
                                    className="text-white hover:underline"
                                >
                                    {decodeURIComponent(path)}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
