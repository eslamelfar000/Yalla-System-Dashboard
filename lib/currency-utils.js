/**
 * Currency conversion utilities
 */

// Initialize default exchange rates if not set
export const initializeDefaultRates = () => {
  const usdRate = localStorage.getItem('usd_exchange_rate');
  const ilsRate = localStorage.getItem('ils_exchange_rate');
  
  if (!usdRate) {
    localStorage.setItem('usd_exchange_rate', '49.0898');
  }
  
  if (!ilsRate) {
    localStorage.setItem('ils_exchange_rate', '14.3755');
  }
};

// Get exchange rates from localStorage
export const getExchangeRates = () => {
  // Initialize default rates if not set
  initializeDefaultRates();
  
  const usdRate = parseFloat(localStorage.getItem('usd_exchange_rate')) || 0;
  const ilsRate = parseFloat(localStorage.getItem('ils_exchange_rate')) || 0;
  
  return {
    usd: usdRate,
    ils: ilsRate
  };
};

// Convert USD to EGP
export const convertUsdToEgp = (usdAmount) => {
  const rates = getExchangeRates();
  return usdAmount * rates.usd;
};

// Convert ILS to EGP
export const convertIlsToEgp = (ilsAmount) => {
  const rates = getExchangeRates();
  return ilsAmount * rates.ils;
};

// Convert EGP to USD
export const convertEgpToUsd = (egpAmount) => {
  const rates = getExchangeRates();
  return rates.usd > 0 ? egpAmount / rates.usd : 0;
};

// Convert EGP to ILS
export const convertEgpToIls = (egpAmount) => {
  const rates = getExchangeRates();
  return rates.ils > 0 ? egpAmount / rates.ils : 0;
};

// Format currency with proper symbol
export const formatCurrency = (amount, currency = 'EGP') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

// Get all currency conversions for a given EGP amount
export const getAllCurrencyConversions = (egpAmount) => {
  const rates = getExchangeRates();
  
  return {
    egp: egpAmount,
    usd: convertEgpToUsd(egpAmount),
    ils: convertEgpToIls(egpAmount),
    rates: rates
  };
};

// Check if exchange rates are set
export const areExchangeRatesSet = () => {
  const rates = getExchangeRates();
  return rates.usd > 0 && rates.ils > 0;
}; 