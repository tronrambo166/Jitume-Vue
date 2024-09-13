import servicecard from "../../images/servicecard.png"
const Localservicesection = () => {
  return (
    <div className="mt-[72px]">
      <div className="flex justify-center gap-[50px]   flex-wrap items-center">
    <div className="side1">
<h1 className="text-md font-semibold text-[#0A0A0A]/60">Discover local services</h1>
<h2 className="text-black text-2xl py-2 font-bold">Find the best  <span className="text-green"> local service </span> <br></br>in your area </h2>
<p className="font-semibold text-md py-2">Explore  categories to suite your needs. Connect  <br/> with businesses offering top-notch services.</p>
<button className="btn-primary py-2 px-6 my-3 rounded-xl">Get Started</button>
    </div>
    <div className="side2">
      <img src={servicecard} className="w-[350px]" alt="" />
    </div>
</div>

    </div>
  )
}

export default Localservicesection