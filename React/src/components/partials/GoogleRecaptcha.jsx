import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const GoogleRecaptcha = ({ onRecaptchaChange, errors }) => {
    const [captchaValue, setCaptchaValue] = useState(null);

    const handleChange = (value) => {
        setCaptchaValue(value);
        onRecaptchaChange(value);
    };

    return (
        <div className="relative flex justify-between w-[260px] items-center mt-4">
            <div className="flex items-center gap-2">
                <ReCAPTCHA
                    sitekey="6Lf6WpIqAAAAABwUytPV_5sZv95uFlUg6-LiG0UR" // Your site key
                    onChange={handleChange}
                    theme="light"
                />
            </div>
            {errors.recaptcha && (
                <p className="text-red-500 text-xs  absolute right-0 top-full mt-1 ml-2">
                    {errors.recaptcha}
                </p>
            )}
        </div>
    );
};

export default GoogleRecaptcha;
