// components/TermsCheckbox.js
import React from "react";

const TermsCheckbox = ({ checked, onChange }) => (
    <div className="flex items-center space-x-2">
        <input
            type="checkbox"
            id="termsAgreed"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-green-600 focus:ring-green border-gray-300 rounded"
        />
        <label htmlFor="termsAgreed" className="text-sm text-gray-700">
            I agree to the terms and conditions
        </label>
    </div>
);

export default TermsCheckbox;
