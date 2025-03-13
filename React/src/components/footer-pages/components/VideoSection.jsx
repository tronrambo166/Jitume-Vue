import React, { useState, useRef, useEffect } from "react";

const VideoSection = ({ section, isLastSection, isAlternate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef(null);

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    useEffect(() => {
        if (videoRef.current) {
            if (isHovered) {
                videoRef.current.contentWindow?.postMessage(
                    '{"event":"command","func":"playVideo","args":""}',
                    "*"
                );
            } else {
                videoRef.current.contentWindow?.postMessage(
                    '{"event":"command","func":"pauseVideo","args":""}',
                    "*"
                );
            }
        }
    }, [isHovered]);

    const getEmbedUrl = (url) => {
        if (!url) return "";
        return url.includes("?")
            ? `${url}&enablejsapi=1&autoplay=0&mute=1`
            : `${url}?enablejsapi=1&autoplay=0&mute=1`;
    };

    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 ${
                !isLastSection ? "mb-8" : ""
            }`}
        >
            {/* Text Content Section - Now First */}
            <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-semibold mb-4 text-green">
                    {section.title}
                </h2>
                <div className="prose max-w-none">
                    {section.description.map((paragraph, index) => (
                        <p key={index} className="mb-4">
                            {paragraph}
                        </p>
                    ))}

                    {section.listItems.length > 0 && (
                        <>
                            <p className="font-medium mb-2 text-green">
                                The video covers:
                            </p>
                            <ul className="list-disc pl-6">
                                {section.listItems.map((item, index) => (
                                    <li key={index} className="mb-2">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>

            {/* Video Section - Now Second */}
            <div
                className="relative w-full aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="region"
                aria-label="Video Section"
            >
                {section.videoUrl ? (
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                <div className="text-white text-center">
                                    <div className="w-16 h-16 mx-auto border-4 border-green border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-2">Loading video...</p>
                                </div>
                            </div>
                        )}
                        <iframe
                            ref={videoRef}
                            width="100%"
                            height="100%"
                            src={getEmbedUrl(section.videoUrl)}
                            title={section.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={handleIframeLoad}
                            style={{ display: isLoading ? "none" : "block" }}
                        />
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-600">
                        {section.title} Video
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoSection;