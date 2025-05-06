import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ filteredUsers }) => {
    return (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div>
                Show rows:
                <select className="ml-2 border border-gray-300 rounded-md px-2 py-1">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                </select>
            </div>
            <div className="flex items-center space-x-2">
                <span>
                    1-{filteredUsers.length} of {filteredUsers.length}
                </span>
                <button
                    className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    disabled={true}
                >
                    <ChevronLeft className="text-gray-500" size={18} />
                </button>
                <button
                    className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    disabled={true}
                >
                    <ChevronRight className="text-gray-500" size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
