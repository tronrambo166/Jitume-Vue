import React, { useState } from "react";
import Header from "./components/Header";
import ActionBar from "./components/ActionBar";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import UserDrawer from "./components/UserDrawer";
import InviteModal from "./components/InviteModal";

const UserManagement = () => {
    // Sample user data
    const [users, setUsers] = useState([
        {
            id: 1,
            email: "owen3158@gmail.com",
            status: "Active",
            accessLevel: "Admin",
            name: "Owen Mitchell",
            lastActive: "Today at 2:45 PM",
            joinedDate: "Jan 15, 2025",
        },
        {
            id: 2,
            email: "sarah.wong@example.com",
            status: "Active",
            accessLevel: "Editor",
            name: "Sarah Wong",
            lastActive: "Yesterday",
            joinedDate: "Mar 22, 2025",
        },
        {
            id: 3,
            email: "david.kim@example.com",
            status: "Pending",
            accessLevel: "Viewer",
            name: "David Kim",
            lastActive: "Never",
            joinedDate: "Apr 28, 2025",
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteAccessLevel, setInviteAccessLevel] = useState("Viewer");

    const filteredUsers = users.filter(
        (user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.accessLevel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openUserDrawer = (user) => {
        setSelectedUser(user);
        setDrawerOpen(true);
    };

    const closeUserDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => setSelectedUser(null), 300);
    };

    const handleInvite = (e) => {
        e.preventDefault();

        // Extract name from email (convert first.last@example.com to First Last)
        let extractedName = inviteEmail.split("@")[0];
        extractedName = extractedName
            .split(/[._-]/)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");

        const newUser = {
            id: users.length + 1,
            email: inviteEmail,
            status: "Pending",
            accessLevel: inviteAccessLevel,
            name: extractedName,
            lastActive: "Never",
            joinedDate: "Just now",
        };

        setUsers([...users, newUser]);
        setInviteEmail("");
        setInviteAccessLevel("Viewer");
        setInviteModalOpen(false);
    };

    const updateUser = (e) => {
        e.preventDefault();
        setUsers(
            users.map((user) =>
                user.id === selectedUser.id ? selectedUser : user
            )
        );
        closeUserDrawer();
    };

    const deleteUser = (userId) => {
        if (window.confirm("Are you sure you want to remove this user?")) {
            setUsers(users.filter((user) => user.id !== userId));
            closeUserDrawer();
        }
    };

    const handleStatusChange = (userId, newStatus) => {
        setUsers(
            users.map((user) =>
                user.id === userId ? { ...user, status: newStatus } : user
            )
        );
    };

    const getAccessLevelColor = (level) => {
        switch (level) {
            case "Admin":
                return "bg-purple-100 text-purple-800";
            case "Editor":
                return "bg-orange-100 text-emerald-800";
            case "Viewer":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
            <Header />
            
            <ActionBar 
                setInviteModalOpen={setInviteModalOpen}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            
            <UserTable 
                filteredUsers={filteredUsers}
                openUserDrawer={openUserDrawer}
                getAccessLevelColor={getAccessLevelColor}
            />
            
            <Pagination filteredUsers={filteredUsers} />
            
            <UserDrawer 
                drawerOpen={drawerOpen}
                selectedUser={selectedUser}
                closeUserDrawer={closeUserDrawer}
                setSelectedUser={setSelectedUser}
                updateUser={updateUser}
                deleteUser={deleteUser}
            />
            
            <InviteModal 
                inviteModalOpen={inviteModalOpen}
                setInviteModalOpen={setInviteModalOpen}
                inviteEmail={inviteEmail}
                setInviteEmail={setInviteEmail}
                inviteAccessLevel={inviteAccessLevel}
                setInviteAccessLevel={setInviteAccessLevel}
                handleInvite={handleInvite}
            />
        </div>
    );
};

export default UserManagement;