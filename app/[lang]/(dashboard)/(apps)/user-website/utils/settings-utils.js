// Utility functions for settings management

/**
 * Example usage of different settings update methods
 */

// Method 1: Update multiple settings at once
export const updateMultipleSettings = async (updateSettingsMutation, settings) => {
  // This will send: { "settings[email]": "test@example.com", "settings[phone]": "+1234567890" }
  await updateSettingsMutation.mutateAsync({
    settings: {
      email: "test@example.com",
      phone: "+1234567890",
    },
  });
};

// Method 2: Update single setting
export const updateSingleSetting = async (updateSingleSettingMutation, key, value) => {
  // This will send: { "settings[email]": "test@example.com" }
  await updateSingleSettingMutation.mutateAsync({
    key: "email",
    value: "test@example.com",
  });
};

// Method 3: Update banner settings
export const updateBannerSettings = async (updateSettingsMutation, bannerData) => {
  // This will send: { 
  //   "settings[title_banner]": "New Title",
  //   "settings[description_banner]": "New Description",
  //   "settings[logo]": "logo_url",
  //   "settings[partner_logo]": "partner_logo_url",
  //   "settings[partner_banner]": "banner_url"
  // }
  await updateSettingsMutation.mutateAsync({
    settings: {
      title_banner: bannerData.title,
      description_banner: bannerData.description,
      logo: bannerData.logo,
      partner_logo: bannerData.partner_logo,
      partner_banner: bannerData.partner_banner,
    },
  });
};

// Method 4: Update contact settings
export const updateContactSettings = async (updateSettingsMutation, contactData) => {
  // This will send: { 
  //   "settings[email]": "contact@example.com",
  //   "settings[phone]": "+1234567890"
  // }
  await updateSettingsMutation.mutateAsync({
    settings: {
      email: contactData.email,
      phone: contactData.phone,
    },
  });
};

// Method 5: Toggle banner status
export const toggleBannerStatus = async (updateSingleSettingMutation, isActive) => {
  // This will send: { "settings[partner_banner]": true }
  await updateSingleSettingMutation.mutateAsync({
    key: "partner_banner",
    value: isActive,
  });
};

// Helper function to format settings for display
export const formatSettingsForDisplay = (settings) => {
  return {
    email: settings.email || "",
    phone: settings.phone || "",
    title_banner: settings.title_banner || "",
    description_banner: settings.description_banner || "",
    logo: settings.logo || "",
    partner_logo: settings.partner_logo || "",
    partner_banner: settings.partner_banner || "",
  };
};

// Helper function to validate settings
export const validateSettings = (settings) => {
  const errors = {};
  
  if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    errors.email = "Invalid email format";
  }
  
  if (settings.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(settings.phone.replace(/\s/g, ''))) {
    errors.phone = "Invalid phone number format";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}; 