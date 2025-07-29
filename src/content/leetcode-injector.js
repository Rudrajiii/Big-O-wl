import { showTheComplexityOverlay } from './CoreOverlay/complexityOverlay.js';

/*
 @BigOwl Injector - add the whole feature beside "Analyze Complexity"
*/
(() => {
  console.log('🦉 BigOwl LeetCode Injector loaded');
  let injected = false;
  let currentUrl = window.location.href;

  const injectBigOwlText = () => {
    if (injected) return;
    
    const spans = document.querySelectorAll('span');
    let targetSpan = null;
    
    for (const span of spans) {
      if (span.textContent.trim() === 'Analyze Complexity') {
        targetSpan = span;
        break;
      }
    }
    
    if (!targetSpan || targetSpan.parentNode.querySelector('.bigowl-text')) return;

    const bigOwlSpan = document.createElement('span');
    bigOwlSpan.className = 'bigowl-text';
    bigOwlSpan.textContent = '🦉 Analyze with BigOwl';
    bigOwlSpan.style.cssText = `
      color: #4ecdc4; 
      font-weight: 500; 
      cursor: pointer;
      margin-left: 8px; 
      transition: all 0.2s ease;
    `;

    bigOwlSpan.addEventListener('mouseenter', () => {
      bigOwlSpan.style.color = '#3db8af';
      
    });
    
    bigOwlSpan.addEventListener('mouseleave', () => {
      if (bigOwlSpan.textContent.includes('Analyze with BigOwl')) {
        bigOwlSpan.style.color = '#4ecdc4';
        bigOwlSpan.style.textDecoration = 'none';
      }
    });
    
    bigOwlSpan.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🦉 BigOwl text clicked!');
      
      bigOwlSpan.textContent = ' 🔄 Processing...';
      bigOwlSpan.style.color = '#02B128';
      
      setTimeout(() => {
        showTheComplexityOverlay();
        setTimeout(() => {
          bigOwlSpan.textContent = '🦉 Analyze with BigOwl';
          bigOwlSpan.style.color = '#4ecdc4';
        }, 500);
      }, 800);
    });

    targetSpan.parentNode.insertBefore(bigOwlSpan, targetSpan.nextSibling);
    injected = true;
    console.log('🦉 Successfully added "Analyze with BigOwl" text');
  };

  // URL change detection (keeping existing code)
  const handleUrlChange = () => {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      console.log('🦉 URL changed:', newUrl);
      currentUrl = newUrl;
      injected = false;
      setTimeout(injectBigOwlText, 2000);
    }
  };

  // Start monitoring (keeping existing code)
  const startMonitoring = () => {
    console.log('🦉 Starting monitoring...');
    
    setTimeout(injectBigOwlText, 1000);
    setInterval(() => !injected && injectBigOwlText(), 2000);

    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.textContent?.includes('Analyze Complexity')) {
            shouldCheck = true;
          }
        });
      });
      if (shouldCheck) setTimeout(injectBigOwlText, 500);
      handleUrlChange();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(handleUrlChange, 1000);
  };

  // History patching for SPA navigation (keeping existing code)
  ['pushState', 'replaceState'].forEach(method => {
    const original = history[method];
    history[method] = function(...args) {
      original.apply(this, args);
      injected = false;
      setTimeout(injectBigOwlText, 1500);
    };
  });

  window.addEventListener('popstate', () => {
    injected = false;
    setTimeout(injectBigOwlText, 1500);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMonitoring);
  } else {
    startMonitoring();
  }

  console.log('🦉 BigOwl injector script initialized with SPA support');
})();