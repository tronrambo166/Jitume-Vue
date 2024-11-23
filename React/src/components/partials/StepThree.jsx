import React, { useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";

const Otp1 = ({ step }) => {
    const [otp, setOtp] = useState(Array(4).fill("")); // Array with 4 empty strings
    const inputRefs = useRef([]); // Array of refs for each input field

    const handleKeyDown = (e) => {
        const index = inputRefs.current.indexOf(e.target);

        if (
            !/^[0-9]{1}$/.test(e.key) &&
            e.key !== "Backspace" &&
            e.key !== "Delete" &&
            e.key !== "Tab" &&
            !e.metaKey
        ) {
            e.preventDefault();
        }

        if (e.key === "Backspace") {
            setOtp((prevOtp) => [
                ...prevOtp.slice(0, index),
                "",
                ...prevOtp.slice(index + 1),
            ]);
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        } else if (e.key === "Delete") {
            setOtp((prevOtp) => [
                ...prevOtp.slice(0, index),
                "",
                ...prevOtp.slice(index + 1),
            ]);
        }
    };

    const handleInput = (e) => {
        const { target } = e;
        const index = inputRefs.current.indexOf(target);

        if (target.value) {
            setOtp((prevOtp) => {
                const updatedOtp = [
                    ...prevOtp.slice(0, index),
                    target.value,
                    ...prevOtp.slice(index + 1),
                ];
                //console.log("Current OTP:", updatedOtp); // Log the OTP
                //var otp = $('#otp').val();
                console.log(updatedOtp);
                return updatedOtp;
            });
            if (index < otp.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };

    const VerifyEmail = () => {
       //console.log(`OTP: ${otp.join("")}`);
       //console.log(step);
       //console.log(JSON.stringify(otp));



    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").slice(0, otp.length);
        if (/^\d+$/.test(text)) {
            const digits = text.split("");
            setOtp((prevOtp) => [...digits, ...prevOtp.slice(digits.length)]);
            inputRefs.current[Math.min(digits.length, otp.length - 1)].focus();
        }
    };

    return (
        <section className="bg-white text-gray-600  dark:bg-dark">
            <h1 className="text-lg justify-center flex text-gray-700">
                Registration
            </h1>
            <h2 className="text-md justify-center flex mt-2 mb-4 text-gray-700 mr-1">
                Step 3 of 3
            </h2>
            <div className="container">
                <form id="otp-form" className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                        <input
                            id="otp"
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onPaste={handlePaste}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className="shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-5 outline-none sm:text-4xl dark:border-dark-3 dark:bg-white/5"
                        />
                    ))}
                </form>
                {step === 3 && (
                    <button
                        type="button"
                        onClick={VerifyEmail}
                        className="bg-green mb-8 hover:bg-green-700 w-full text-white px-4 py-2 rounded-full flex items-center justify-center mt-5"
                    >
                        Verify
                        <FaCheck className="ml-2" />
                    </button>
                )}
            </div>
        </section>
    );
};

const StepThree = () => {
    return (
        <div>
            <Otp1 step={3} /> {/* Pass the 'step' prop here */}
        </div>
    );
};

export function otp() {
   return updatedOtp;
}

export default StepThree;

 
