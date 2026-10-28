import { useLocalStorage } from "./storage";

export type Language = "en" | "kn";

export interface Translations {
  appName: string;
  appTagline: string;
  langName: string;
  nav: {
    dashboard: string;
    recommend: string;
    crops: string;
    soil: string;
    weather: string;
    water: string;
    profit: string;
    fertilizer: string;
    pests: string;
    market: string;
    schemes: string;
    assistant: string;
    history: string;
    profile: string;
    settings: string;
    login: string;
    logout: string;
    more: string;
  };
  auth: {
    title: string;
    subtitle: string;
    mobileLabel: string;
    mobilePlaceholder: string;
    sendOtp: string;
    otpSentMsg: string;
    enterOtp: string;
    verifyLogin: string;
    changeMobile: string;
    newFarmerPrompt: string;
    registerTitle: string;
    farmerName: string;
    village: string;
    taluk: string;
    farmArea: string;
    soilType: string;
    waterSource: string;
    preferredLang: string;
    registerBtn: string;
    backToHome: string;
    demoNotice: string;
    loggedInAs: string;
    logoutBtn: string;
    saveProfile: string;
    profileSaved: string;
    invalidPhone: string;
    invalidOtp: string;
    demoOtpHint: string;
    resendOtp: string;
  };
  dashboard: {
    welcome: string;
    tagline: string;
    description: string;
    primaryAction: string;
    regionNotice: string;
    secondaryTitle: string;
    cropExplorerTitle: string;
    cropExplorerDesc: string;
    soilTitle: string;
    soilDesc: string;
    historyTitle: string;
    historyDesc: string;
    profileTitle: string;
    profileDesc: string;
    disclaimer: string;
  };
  recommend: {
    title: string;
    subtitle: string;
    locationSection: string;
    soilSection: string;
    weatherSection: string;
    optionalNote: string;
    talukLabel: string;
    villageLabel: string;
    soilTypeLabel: string;
    soilPhLabel: string;
    nLabel: string;
    pLabel: string;
    kLabel: string;
    seasonLabel: string;
    rainfallLabel: string;
    waterLabel: string;
    irrigationLabel: string;
    irrigationCheckbox: string;
    areaLabel: string;
    unitLabel: string;
    fillSample: string;
    reset: string;
    submit: string;
    submitting: string;
    resultsTitle: string;
    disclaimer: string;
    confidenceHigh: string;
    confidenceMedium: string;
    confidenceLow: string;
    reasonsTitle: string;
    limitationsTitle: string;
    cultivationAdvice: string;
    saveBtn: string;
    compareBtn: string;
    detailsBtn: string;
    noResults: string;
    noResultsHelp: string;
    viewInExplorer: string;
    seasonKharif: string;
    seasonRabi: string;
    seasonSummer: string;
    seasonPerennial: string;
    waterLow: string;
    waterModerate: string;
    waterHigh: string;
    soilTestHelp: string;
  };
  explorer: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allTypes: string;
    allSeasons: string;
    allWater: string;
    viewDetails: string;
    noMatch: string;
    regionalRationale: string;
    limitations: string;
    growingConditions: string;
    howToGrow: string;
    backToList: string;
    establishedRegionalCrop: string;
  };
  common: {
    demoBadge: string;
    demoRuleEngine: string;
    sampleData: string;
    learnMore: string;
    close: string;
    save: string;
    saved: string;
    delete: string;
    back: string;
    confirm: string;
    required: string;
    optional: string;
    days: string;
    quintal: string;
    acre: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: "Raitha Bandhu",
    appTagline: "Region-Specific Agricultural Advisory for Southern Bengaluru & Ramanagara",
    langName: "English",
    nav: {
      dashboard: "Dashboard",
      recommend: "Get Recommendation",
      crops: "Crop Explorer",
      soil: "Soil Health",
      weather: "Weather Calendar",
      water: "Water & Irrigation",
      profit: "Cost & Profit",
      fertilizer: "Fertilizer Guide",
      pests: "Pests & Diseases",
      market: "Market Prices",
      schemes: "Govt. Schemes",
      assistant: "Farming Q&A",
      history: "Saved Recommendations",
      profile: "Farmer Profile",
      settings: "Preferences",
      login: "Farmer Login",
      logout: "Log Out",
      more: "More",
    },
    auth: {
      title: "Farmer Login",
      subtitle: "Simple login with your mobile number and OTP",
      mobileLabel: "Mobile Number",
      mobilePlaceholder: "10-digit mobile number",
      sendOtp: "Send OTP",
      otpSentMsg: "One-Time Password (OTP) sent to +91",
      enterOtp: "Enter 6-digit OTP",
      verifyLogin: "Verify & Login",
      changeMobile: "Change mobile number",
      newFarmerPrompt: "New farmer? Register here",
      registerTitle: "Farmer Registration",
      farmerName: "Farmer's Full Name",
      village: "Village / Locality",
      taluk: "Taluk / Region",
      farmArea: "Farm Area (Acres)",
      soilType: "Primary Soil Type",
      waterSource: "Water / Irrigation Source",
      preferredLang: "Preferred Language",
      registerBtn: "Register & Continue",
      backToHome: "Return to Main Page",
      demoNotice: "Demo Mode: Real SMS gateway is not connected. Enter any 6-digit OTP (e.g., 123456) to proceed.",
      loggedInAs: "Logged in as",
      logoutBtn: "Log Out",
      saveProfile: "Save Farm Information",
      profileSaved: "Profile details saved successfully on this device.",
      invalidPhone: "Please enter a valid 10-digit Indian mobile number.",
      invalidOtp: "Please enter the 6-digit OTP.",
      demoOtpHint: "Demo OTP is: 123456",
      resendOtp: "Resend OTP",
    },
    dashboard: {
      welcome: "Namaskara, Raitha Bandhu 🙏",
      tagline: "Region-specific crop recommendations for Harohalli, Kanakapura & Southern Bengaluru",
      description: "Find the most suitable crops for your local red soils, monsoon patterns, and water resources based on regional agricultural evidence from UAS Bengaluru and Ramanagara KVK.",
      primaryAction: "Get Crop Recommendation",
      regionNotice: "Calibrated specifically for Eastern Dry Zone (Zone 5) - Harohalli, Kanakapura, Ramanagara, Channapatna & Southern Bengaluru outskirts.",
      secondaryTitle: "Secondary Agricultural Tools",
      cropExplorerTitle: "Regional Crop Catalogue",
      cropExplorerDesc: "Browse crops cultivated across Kanakapura & Harohalli with local cultivation rationale.",
      soilTitle: "Soil Health Summary",
      soilDesc: "Check red soil nutrient balance (N, P, K, pH) and Soil Health Card guidelines.",
      historyTitle: "Saved Recommendations",
      historyDesc: "Revisit and review your previous crop recommendations on this device.",
      profileTitle: "Farmer Profile",
      profileDesc: "Manage your farm location, soil type, and preferred language.",
      disclaimer: "Raitha Bandhu provides advisory guidance based on regional agro-climatic research. Final planting decisions should account for local microclimate, ground water depth, and APMC market demand.",
    },
    recommend: {
      title: "Crop Recommendation",
      subtitle: "Tailored to Harohalli, Kanakapura & Southern Bengaluru soils and climate",
      locationSection: "1. Farm Location in Region",
      soilSection: "2. Soil Details (Optional soil test values)",
      weatherSection: "3. Planting Season & Water Availability",
      optionalNote: "You do not need to fill all technical values. Optional fields may be left blank; recommendations will use verified regional baselines.",
      talukLabel: "Taluk / Sub-district",
      villageLabel: "Village / Locality",
      soilTypeLabel: "Soil Type (if known)",
      soilPhLabel: "Soil pH",
      nLabel: "Available Nitrogen (N)",
      pLabel: "Available Phosphorus (P)",
      kLabel: "Available Potassium (K)",
      seasonLabel: "Intended Planting Season",
      rainfallLabel: "Expected Rainfall (mm)",
      waterLabel: "Water Availability",
      irrigationLabel: "Irrigation Access",
      irrigationCheckbox: "I have access to irrigation (Borewell / Drip / Tank / Canal)",
      areaLabel: "Farm Area",
      unitLabel: "Unit",
      fillSample: "Fill sample regional values",
      reset: "Reset Form",
      submit: "Find Suitable Crops",
      submitting: "Analyzing regional suitability…",
      resultsTitle: "Recommended Crops for Your Farm",
      disclaimer: "Recommendation based on documented regional agro-climatic suitability from UAS Bengaluru (GKVK) & Ramanagara agricultural records. No crop is guaranteed to succeed; local soil tests improve accuracy.",
      confidenceHigh: "High Regional Match",
      confidenceMedium: "Moderate Regional Match",
      confidenceLow: "Marginal Match (Caution)",
      reasonsTitle: "Why this crop suits your farm",
      limitationsTitle: "Risks & Cultivation Considerations",
      cultivationAdvice: "Agronomic Practice",
      saveBtn: "Save",
      compareBtn: "Compare",
      detailsBtn: "Full Details",
      noResults: "No crops in our regional catalogue match these exact conditions.",
      noResultsHelp: "Try selecting a broader planting season or check irrigation availability. Most crops in Kanakapura and Harohalli depend on Kharif rains or borewell drip.",
      viewInExplorer: "Browse all regional crops in Explorer",
      seasonKharif: "Kharif (Monsoon: Jun–Oct)",
      seasonRabi: "Rabi (Winter: Oct–Feb)",
      seasonSummer: "Summer (Zaid: Feb–May)",
      seasonPerennial: "Perennial (Year-round / Orchard)",
      waterLow: "Rainfed / Low",
      waterModerate: "Moderate (Seasonal supply)",
      waterHigh: "Assured (Borewell / Drip)",
      soilTestHelp: "From Soil Health Card. If unavailable, leave blank.",
    },
    explorer: {
      title: "Regional Crop Explorer",
      subtitle: "Crops verified for Harohalli, Kanakapura and Southern Bengaluru (Zone 5)",
      searchPlaceholder: "Search by English or Kannada name (e.g., Ragi, ತೊಗರಿ)…",
      allTypes: "All Categories",
      allSeasons: "All Seasons",
      allWater: "Any Water Need",
      viewDetails: "View Cultivation Details",
      noMatch: "No regional crops found matching your filters.",
      regionalRationale: "Local Regional Cultivation Rationale",
      limitations: "Agronomic Limitations & Risks",
      growingConditions: "Ideal Growing Conditions",
      howToGrow: "Recommended Cultivation Practices (UAS Bengaluru / KVK)",
      backToList: "Back to Crop Catalogue",
      establishedRegionalCrop: "Verified Southern Karnataka Regional Crop",
    },
    common: {
      demoBadge: "Demo / Sample",
      demoRuleEngine: "Regional Rule Advisory Engine",
      sampleData: "Local Sample Data",
      learnMore: "Learn More",
      close: "Close",
      save: "Save",
      saved: "Saved",
      delete: "Delete",
      back: "Back",
      confirm: "Confirm",
      required: "Required",
      optional: "Optional",
      days: "days",
      quintal: "quintal",
      acre: "acre",
    },
  },
  kn: {
    appName: "ರೈತ ಬಂಧು",
    appTagline: "ಹಾರೋಹಳ್ಳಿ, ಕನಕಪುರ ಮತ್ತು ದಕ್ಷಿಣ ಬೆಂಗಳೂರು ಪ್ರದೇಶದ ಕೃಷಿ ಸಲಹಾ ವ್ಯವಸ್ಥೆ",
    langName: "ಕನ್ನಡ",
    nav: {
      dashboard: "ಮುಖಪುಟ",
      recommend: "ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ",
      crops: "ಬೆಳೆಗಳ ಮಾಹಿತಿ",
      soil: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
      weather: "ಹವಾಮಾನ ಮತ್ತು ಕ್ಯಾಲೆಂಡರ್",
      water: "ನೀರು ಮತ್ತು ನೀರಾವರಿ",
      profit: "ವೆಚ್ಚ ಮತ್ತು ಆದಾಯ",
      fertilizer: "ಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶಿ",
      pests: "ಕೀಟ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ",
      market: "ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ",
      schemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      assistant: "ಕೃಷಿ ಪ್ರಶ್ನೋತ್ತರ",
      history: "ಉಳಿಸಿದ ಬೆಳೆಗಳು",
      profile: "ರೈತರ ವಿವರ",
      settings: "ಆದ್ಯತೆಗಳು",
      login: "ರೈತರ ಲಾಗಿನ್",
      logout: "ಲಾಗ್ ಔಟ್",
      more: "ಇನ್ನಷ್ಟು",
    },
    auth: {
      title: "ರೈತರ ಲಾಗಿನ್",
      subtitle: "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ಒಟಿಪಿ ಮೂಲಕ ಸುಲಭವಾಗಿ ಪ್ರವೇಶಿಸಿ",
      mobileLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      mobilePlaceholder: "10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      sendOtp: "ಒಟಿಪಿ ಕಳುಹಿಸಿ",
      otpSentMsg: "+91 ಸಂಖ್ಯೆಗೆ ಒಟಿಪಿ (OTP) ಕಳುಹಿಸಲಾಗಿದೆ",
      enterOtp: "6 ಅಂಕಿಗಳ ಒಟಿಪಿ ನಮೂದಿಸಿ",
      verifyLogin: "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಾಗಿನ್ ಮಾಡಿ",
      changeMobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಬದಲಾಯಿಸಿ",
      newFarmerPrompt: "ಹೊಸ ರೈತರೇ? ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ",
      registerTitle: "ಹೊಸ ರೈತರ ನೋಂದಣಿ",
      farmerName: "ರೈತರ ಪೂರ್ಣ ಹೆಸರು",
      village: "ಗ್ರಾಮ / ಊರು",
      taluk: "ತಾಲೂಕು / ಪ್ರದೇಶ",
      farmArea: "ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)",
      soilType: "ಮಣ್ಣಿನ ಪ್ರಕಾರ",
      waterSource: "ನೀರಿನ ಸೌಲಭ್ಯ / ಮೂಲ",
      preferredLang: "ಆದ್ಯತೆಯ ಭಾಷೆ",
      registerBtn: "ನೋಂದಾಯಿಸಿ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ",
      backToHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
      demoNotice: "ಡೆಮೊ ಆವೃತ್ತಿ: ನೈಜ ಎಸ್‌ಎಂಎಸ್ ಗೇಟ್‌ವೇ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ. ಮುಂದುವರಿಯಲು ಯಾವುದೇ 6 ಅಂಕಿಯ ಒಟಿಪಿ (ಉದಾ: 123456) ನಮೂದಿಸಿ.",
      loggedInAs: "ಲಾಗಿನ್ ಆಗಿರುವ ರೈತರು",
      logoutBtn: "ಲಾಗ್ ಔಟ್",
      saveProfile: "ಜಮೀನಿನ ಮಾಹಿತಿ ಉಳಿಸಿ",
      profileSaved: "ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಈ ಸಾಧನದಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.",
      invalidPhone: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10 ಅಂಕಿಗಳ ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.",
      invalidOtp: "ದಯವಿಟ್ಟು 6 ಅಂಕಿಗಳ ಒಟಿಪಿ ನಮೂದಿಸಿ.",
      demoOtpHint: "ಡೆಮೊ ಒಟಿಪಿ: 123456",
      resendOtp: "ಮತ್ತೊಮ್ಮೆ ಒಟಿಪಿ ಕಳುಹಿಸಿ",
    },
    dashboard: {
      welcome: "ನಮಸ್ಕಾರ, ರೈತ ಬಂಧುಗಳಿಗೆ ಸ್ವಾಗತ 🙏",
      tagline: "ಹಾರೋಹಳ್ಳಿ, ಕನಕಪುರ ಮತ್ತು ದಕ್ಷಿಣ ಬೆಂಗಳೂರು ಭಾಗದ ರೈತರಿಗಾಗಿ ವಿಶಿಷ್ಟ ಬೆಳೆ ಶಿಫಾರಸು",
      description: "ಬೆಂಗಳೂರು ಕೃಷಿ ವಿಶ್ವವಿದ್ಯಾಲಯ (GKVK) ಮತ್ತು ರಾಮನಗರ ಕೆವಿಕೆ ಸಂಶೋಧನೆಯ ಆಧಾರದ ಮೇಲೆ ನಿಮ್ಮ ಕೆಂಪು ಮಣ್ಣು, ಮಳೆ ಮತ್ತು ನೀರಿನ ಲಭ್ಯತೆಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ.",
      primaryAction: "ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ",
      regionNotice: "ಕರ್ನಾಟಕದ ಪೂರ್ವ ಒಣ ವಲಯ (ವಲಯ 5) - ಹಾರೋಹಳ್ಳಿ, ಕನಕಪುರ, ರಾಮನಗರ, ಚನ್ನಪಟ್ಟಣ ಹಾಗೂ ದಕ್ಷಿಣ ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರಕ್ಕೆ ವಿಶೇಷವಾಗಿ ಹೊಂದಿಸಲಾಗಿದೆ.",
      secondaryTitle: "ಇತರೆ ಕೃಷಿ ಉಪಕರಣಗಳು",
      cropExplorerTitle: "ಪ್ರಾದೇಶಿಕ ಬೆಳೆಗಳ ಕೋಶ",
      cropExplorerDesc: "ಕನಕಪುರ ಮತ್ತು ಹಾರೋಹಳ್ಳಿಯಲ್ಲಿ ಬೆಳೆಯಲಾಗುವ ಮುಖ್ಯ ಬೆಳೆಗಳ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
      soilTitle: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸಾರಾಂಶ",
      soilDesc: "ಕೆಂಪು ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳ ಸಮತೋಲನ (ಸಾರಜನಕ, ರಂಜಕ, ಪೊಟ್ಯಾಶ್, ಪಿ.ಎಚ್) ಪರಿಶೀಲಿಸಿ.",
      historyTitle: "ಉಳಿಸಿದ ಬೆಳೆಗಳು",
      historyDesc: "ನೀವು ಈ ಹಿಂದೆ ಪಡೆದ ಬೆಳೆ ಶಿಫಾರಸುಗಳನ್ನು ಮರಳಿ ವೀಕ್ಷಿಸಿ.",
      profileTitle: "ರೈತರ ಪ್ರೊಫೈಲ್",
      profileDesc: "ನಿಮ್ಮ ಜಮೀನಿನ ಸ್ಥಳ, ಮಣ್ಣಿನ ವಿವರ ಮತ್ತು ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ನವೀಕರಿಸಿ.",
      disclaimer: "ರೈತ ಬಂಧು ಪ್ರಾದೇಶಿಕ ಹವಾಮಾನ ಸಂಶೋಧನೆಯ ಆಧಾರದ ಮೇಲೆ ಸಲಹೆ ನೀಡುತ್ತದೆ. ಬೆಳೆ ನಾಟಿ ಮಾಡುವ ಮುನ್ನ ಸ್ಥಳೀಯ ಮಳೆ, ಅಂತರ್ಜಲ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆಯನ್ನು ಗಮನಿಸಿ.",
    },
    recommend: {
      title: "ಬೆಳೆ ಶಿಫಾರಸು",
      subtitle: "ಹಾರೋಹಳ್ಳಿ, ಕನಕಪುರ ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ ತಕ್ಕಂತೆ",
      locationSection: "1. ಜಮೀನಿನ ಸ್ಥಳ ವಿವರ",
      soilSection: "2. ಮಣ್ಣಿನ ವಿವರ (ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಹಿತಿ ಐಚ್ಛಿಕ)",
      weatherSection: "3. ಬಿತ್ತನೆ ಹಂಗಾಮು ಮತ್ತು ನೀರಿನ ಲಭ್ಯತೆ",
      optionalNote: "ಎಲ್ಲಾ ತಾಂತ್ರಿಕ ವಿವರಗಳನ್ನು ಕಡ್ಡಾಯವಾಗಿ ನಮೂದಿಸಬೇಕಾಗಿಲ್ಲ. ಮಣ್ಣು ಪರೀಕ್ಷೆ ಇಲ್ಲದಿದ್ದಲ್ಲಿ ಆ ಜಾಗಗಳನ್ನು ಖಾಲಿ ಬಿಡಬಹುದು; ಸ್ಥಳೀಯ ಸರಾಸರಿ ಮಾನದಂಡಗಳನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.",
      talukLabel: "ತಾಲೂಕು",
      villageLabel: "ಗ್ರಾಮ / ಊರು",
      soilTypeLabel: "ಮಣ್ಣಿನ ಪ್ರಕಾರ (ಗೊತ್ತಿದ್ದರೆ)",
      soilPhLabel: "ಮಣ್ಣಿನ ಪಿ.ಎಚ್ (pH)",
      nLabel: "ಲಭ್ಯ ಸಾರಜನಕ (Nitrogen - N)",
      pLabel: "ಲಭ್ಯ ರಂಜಕ (Phosphorus - P)",
      kLabel: "ಲಭ್ಯ ಪೊಟ್ಯಾಶ್ (Potassium - K)",
      seasonLabel: "ಬಿತ್ತನೆ ಮಾಡುವ ಹಂಗಾಮು",
      rainfallLabel: "ನಿರೀಕ್ಷಿತ ಮಳೆ (ಮಿ.ಮೀ)",
      waterLabel: "ನೀರಿನ ಲಭ್ಯತೆ",
      irrigationLabel: "ನೀರಾವರಿ ಸೌಲಭ್ಯ",
      irrigationCheckbox: "ನನ್ನ ಜಮೀನಿಗೆ ನೀರಾವರಿ ಸೌಲಭ್ಯವಿದೆ (ಬೋರ್‌ವೆಲ್ / ಹನಿ ನೀರಾವರಿ / ಕೆರೆ)",
      areaLabel: "ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ",
      unitLabel: "ಪ್ರಮಾಣ",
      fillSample: "ಮಾದರಿ ವಿವರಗಳನ್ನು ತುಂಬಿರಿ",
      reset: "ಮರುಹೊಂದಿಸಿ",
      submit: "ಸೂಕ್ತ ಬೆಳೆಗಳನ್ನು ಹುಡುಕಿ",
      submitting: "ಪ್ರಾದೇಶಿಕ ಹೊಂದಾಣಿಕೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ…",
      resultsTitle: "ನಿಮ್ಮ ಜಮೀನಿಗೆ ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು",
      disclaimer: "ಬೆಂಗಳೂರು ಕೃಷಿ ವಿಶ್ವವಿದ್ಯಾಲಯ (GKVK) ಮತ್ತು ರಾಮನಗರ ಕೃಷಿ ದಾಖಲೆಗಳ ಆಧಾರದ ಮೇಲೆ ಈ ಸಲಹೆ ನೀಡಲಾಗಿದೆ. ಯಾವುದೇ ಬೆಳೆ ನೂರಕ್ಕೆ ನೂರು ಯಶಸ್ವಿಯಾಗಲು ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಡಿಸುವುದು ಉತ್ತಮ.",
      confidenceHigh: "ಉತ್ತಮ ಪ್ರಾದೇಶಿಕ ಹೊಂದಾಣಿಕೆ",
      confidenceMedium: "ಮಧ್ಯಮ ಹೊಂದಾಣಿಕೆ",
      confidenceLow: "ಸಾಧಾರಣ ಹೊಂದಾಣಿಕೆ (ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ)",
      reasonsTitle: "ಈ ಬೆಳೆ ನಿಮ್ಮ ಜಮೀನಿಗೆ ಏಕೆ ಸೂಕ್ತ?",
      limitationsTitle: "ಮಿತಿಗಳು ಮತ್ತು ಗಮನಿಸಬೇಕಾದ ಅಂಶಗಳು",
      cultivationAdvice: "ಕೃಷಿ ಪದ್ಧತಿ ಮತ್ತು ಸಲಹೆ",
      saveBtn: "ಉಳಿಸಿ",
      compareBtn: "ಹೋಲಿಕೆ ಮಾಡಿ",
      detailsBtn: "ಸಂಪೂರ್ಣ ವಿವರ",
      noResults: "ಈ ನಮೂದಿಸಿದ ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಬೆಳೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
      noResultsHelp: "ದಯವಿಟ್ಟು ಬೇರೆ ಹಂಗಾಮು ಅಥವಾ ನೀರಾವರಿ ಸೌಲಭ್ಯವನ್ನು ಆಯ್ದುಕೊಳ್ಳಿ. ಕನಕಪುರ ಮತ್ತು ಹಾರೋಹಳ್ಳಿಯಲ್ಲಿ ಮುಂಗಾರು ಮಳೆ ಅಥವಾ ಬೋರ್‌ವೆಲ್ ನೀರಾವರಿ ಅವಶ್ಯಕ.",
      viewInExplorer: "ಎಲ್ಲಾ ಪ್ರಾದೇಶಿಕ ಬೆಳೆಗಳನ್ನು ನೋಡಿ",
      seasonKharif: "ಮುಂಗಾರು (Kharif: ಜೂನ್–ಅಕ್ಟೋಬರ್)",
      seasonRabi: "ಹಿಂಗಾರು (Rabi: ಅಕ್ಟೋಬರ್–ಫೆಬ್ರವರಿ)",
      seasonSummer: "ಬೇಸಿಗೆ (Summer: ಫೆಬ್ರವರಿ–ಮೇ)",
      seasonPerennial: "ವರ್ಷವಿಡೀ / ತೋಟಗಾರಿಕೆ (Perennial)",
      waterLow: "ಮಳೆಯಾಶ್ರಿತ / ಕಡಿಮೆ",
      waterModerate: "ಸಾಧಾರಣ (ಋತುಮಾನದ ನೀರು)",
      waterHigh: "ಖಚಿತ ನೀರಾವರಿ (ಬೋರ್‌ವೆಲ್ / ಹನಿ ನೀರಾವರಿ)",
      soilTestHelp: "ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್‌ನಿಂದ. ಇಲ್ಲದಿದ್ದಲ್ಲಿ ಖಾಲಿ ಬಿಡಿ.",
    },
    explorer: {
      title: "ಪ್ರಾದೇಶಿಕ ಬೆಳೆಗಳ ಮಾಹಿತಿ ಕೋಶ",
      subtitle: "ಹಾರೋಹಳ್ಳಿ, ಕನಕಪುರ ಮತ್ತು ದಕ್ಷಿಣ ಬೆಂಗಳೂರಿಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಗಳು (ವಲಯ 5)",
      searchPlaceholder: "ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ (ಉದಾ: ರಾಗಿ, ಟೊಮೇಟೊ)…",
      allTypes: "ಎಲ್ಲಾ ವಿಭಾಗಗಳು",
      allSeasons: "ಎಲ್ಲಾ ಹಂಗಾಮುಗಳು",
      allWater: "ಯಾವುದೇ ನೀರಿನ ಪ್ರಮಾಣ",
      viewDetails: "ಕೃಷಿ ವಿವರಗಳನ್ನು ನೋಡಿ",
      noMatch: "ಯಾವುದೇ ಬೆಳೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
      regionalRationale: "ಸ್ಥಳೀಯ ಕೃಷಿ ಸಾಕ್ಷ್ಯ ಮತ್ತು ಪ್ರಸ್ತುತತೆ",
      limitations: "ಬೆಳೆಯ ಮಿತಿಗಳು ಮತ್ತು ಎದುರಾಗಬಹುದಾದ ರೋಗಗಳು",
      growingConditions: "ಸೂಕ್ತ ಹವಾಮಾನ ಮತ್ತು ಮಣ್ಣಿನ ವಿವರ",
      howToGrow: "ಕೃಷಿ ವಿಶ್ವವಿದ್ಯಾಲಯ ಶಿಫಾರಸು ಮಾಡಿದ ಬೇಸಾಯ ಕ್ರಮಗಳು",
      backToList: "ಬೆಳೆಗಳ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ",
      establishedRegionalCrop: "ಸ್ಥಳೀಯವಾಗಿ ದೃಢೀಕೃತ ದಕ್ಷಿಣ ಕರ್ನಾಟಕದ ಬೆಳೆ",
    },
    common: {
      demoBadge: "ಡೆಮೊ / ಮಾದರಿ",
      demoRuleEngine: "ಪ್ರಾದೇಶಿಕ ನಿಯಮ ಆಧಾರಿತ ಎಂಜಿನ್",
      sampleData: "ಮಾದರಿ ದತ್ತಾಂಶ",
      learnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
      close: "ಮುಚ್ಚಿ",
      save: "ಉಳಿಸಿ",
      saved: "ಉಳಿಸಲಾಗಿದೆ",
      delete: "ಅಳಿಸಿ",
      back: "ಹಿಂದೆ",
      confirm: "ದೃಢೀಕರಿಸಿ",
      required: "ಕಡ್ಡಾಯ",
      optional: "ಐಚ್ಛಿಕ",
      days: "ದಿನಗಳು",
      quintal: "ಕ್ವಿಂಟಾಲ್",
      acre: "ಎಕರೆ",
    },
  },
};

export function useI18n() {
  const [lang, setLang] = useLocalStorage<Language>("rb-lang", "kn");
  const t = TRANSLATIONS[lang] ?? TRANSLATIONS.kn;

  const toggleLang = (newLang: Language) => {
    setLang(newLang);
    // Also keep km-lang synchronized for backward compatibility with existing code
    try {
      localStorage.setItem("km-lang", JSON.stringify(newLang));
    } catch { /* ignore */ }
  };

  return { lang, setLang: toggleLang, t };
}
