// src/utils/scrollToTop.js
export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth', // This enables smooth scrolling
    });
};
