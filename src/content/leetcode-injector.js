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


  
  function injectBigOwlTextToElements() {    
  const targetElements = document.querySelectorAll('.flex.h-full.flex-nowrap.items-center');
  
  if (targetElements.length === 0) {
      console.log('🎯 No elements found with classes: flex h-full flex-nowrap items-center');
      return;
  }
  
  targetElements.forEach((element, index) => {
      console.log(`🎯 Processing element ${index + 1}:`, element);
      
      // Check if text already injected
      if (element.querySelector('.bigowl-inject-span')) {
          console.log('🎯 Text already injected in element:', element);
          return;
      }
      
      // Create the main span element
      const container = document.createElement('div');
      container.className = 'bigowl-restriction-container';
      container.style.position = 'relative';
      container.style.display = 'inline-block';
      container.style.marginLeft = '8px';

      const injectSpan = document.createElement('span');
      injectSpan.className = 'bigowl-inject-span';
      injectSpan.textContent = '🦉 Auto Restriction';
      injectSpan.style.cssText = `
          color: #667eea; 
          font-weight: 500; 
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
      `;

      // Create dropdown (initially hidden)
      const dropdown = document.createElement('div');
      dropdown.className = 'bigowl-restriction-dropdown';
      dropdown.style.cssText = `
        display: none;
        position: absolute;
        background: rgba(40, 40, 40, 0.55); /* Semi-transparent */
        min-width: 200px;
        color: #BDBFC2;
        box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.4);
        z-index: 1;
        border-radius: 12px;
        padding: 8px 0;
        top: 100%;
        left: 0;
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.15);
        transition: all 0.3s ease;
    `;


      // Popular sites to block
      const sites = [
          { name: 'ChatGPT', url: 'chatgpt.com' },
          { name: 'Gemini (Bard)', url: 'gemini.google.com' },
          { name: 'Claude', url: 'claude.ai' },
          { name: 'YouTube', url: 'youtube.com' },
          { name: 'Perplexity', url: 'www.perplexity.ai' },
          { name: 'Phind', url: 'www.phind.com' },
          { name: 'Stack Overflow', url: 'stackoverflow.com' }
      ];

      // Add title to dropdown
      const title = document.createElement('div');
      title.textContent = 'Block these sites ~';
      title.style.padding = '8px 16px';
      title.style.fontWeight = 'bold';
      title.style.borderBottom = '1px solid #ddd';
      dropdown.appendChild(title);

      // Add site checkboxes
      sites.forEach(site => {
          const siteItem = document.createElement('div');
          siteItem.style.padding = '8px 16px';
          siteItem.style.display = 'flex';
          siteItem.style.alignItems = 'center';
          siteItem.addEventListener("mouseenter",() => {
            siteItem.style.width = '100%';
            siteItem.style.padding = '8px 16px';
            siteItem.style.cursor = 'pointer';
            siteItem.style.background = 'rgba(255, 255, 255, 0.05)';
          });
          siteItem.addEventListener("mouseleave",() => {
            siteItem.style.background = 'transparent';
          });

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = `block-${site.url.replace(/\./g, '-')}`;
          checkbox.value = site.url;
          checkbox.style.marginRight = '8px';

          const label = document.createElement('label');
          label.htmlFor = checkbox.id;
          label.textContent = site.name;
          
          label.style.cursor = 'pointer';

          siteItem.appendChild(checkbox);
          siteItem.appendChild(label);
          dropdown.appendChild(siteItem);
      });

      // Add confirm button
      const confirmButton = document.createElement('button');
      confirmButton.textContent = 'Enable Restriction';
      confirmButton.classList = 'confirm-btn';
      confirmButton.style.cssText = `
          background-color: #283A2E;
          color: #2CBB5D;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin: 8px 16px;
          width: calc(100% - 32px);
      `;
      // confirmButton.addEventListener('mouseenter', () => {
      //     confirmButton.style.backgroundColor = '#45a049';
      // });
      // confirmButton.addEventListener('mouseleave', () => {
      //     confirmButton.style.backgroundColor = '#4CAF50';
      // });

      dropdown.appendChild(confirmButton);
      container.appendChild(injectSpan);
      container.appendChild(dropdown);
      element.appendChild(container);

      
      // Toggle state
      let isAutoCompleteOn = false;
      let blockedSites = [];

      // 🔹 LOAD SAVED BLOCKED SITES AND RESTORE UI STATE
      chrome.storage.sync.get(['blockedSites'], (result) => {
        const savedSites = result.blockedSites || [];

        if (savedSites.length > 0) {
          // Restore ON state
          isAutoCompleteOn = true;
          injectSpan.textContent = '🦉 Auto Restriction ON';
          injectSpan.style.color = '#27ae60';
          injectSpan.style.backgroundColor = 'rgba(39, 174, 96, 0.15)';
        }

        // Auto-check the checkboxes for saved sites
        savedSites.forEach(savedSite => {
          const checkbox = dropdown.querySelector(`input[value="${savedSite}"]`);
          if (checkbox) {
            checkbox.checked = true;
          }
        });
      });
    

      // Toggle dropdown visibility or turn off
      injectSpan.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isAutoCompleteOn) {
            // Turn OFF
            injectSpan.textContent = '🦉 Auto Restriction';
            injectSpan.style.color = '#667eea';
            injectSpan.style.backgroundColor = 'transparent';
            isAutoCompleteOn = false;
            chrome.storage.sync.set({ blockedSites: [] }, () => {
                console.log('🎯 Auto Restriction disabled. All sites unblocked.');
            });
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
      });

      // Handle confirm button click
      confirmButton.addEventListener('click', (e) => {
        e.stopPropagation();
        
        blockedSites = [];
        const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            blockedSites.push(checkbox.value);
        });
        
        if (blockedSites.length > 0) {
            isAutoCompleteOn = true;
            injectSpan.textContent = '🦉 Auto Restriction ON';
            injectSpan.style.color = '#27ae60';
            injectSpan.style.backgroundColor = 'rgba(39, 174, 96, 0.15)';
            dropdown.style.display = 'none';
            
            chrome.storage.sync.set({ blockedSites: blockedSites }, () => {
                console.log('🎯 Blocked sites saved:', blockedSites);
            });
        } else {
            alert('Please select at least one site to block');
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      });

      console.log('🎯 Successfully injected "Auto Restriction" feature into element:', element);
  });
}

  // Run code injection feature
  function runCodeInjectionFeature() {
    console.log('🎯 Starting Code Injection Feature attempts...');
    
    // Immediate attempt
    injectBigOwlTextToElements();
  }

  // Monitor for new flex elements
  const codeInjectionObserver = new MutationObserver((mutations) => {
    let shouldInjectCode = false;
    
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the new node or its children have the target classes
          if (node.classList && 
              node.classList.contains('flex') && 
              node.classList.contains('h-full') && 
              node.classList.contains('flex-nowrap') && 
              node.classList.contains('items-center')) {
            console.log('🎯 New target element detected, running code injection...');
            shouldInjectCode = true;
          }
          
          // Also check child elements
          const childElements = node.querySelectorAll && node.querySelectorAll('.flex.h-full.flex-nowrap.items-center');
          if (childElements && childElements.length > 0) {
            console.log('🎯 New child target elements detected, running code injection...');
            shouldInjectCode = true;
          }
        }
      });
    });
    
    if (shouldInjectCode) {
      setTimeout(injectBigOwlTextToElements, 500);
    }
  });

  // Start code injection observer
  codeInjectionObserver.observe(document.body, { 
    childList: true, 
    subtree: true 
  });

  // Initialize code injection feature
  runCodeInjectionFeature();

})();