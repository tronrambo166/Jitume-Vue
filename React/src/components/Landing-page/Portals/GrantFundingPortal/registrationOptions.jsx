// File: registrationOptions.js
export const ORGANIZATION_TYPES = [
    "NGO",
    "Government", 
    "Development Fund", 
    "International Aid Agency"
];

export const FOCUS_SECTOR_OPTIONS = [
    "Agriculture",
    "Renewable Energy",
    "Tech",
   
];

export const TARGET_REGION_OPTIONS = [
    "Kenya", 
    "Rwanda", 
    "Uganda", 
    "Tanzania", 
    "Nigeria", 
    "South Africa"
];

export const INITIAL_FORM_DATA = {
    organizationName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    organizationType: "",
    focusSectors: [],
    targetRegions: [],
    missionStatement: "",
    termsAgreed: false,
};