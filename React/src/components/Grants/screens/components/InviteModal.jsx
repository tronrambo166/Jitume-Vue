import { X, Mail, Shield, Send } from "lucide-react";

const InviteModal = ({
    inviteModalOpen,
    setInviteModalOpen,
    inviteEmail,
    setInviteEmail,
    inviteAccessLevel,
    setInviteAccessLevel,
    handleInvite,
}) => {
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center transition-opacity duration-300 ${
                inviteModalOpen
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
            }`}
        >
            <div
                className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-transform duration-300 ${
                    inviteModalOpen ? "scale-100" : "scale-95"
                }`}
            >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                        Invite New User
                    </h3>
                    <button
                        onClick={() => setInviteModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleInvite} className="px-6 py-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="email"
                                    required
                                    value={inviteEmail}
                                    onChange={(e) =>
                                        setInviteEmail(e.target.value)
                                    }
                                    placeholder="Enter email address"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Access Level
                            </label>
                            <div className="relative">
                                <Shield
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <select
                                    value={inviteAccessLevel}
                                    onChange={(e) =>
                                        setInviteAccessLevel(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="Admin">
                                        Admin - Full access to all features
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

                        <div className="pt-2">
                            <p className="text-sm text-gray-500">
                                We'll send an email invitation with instructions
                                to set up their account and password.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setInviteModalOpen(false)}
                            className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            <Send size={16} className="mr-2" /> Send Invitation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteModal;
