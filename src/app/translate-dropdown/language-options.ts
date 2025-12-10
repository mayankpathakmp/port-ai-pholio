export interface LanguageOption {
  code: string;
  label: string;
}

export const INDIAN_LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'EN', label: 'English' },
  { code: 'HI', label: 'Hindi · हिन्दी' },
  { code: 'TA', label: 'Tamil · தமிழ்' },
  { code: 'TE', label: 'Telugu · తెలుగు' },
  { code: 'MR', label: 'Marathi · मराठी' },
  { code: 'BN', label: 'Bengali · বাংলা' },
  { code: 'GU', label: 'Gujarati · ગુજરાતી' },
  { code: 'KN', label: 'Kannada · ಕನ್ನಡ' },
  { code: 'ML', label: 'Malayalam · മലയാളം' },
  { code: 'PA', label: 'Punjabi · ਪੰਜਾਬੀ' },
  { code: 'OR', label: 'Odia · ଓଡ଼ିଆ' },
  { code: 'AS', label: 'Assamese · অসমীয়া' },
  { code: 'UR', label: 'Urdu · اُردُو‎' }
];

export const INDIAN_LANGUAGE_CODES = INDIAN_LANGUAGE_OPTIONS.map((option) => option.code.toLowerCase()).join(',');
