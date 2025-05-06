import { X, User, Save, Trash2 } from "lucide-react";

const UserDrawer = ({
    drawerOpen,
    selectedUser,
    closeUserDrawer,
    setSelectedUser,
    updateUser,
    deleteUser,
}) => {
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${
                drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
            <div
                className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transition-transform duration-300 transform ${
                    drawerOpen ? "translate-x-0" : "translate-x-full"
                } overflow-y-auto`}
            >
                {selectedUser && (
                    <div className="h-full flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">
                                User Details
                            </h3>
                            <button
                                onClick={closeUserDrawer}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 p-6">
                            <form onSubmit={updateUser}>
                                <div className="mb-8 flex flex-col items-center">
                                    <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                        <User
                                            size={32}
                                            className="text-gray-500"
                                        />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900">
                                        {selectedUser.name || "Unnamed User"}
                                    </h3>
                                    <p className="text-gray-500">
                                        {selectedUser.email}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Joined on {selectedUser.joinedDate}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedUser.name || ""}
                                            onChange={(e) =>
                                                setSelectedUser({
                                                    ...selectedUser,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="User name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={selectedUser.email}
                                            onChange={(e) =>
                                                setSelectedUser({
                                                    ...selectedUser,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Email address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={selectedUser.status}
                                            onChange={(e) =>
                                                setSelectedUser({
                                                    ...selectedUser,
                                                    status: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            <option value="Active">
                                                Active
                                            </option>
                                            <option value="Pending">
                                                Pending
                                            </option>
                                            <option value="Suspended">
                                                Suspended
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Access Level
                                        </label>
                                        <select
                                            value={selectedUser.accessLevel}
                                            onChange={(e) =>
                                                setSelectedUser({
                                                    ...selectedUser,
                                                    accessLevel: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            <option value="Admin">
                                                Admin - Full access to all
                                                features
                                            </option>
                                            <option value="Editor">
                                                Editor - Can edit but not delete
                                            </option>
                                            <option value="Viewer">
                                                Viewer - View only access
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                    >
                                        <Save size={18} className="mr-2" /> Save
                                        Changes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            deleteUser(selectedUser.id)
                                        }
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <Trash2 size={18} className="mr-2" />{" "}
                                        Remove User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDrawer;
