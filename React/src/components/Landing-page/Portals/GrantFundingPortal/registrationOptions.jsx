// File: registrationOptions.js
export const ORGANIZATION_TYPES = [
    "NGO",
    "Government", 
    "Development Fund", 
    "International Aid Agency"
];

export const FOCUS_SECTOR_OPTIONS = [
<<<<<<< HEAD
    "Agriculture", 
    "Renewable Energy", 
    "Tech"
=======
    "Agriculture",
    "Renewable Energy",
    "Tech",
   
>>>>>>> 12b9ff5463a2f99939642a5cf36054a3b2367f55
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