import React, { useState } from "react";
import PersonalInfo from "./components/PersonalInfo";
// import AccountSettings from "./components/AccountSettings";

const Settings = () => {
    return (
        <div className="min-h-screen mt-8 sm:mt-4 md:mt-8 lg:mt-10 xl:mt-12">
            <PersonalInfo />
        </div>
    );
};

export default Settings;
