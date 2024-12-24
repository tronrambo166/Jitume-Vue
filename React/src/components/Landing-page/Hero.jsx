import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axiosClient";
const Hero = () => {
    const { user } = useStateContext();
    const { token, setToken } = useStateContext();
    //alert(user.email)

    const emailVerify = (e) => {
        e.preventDefault();
        //setLoading(true); // Show spinner

        axiosClient
            .get(`emailVerify/${user.email}`)
            .then(({ data }) => {
                // Handle response statuses
                console.log(data);
                if (data.status === 200) {
                    $.alert({
                        title: "Alert!",
                        content:
                            "A verification link has been sent to your email, please check your email!",
                    });
                } else {
                    alert(data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="flex flex-col mt-[10px]  text-center ">
            {/*{token && 
      <div className="ml-[3px] flex justify-center mt-[-50px] mb-[10px]">
        <h1 style={{width:'100%', background:'rgb(225 200 85 / 50%)' }} className=" CustomFont mx-0 text-[black-500] w-[290px] h-[51] text-center text-[15px] whitespace-nowrap font-semibold px-5 py-3">
            Your &nbsp;email &nbsp;is &nbsp;not &nbsp;verified! &nbsp; 
            <button onClick={emailVerify} className="bg-yellow-400 px-3 py-2 rounded" > Verify Now </button>
          </h1>
      </div>
    }*/}

            <div className="mr-[6px] flex justify-center">
                {" "}
                <div className="w-auto max-w-sm px-4 mt-4 flex justify-center">
                    <h1 className="bg-white/20 text-yellow-300 rounded-full font-bold text-sm sm:text-base px-4 py-3 shadow-lg">
                        Your Trusted Fundraising Platform
                    </h1>
                </div>
            </div>
            <h2 className="text-[30px] sm:text-[50px] md:text-[70px] mt-6 leading-[40px] sm:leading-[60px] md:leading-[80px] text-white font-semibold">
                Empowering Businesses, Delivering
                <br /> Solutions, Driving Change
            </h2>
            <div>
                <h3 className="text-white py-4 text-[14px] mt-6 sm:text-[16px] md:text-[18px]">
                    Jitume is a simple and transparent investment platform
                    designed for experienced and
                    <br />
                    aspiring socially responsible investors
                </h3>
            </div>
        </div>
    );
};

export default Hero;
