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
                    // Generate fallback image based on initials
                    const initials = getInitials(
                        data.user.fname,
                        data.user.lname
                    );
                    const fallback = generateFallbackImage(initials);
                    setImageSrc(fallback);
                }
            })
            .catch(() => {
                showAlert(
                    "error",
                    "Failed to load user data. Please try again."
                );
            });
    }, [showAlert]);

    const getInitials = (firstName, lastName) => {
        const firstInitial = firstName ? firstName[0].toUpperCase() : "";
        const lastInitial = lastName ? lastName[0].toUpperCase() : "";
        return firstInitial + lastInitial;
    };

    const generateFallbackImage = (initials) => {
        const colors = [
            "#FF7F7F",
            "#FFD700",
            "#90EE90",
            "#87CEFA",
            "#DDA0DD",
            "#FF6347",
        ];
        const hash = initials.charCodeAt(0) + initials.charCodeAt(1);
        const color = colors[hash % colors.length];

        // Generate a base64 SVG as fallback
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" style="background:${color};border-radius:50%;">
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="36" fill="white">
                    ${initials}
                </text>
            </svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    return imageSrc;
};

export default DefaultImg;
