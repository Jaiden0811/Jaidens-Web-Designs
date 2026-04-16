// Helper utilities
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
};

export const generateOrderId = () => {
  return 'ORD-' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const sanitizeInput = (input) => {
  return String(input)
    .trim()
    .replace(/[<>\"']/g, '')
    .substring(0, 1000); // Limit length
};

export const generateTimelineDates = (startDate) => {
  const timeline = {
    planning: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000),
    designing: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
    coding: new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
    testing: new Date(startDate.getTime() + 12 * 24 * 60 * 60 * 1000),
    launch: new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000)
  };
  return timeline;
};
