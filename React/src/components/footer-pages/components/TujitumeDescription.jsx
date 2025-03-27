import React from "react";
import { FaCheck } from "react-icons/fa";

const TujitumeDescription = () => {
    return (
        <div className="p-6 mt-6 bg-white border rounded-lg dark:bg-gray-900 dark:text-white">
            <h1 className="text-3xl font-bold mb-6 text-center text-green dark:text-green">
                A Platform Rooted in African Communal Growth
            </h1>

            <div className="space-y-5 text-lg leading-relaxed">
                <p>
                    In Africa, we thrive on communal support, naturally
                    gravitating toward helping those within our own geographical
                    and cultural backgrounds.{" "}
                    <span className="font-semibold text-green dark:text-green">
                        Tujitume
                    </span>{" "}
                    harnesses this inherent spirit of community by making it
                    easier for investors to find and support local
                    entrepreneurs.
                </p>

                <div className="my-6">
                    <p className="font-medium mb-4">
                        By decentralizing investment and business support,{" "}
                        <span className="text-green dark:text-green">
                            Tujitume
                        </span>
                        :
                    </p>

                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="text-green dark:text-green mt-1">
                                <FaCheck />
                            </span>
                            <span>
                                <strong>Simplifies regional investment</strong>,
                                allowing startups and SMEs to present their
                                opportunities directly to investors from their
                                own communities.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green dark:text-green mt-1">
                                <FaCheck />
                            </span>
                            <span>
                                <strong>
                                    Encourages professional cross-selling
                                </strong>
                                , enabling businesses to access crucial
                                services—such as accounting, legal, and
                                branding—locally rather than having to seek them
                                out in major cities.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green dark:text-green mt-1">
                                <FaCheck />
                            </span>
                            <span>
                                <strong>
                                    Creates self-sustaining micro-economies
                                </strong>
                                , reducing reliance on high-interest financial
                                systems and government policies that often
                                overlook grassroots entrepreneurs.
                            </span>
                        </li>
                    </ul>
                </div>

                <p className="border-l-4 border-green dark:border-green pl-4 italic bg-gray-50 dark:bg-gray-800 py-3 rounded-r">
                    As Africans, we hold the power to uplift our own economies.{" "}
                    <span className="font-semibold">Tujitume</span> is more than
                    a platform—it is a movement toward economic
                    decentralization, empowering startups and SMEs to grow
                    through local / diaspora investment and collective
                    prosperity.
                </p>

                <div className="mt-8 p-6 bg-green dark:bg-green-700 rounded-lg shadow-md">
                    <p className="text-xl font-bold text-center text-white">
                        Together, we can build Africa.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TujitumeDescription;
