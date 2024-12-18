import React, { useState, useEffect } from "react";
import axiosClient from "../../../../axiosClient"; // Adjust path as needed
import { useAlert } from "../../../partials/AlertContext"; // Adjust path as needed

const DefaultImg = () => {
    const { showAlert } = useAlert();

    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        // Fetch user data from the API
        axiosClient
            .get("/checkAuth")
            .then(({ data }) => {
                const userImage = data.user.image || null;

                if (userImage) {
                    setImageSrc(userImage); // Use the user's image if available
                } else {
                    // Generate fallback image based on initials and user ID
                    const initials = getInitials(
                        data.user.fname,
                        data.user.lname
                    );
                    const fallback = generateFallbackImage(
                        initials,
                        data.user.id
                    ); // Pass user ID here
                    setImageSrc(fallback);
                }
            })
            // .catch(() => {
            //     showAlert(
            //         "error",
            //         "Failed to load user data. Please try again."
            //     );
            // });
    }, [showAlert]);

    const getInitials = (firstName, lastName) => {
        const firstInitial = firstName ? firstName[0].toUpperCase() : "";
        const lastInitial = lastName ? lastName[0].toUpperCase() : "";
        return firstInitial + lastInitial;
    };

    const generateFallbackImage = (initials, userId) => {
        const colors = [
            "#8B0000", // Dark Red (Royal and luxurious)
            "#FFD700", // Gold (Symbolizing royalty)
            "#006400", // Dark Green (Rich and elegant)
            "#4B0082", // Indigo (Deep and regal)
            "#8A2BE2", // Blue Violet (Royal purple)
            "#B22222", // Firebrick Red (Warm and sophisticated)
        ];

        // Use the user ID to generate a unique color
        // Ensure the userId is a number and calculate the hash
        const hash = userId; // Directly use user ID
        const color = colors[hash % colors.length]; // Ensure the color stays within the array range

        // Generate a base64 SVG as fallback
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" style="background:${color};border-radius:50%;">
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="36" fill="white">
                    ${initials}
                </text>
            </svg>`;

        // Return the base64 encoded image
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    return imageSrc;
};

export default DefaultImg;
