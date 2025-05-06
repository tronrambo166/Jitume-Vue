import { Plus, Search } from "lucide-react";

const ActionBar = ({ setInviteModalOpen, searchTerm, setSearchTerm }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <button
                onClick={() => setInviteModalOpen(true)}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
                <Plus size={18} className="mr-2" /> Invite New User
            </button>

            <div className="relative w-full md:w-auto">
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email or role"
                    className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>
        </div>
    );
};

export default ActionBar;
