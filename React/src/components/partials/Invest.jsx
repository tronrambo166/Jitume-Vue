import frame from "../../images/frame.png";
const Invest = () => {
    return (
        <div>
            <div className="w-full flex mx-auto my-[100px]">
                <div className="content flex gap-[150px] flex-wrap items-center justify-center ">
                    <p className="text-black font-bold text-[18px]">
                        <span>100%</span> of your investment<br></br>
                        goes to
                        <span className="text-green"> selected business.</span>
                    </p>

                    <img src={frame} alt="" />
                </div>
            </div>
        </div>
    );
};

export default Invest;