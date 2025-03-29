import React from "react";
import FormInput from "../FormInput";
import { ORGANIZATION_TYPES } from "../../registrationOptions";
import { Globe, Briefcase } from "lucide-react";

const Step1 = ({ formData, handleInputChange }) => (
    <>
        <FormInput
            label="Organization Name"
            type="text"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleInputChange}
            placeholder="Enter your organization name"
            required
        />

        {/* Organization Type Dropdown with Icon */}
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <select
                name="organizationType"
                value={formData.organizationType}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
            >
                <option value="">Select Organization Type</option>
                {ORGANIZATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <FormInput
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
            />
            <FormInput
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
            />
        </div>

        {/* Optional Website URL Field */}
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
                name="website"
                type="url"
                value={formData.website || ""}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder="Website URL (optional)"
                pattern="https?://.+"
                title="Please include http:// or https://"
            />
        </div>
    </>
);

export default Step1;
