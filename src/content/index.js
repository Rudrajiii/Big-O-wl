console.log("Big(O)wl Content script loaded!");

function debounce(func , wait){
  let timeout;
  return function(...args){
    clearTimeout(timeout);
    timeout = setTimeout(()=> func.apply(this , args), wait);
  }
}

// Function to get selected text
function getSelectedText() {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  console.log("Selected text:", text); // Debug log
  return text;
}



// Function to save selected code to storage
function saveSelectedCode(code) {
  if (code && code.length > 2) { // Only save if it's meaningful text (at least 3 characters)
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ selectedCode: code }, () => {
          if (chrome.runtime.lastError) {
            console.error('Chrome storage error:', chrome.runtime.lastError);
          } else {
            console.log('Code saved:', code);
          }
        });
      }
    } catch (error) {
      console.error('Error saving selected code:', error);
    }
  }
}

/**
 * Enhanced function to handle text selection with multiple triggers
 * @debouncing - added
 */

const debounceHandleSection = debounce(()=>{
  const selectedText = getSelectedText();
  if (selectedText) {
    saveSelectedCode(selectedText);
  }
},100);

// Listen for text selection with multiple event types
document.addEventListener('mouseup', debounceHandleSection, true);
document.addEventListener('selectstart', debounceHandleSection, true);

// Listen for keyup events (for keyboard selection)
document.addEventListener('keyup', (e) => {
  // Check if user pressed Ctrl+A or used arrow keys with Shift
  if (e.ctrlKey || e.shiftKey || e.key === 'a' || e.key === 'A') {
    debounceHandleSection();
  }
}, true);

// Listen for selection changes (works better on some sites)
document.addEventListener('selectionchange', () => {
  debounceHandleSection();
});

// Listen for copy events (when users copy text)
document.addEventListener('copy', () => {
  debounceHandleSection();
}, true);

// Additional trigger for sites that use custom selection handling
window.addEventListener('mouseup', debounceHandleSection, true);

// Listen for touch events (mobile/tablet support)
document.addEventListener('touchend', () => {
  setTimeout(debounceHandleSection, 100);
}, true);