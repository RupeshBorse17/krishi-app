import React, { createContext, useContext, useState, ReactNode } from "react";

type Lang = "mr" | "en";

type Translations = Record<string, Record<Lang, string>>;

const t: Translations = {
  appName: { mr: "शेतकरी मित्र", en: "Farmer Mitra" },
  dashboard: { mr: "मुखपृष्ठ", en: "Dashboard" },
  land: { mr: "जमीन व पीक", en: "Land & Crops" },
  market: { mr: "बाजारभाव", en: "Market Rates" },
  reminders: { mr: "स्मरणपत्रे", en: "Reminders" },
  expenses: { mr: "खर्च", en: "Expenses" },
  totalLand: { mr: "एकूण जमीन", en: "Total Land" },
  activeCrops: { mr: "सक्रिय पिके", en: "Active Crops" },
  expectedYield: { mr: "अपेक्षित उत्पन्न", en: "Expected Yield" },
  todayMarket: { mr: "आजचे बाजारभाव", en: "Today's Market" },
  profitSummary: { mr: "नफा सारांश", en: "Profit Summary" },
  quickActions: { mr: "जलद कृती", en: "Quick Actions" },
  addCrop: { mr: "पीक जोडा", en: "Add Crop" },
  addLand: { mr: "जमीन जोडा", en: "Add Land" },
  addExpense: { mr: "खर्च जोडा", en: "Add Expense" },
  acres: { mr: "एकर", en: "Acres" },
  crops: { mr: "पिके", en: "Crops" },
  quintals: { mr: "क्विंटल", en: "Quintals" },
  welcome: { mr: "नमस्कार, शेतकरी!", en: "Namaste, Farmer!" },
  perQuintal: { mr: "प्रति क्विंटल", en: "per quintal" },
  wheat: { mr: "गहू", en: "Wheat" },
  rice: { mr: "तांदूळ", en: "Rice" },
  soybean: { mr: "सोयाबीन", en: "Soybean" },
  cotton: { mr: "कापूस", en: "Cotton" },
  sugarcane: { mr: "ऊस", en: "Sugarcane" },
  onion: { mr: "कांदा", en: "Onion" },
  totalExpense: { mr: "एकूण खर्च", en: "Total Expense" },
  totalIncome: { mr: "एकूण उत्पन्न", en: "Total Income" },
  netProfit: { mr: "निव्वळ नफा", en: "Net Profit" },
  water: { mr: "पाणी", en: "Water" },
  pesticide: { mr: "कीटकनाशक", en: "Pesticide" },
  fertilizer: { mr: "खत", en: "Fertilizer" },
  harvest: { mr: "कापणी", en: "Harvest" },
  today: { mr: "आज", en: "Today" },
  upcoming: { mr: "येणारे", en: "Upcoming" },
  completed: { mr: "पूर्ण", en: "Completed" },
  monthlyOverview: { mr: "मासिक विहंगावलोकन", en: "Monthly Overview" },
  seeds: { mr: "बियाणे", en: "Seeds" },
  labor: { mr: "मजुरी", en: "Labor" },
  equipment: { mr: "यंत्रसामग्री", en: "Equipment" },
  other: { mr: "इतर", en: "Other" },
  chatbot: { mr: "मदत", en: "Help" },
  askQuestion: { mr: "प्रश्न विचारा...", en: "Ask a question..." },
  login: { mr: "लॉगिन", en: "Login" },
  signup: { mr: "नोंदणी", en: "Sign Up" },
  loginSubtitle: { mr: "तुमच्या खात्यात लॉगिन करा", en: "Sign in to your account" },
  signupSubtitle: { mr: "नवीन खाते तयार करा", en: "Create a new account" },
  fullName: { mr: "पूर्ण नाव", en: "Full Name" },
  fullNamePlaceholder: { mr: "तुमचे नाव", en: "Your name" },
  emailLabel: { mr: "ईमेल", en: "Email" },
  emailPlaceholder: { mr: "email@example.com", en: "email@example.com" },
  passwordLabel: { mr: "पासवर्ड", en: "Password" },
  passwordPlaceholder: { mr: "पासवर्ड टाका", en: "Enter password" },
  noAccount: { mr: "खाते नाही? नोंदणी करा", en: "No account? Sign up" },
  hasAccount: { mr: "खाते आहे? लॉगिन करा", en: "Have an account? Login" },
  signupSuccess: { mr: "नोंदणी यशस्वी!", en: "Signup successful!" },
  signupSuccessDesc: { mr: "तुमचे खाते तयार झाले", en: "Your account has been created" },
  error: { mr: "त्रुटी", en: "Error" },
  profile: { mr: "प्रोफाइल", en: "Profile" },
  profileDetails: { mr: "प्रोफाइल माहिती", en: "Profile Details" },
  farmName: { mr: "शेताचे नाव", en: "Farm Name" },
  farmNamePlaceholder: { mr: "तुमच्या शेताचे नाव", en: "Your farm name" },
  locationLabel: { mr: "स्थान", en: "Location" },
  locationPlaceholder: { mr: "गाव/तालुका", en: "Village/Taluka" },
  totalLandAcres: { mr: "एकूण जमीन (एकर)", en: "Total Land (Acres)" },
  saveProfile: { mr: "प्रोफाइल जतन करा", en: "Save Profile" },
  profileSaved: { mr: "प्रोफाइल जतन झाले!", en: "Profile saved!" },
  logout: { mr: "बाहेर पडा", en: "Logout" },
  farmer: { mr: "शेतकरी", en: "Farmer" },
  addPlot: { mr: "शेत जोडा", en: "Add Plot" },
  addReminder: { mr: "स्मरणपत्र जोडा", en: "Add Reminder" },
  save: { mr: "जतन करा", en: "Save" },
  cancel: { mr: "रद्द करा", en: "Cancel" },
  delete: { mr: "हटवा", en: "Delete" },
  edit: { mr: "संपादित करा", en: "Edit" },
  plotName: { mr: "शेताचे नाव", en: "Plot Name" },
  crop: { mr: "पीक", en: "Crop" },
  stage: { mr: "टप्पा (%)", en: "Stage (%)" },
  reminderLabel: { mr: "काम", en: "Task" },
  reminderTime: { mr: "वेळ", en: "Time" },
  reminderDate: { mr: "तारीख", en: "Date" },
  amount: { mr: "रक्कम (₹)", en: "Amount (₹)" },
  description: { mr: "वर्णन", en: "Description" },
  saved: { mr: "जतन झाले!", en: "Saved!" },
  deleted: { mr: "हटवले गेले", en: "Deleted" },
  loading: { mr: "लोड होत आहे...", en: "Loading..." },
  noPlots: { mr: "अजून शेत जोडले नाहीत", en: "No plots added yet" },
  noReminders: { mr: "अजून स्मरणपत्रे नाहीत", en: "No reminders yet" },
  noExpenses: { mr: "अजून खर्च नाहीत", en: "No expenses yet" },
};

type LanguageContextType = {
  lang: Lang;
  toggleLang: () => void;
  tr: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("mr");

  const toggleLang = () => setLang((prev) => (prev === "mr" ? "en" : "mr"));

  const tr = (key: string) => t[key]?.[lang] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, tr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
};
