// Load CSS styles
export const loadStyles = () => {
    if (document.querySelector('link[href*="leetcode-overlay.css"]')) {
      console.log('🦉 Styles already loaded');
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('src/content/leetcode-overlay.css');
    document.head.appendChild(link);
    console.log('🦉 Styles loaded:', link.href);
  };