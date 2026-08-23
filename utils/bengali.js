const digitMap = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
};

// Empty-string fallback — safe to inline inside formatted strings.
export const engToBengaliDigit = (input) => {
  if (input === undefined || input === null) return '';
  return input.toString().split('').map(char => digitMap[char] || char).join('');
};

// Em-dash fallback — for standalone label/value display where a blank looks broken.
export const toBengaliDigits = (str) => {
  if (str === undefined || str === null || str === '') return '—';
  return str.toString().replace(/[0-9]/g, (w) => digitMap[w]);
};
