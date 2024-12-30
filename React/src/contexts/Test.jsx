// import React from "react";
import { useStateContext } from "./paymentContext";
const Test = () => {
    const { amounts, setAmounts } = useStateContext();
    
    const mee = () => {
        setAmounts(10 + amounts);
        console.log(amounts);
       
    };

    return (
        <div className=" flex items-center justify-center gap-2  h-screen  relative">
            <p>Amounts: {amounts}</p>
            <button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={mee}>Set amounts to 10</button>
        </div>
    );
};

export default Test;