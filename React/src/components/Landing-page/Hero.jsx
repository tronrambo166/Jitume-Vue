const Hero = () => {
    return (
      <div className="flex flex-col mt-[50px] text-center py-4">
        <div className="ml-[3px] flex justify-center">
          <h1 className="bg-[#FFFFFF]/30 CustomFont mx-8 text-[#FDE047] w-[290px] h-[51] rounded-full text-center text-[15px] whitespace-nowrap font-semibold px-5 py-3">
            Your trusted fund-raising platform
          </h1>
        </div>
        <h2 className="text-[30px] sm:text-[50px] md:text-[70px] pt-4 leading-[40px] sm:leading-[60px] md:leading-[80px] text-white font-semibold">
          Empowering Businesses, Delivering<br /> Solutions, Driving Change
        </h2>
        <div>
          <h3 className="text-white py-4 text-[14px] sm:text-[16px] md:text-[18px]">
            Jitume is a simple and transparent investment platform designed for experienced and
            <br />
            aspiring socially responsible investors
          </h3>
        </div>
      </div>
    );
  };
  
  export default Hero;
  