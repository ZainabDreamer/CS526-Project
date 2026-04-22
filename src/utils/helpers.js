// Shumouliya - Utility Helpers

/**
 * Get color based on inclusivity score
 */
export const getScoreColor = (score) => {
  if (score >= 80) return '#2E8B57';
  if (score >= 60) return '#FF8C00';
  return '#E53935';
};

/**
 * Truncate long Arabic or English text
 */
export const truncate = (text, maxLength = 60) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Format a date string to Arabic-friendly display
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr;
};
