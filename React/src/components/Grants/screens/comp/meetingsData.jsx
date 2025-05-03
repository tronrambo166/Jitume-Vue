export const mockEngagements = [
    {
        id: 1,
        name: "Jane Smith",
        role: "Business Owner",
        description:
            "Jane is a seasoned entrepreneur with over 10 years of experience in the eco-friendly products industry. She has successfully launched multiple startups focused on sustainability and green technology.",
        image: "https://randomuser.me/api/portraits/women/75.jpg",
        company: "Eco Solutions",
    },
    {
        id: 2,
        name: "Mike Johnson",
        role: "Business Owner",
        description:
            "Mike is a tech enthusiast and entrepreneur with a passion for innovation. He has a strong background in software development and has co-founded several successful tech startups.",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
        company: "Tech Innovate",
    },
    {
        id: 3,
        name: "Sarah Williams",
        role: "Grant Owner",
        description:
            "Sarah is a grant owner with a focus on supporting startups in the renewable energy sector. She has a background in environmental science and is passionate about making a positive impact.",
        image: "https://randomuser.me/api/portraits/women/75.jpg",
        
        company: "Green Foundation",
    },
];

export const mockMeetings = [
    {
        id: 1,
        with: "Jane Smith",
        company: "Eco Solutions",
        description:
            "Jane is a seasoned entrepreneur with over 10 years of experience in the eco-friendly products industry. She has successfully launched multiple startups focused on sustainability and green technology.",

        date: "2025-05-03",
        startTime: "10:00",
        endTime: "10:30",
        link: "https://meet.google.com/abc-defg-hij",
        status: "confirmed",
    },
    {
        id: 2,
        with: "Mike Johnson",
        company: "Tech Innovate",
        description:
            "Mike is a tech enthusiast and entrepreneur with a passion for innovation. He has a strong background in software development and has co-founded several successful tech startups.",

        date: "2025-05-05",
        startTime: "14:00",
        endTime: "14:30",
        link: "https://zoom.us/j/123456789",
        status: "pending",
    },
];
// Manu i think we can use this dummy data to test the components before we get the real data from the Nurul