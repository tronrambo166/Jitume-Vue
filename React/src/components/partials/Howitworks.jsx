import locationIcon from "../../images/location.png";
import categoryIcon from "../../images/category.png";
import locResultsIcon from "../../images/locresults.png";
import chooseIcon from "../../images/choose.png";
import growIcon from "../../images/grow.png";

const HowItWorks = () => {
    const steps = [
        {
            imgSrc: locationIcon,
            imgAlt: "Location Icon",
            imgWidth: "w-[32px]",
            imgHeight: "h-[42.18px]",
            text: "Enter Your Location",
        },
        {
            imgSrc: categoryIcon,
            imgAlt: "Category Icon",
            imgWidth: "w-[32px]",
            imgHeight: "h-[32px]",
            text: "Choose a category",
        },
        {
            imgSrc: locResultsIcon,
            imgAlt: "Location Results Icon",
            imgWidth: "w-[32px]",
            imgHeight: "h-[32px]",
            text: "Get location results",
        },
        {
            imgSrc: chooseIcon,
            imgAlt: "Choose Business Icon",
            imgWidth: "w-[32px]",
            imgHeight: "h-[42.01px]",
            text: "Choose your business",
        },
        {
            imgSrc: growIcon,
            imgAlt: "Grow Business Icon",
            imgWidth: "w-[32px]",
            imgHeight: "h-[32px]",
            text: "Grow your business",
        },
    ];

    return (
        <section className="flex flex-col items-center w-full max-w-[832.55px] mx-auto gap-8 space-y-8 pb-6 mt-6">
            <div className="how-it-works-header mt-4">
                <h3 className="text-[24px] font-bold text-center">How Jitume Works</h3>
            </div>
            <div className="flex flex-col gap-6 px-4 md:px-[60px] lg:flex-row lg:justify-between lg:gap-8">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center max-w-full">
                        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#EAF7EE] mb-2">
                            <img
                                src={step.imgSrc}
                                alt={step.imgAlt}
                                className={`${step.imgWidth} ${step.imgHeight}`}
                            />
                        </div>
                        <p className="text-center whitespace-nowrap text-[16px] pt-4 text-[#000000] font-500">
                            {step.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
