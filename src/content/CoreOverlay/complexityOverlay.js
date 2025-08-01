import { loadStyles } from "../helpers/loadStyleScript";
import { extractSubmissionCode } from "../helpers/codeExtractor";
import { makeDraggable } from "../mouse-dragging-script/dragTheOverLay";
import { analyzeComplexity , getComplexityHighlight } from "../helpers/complexityAnalyzer";
import { createComplexityVisualizer } from "../complexity-plot-engine/createComplexityVisualizer";


export const showTheComplexityOverlay = async () => {
    console.log('🦉 Creating overlay...');
    const extractedCode = extractSubmissionCode();
    const existingOverlay = document.querySelector('.bigowl-overlay');
    if (existingOverlay) existingOverlay.remove();

    loadStyles(); //done importing styles

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'bigowl-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000000;
    `;

    // Create clean window element
    const windowElement = document.createElement('div');
    windowElement.className = 'bigowl-window';
    windowElement.style.cssText = `
      pointer-events: all;
      position: fixed;
      height: 480px;
      width: 520px;
      background: transparent;
      backdrop-filter: blur(20px);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 1000001;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
    `;

    // Minimal titlebar with Mac dots
    const titlebar = document.createElement('div');
    titlebar.className = 'bigowl-titlebar';
    titlebar.style.cssText = `
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: transparent;
      cursor: move;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      user-select: none;
      height: 44px;
    `;

    // Mac-style control dots
    const controls = document.createElement('div');
    controls.style.cssText = `
      display: flex;
      gap: 8px;
    `;

    const colors = ['#ff5f56', '#ffbd2e', '#27c93f'];
    colors.forEach((color, index) => {
      const btn = document.createElement('button');
      btn.className = `bigowl-control-btn ${index === 0 ? 'close' : ''}`;
      btn.style.cssText = `
        width: 12px; 
        height: 12px; 
        border: none; 
        border-radius: 50%;
        cursor: ${index === 0 ? 'pointer' : 'default'};
        padding: 0;
        background: ${color};
        transition: opacity 0.2s;
      `;
      
      if (index === 0) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          overlay.classList.remove('visible');
          setTimeout(() => overlay.remove(), 300);
        });
        btn.addEventListener('mouseenter', () => btn.style.opacity = '0.8');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
      }
      
      controls.appendChild(btn);
    });

    titlebar.appendChild(controls);

    // Content area
    const content = document.createElement('div');
    content.className = 'bigowl-content';
    content.style.cssText = `
      flex: 1;
      overflow: hidden;
      
      padding: 0;
    `;

    const analysisArea = document.createElement('div');
    analysisArea.className = 'bigowl-code-area';
    analysisArea.style.cssText = `
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `;

    if (extractedCode) {
      const loadingDiv = document.createElement('div');
      loadingDiv.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18px;
        gap: 20px;
      `;
      loadingDiv.innerHTML = `
        <div style="
          width: 24px; height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        Analyzing complexity...
      `;
      
      if (!document.querySelector('#bigowl-spin-style')) {
        const style = document.createElement('style');
        style.id = 'bigowl-spin-style';
        style.textContent = `
          @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
        `;
        document.head.appendChild(style);
      }
      
      analysisArea.appendChild(loadingDiv);
    } else {
      const placeholder = document.createElement('div');
      placeholder.textContent = 'No code found to analyze';
      placeholder.style.cssText = `
        color: rgba(255, 255, 255, 0.6);
        font-size: 18px;
        text-align: center;
      `;
      analysisArea.appendChild(placeholder);
    }

    content.appendChild(analysisArea);

    // Assemble window
    windowElement.appendChild(titlebar);
    windowElement.appendChild(content);

    overlay.appendChild(windowElement);
    document.body.appendChild(overlay);

    console.log('🦉 Window created, setting up draggable functionality...');

    setTimeout(() => {
      makeDraggable(windowElement, titlebar);
      console.log('🦉 Draggable functionality initialized');
    }, 100);

    // Animate in
    setTimeout(() => {
      overlay.classList.add('visible');
      windowElement.classList.add('visible');
    }, 150);

    
    // Analyze complexity if code exists
    if (extractedCode) {
  try {
    let complexityResult = await analyzeComplexity(extractedCode);
    analysisArea.innerHTML = '';
    
    let isComplexityDetermined = !complexityResult.includes("Cannot determine");
    
    // If primary analysis fails, try backup code
    if (!isComplexityDetermined) {
      console.log("Primary analysis failed, trying backup code...");
      
      const backupCode = await new Promise((resolve) => {
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get(['selectedCode'], (result) => {
            resolve(result.selectedCode || null);
          });
        } else {
          resolve(null);
        }
      });
      
      console.log("Backup code:", backupCode);
      
      if (backupCode && backupCode.trim().length > 0) {
        console.log("Analyzing backup code...");
        complexityResult = await analyzeComplexity(backupCode);
        isComplexityDetermined = !complexityResult.includes("Cannot determine");
        console.log("Backup analysis result:", isComplexityDetermined);
      }
    }
    
    // Now decide what to show based on final analysis result
    if (isComplexityDetermined) {
      console.log("Analysis successful, creating visualizer...");
      const timeComplexity = getComplexityHighlight(complexityResult, true);
      const spaceComplexity = getComplexityHighlight(complexityResult, false);

      // Create multi-page visualizer with charts
      const visualizer = createComplexityVisualizer(timeComplexity, spaceComplexity);
      analysisArea.appendChild(visualizer);
    } else {
      // Both primary and backup analysis failed
      console.log("Both analyses failed, showing fallback message...");
      analysisArea.innerHTML = `
        <div style="
          text-align: center; 
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        ">
          <div>
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="#FFA116"/>
            </svg>
          </div>
          <div style="font-size: 25px; font-weight: 600;">Oops!! auto extraction failed</div>
          <div style="font-size: 18px; color: rgba(255, 255, 255, 0.6);">Please select your code and try again</div>
          <div style="
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            max-width: 400px;
            text-align: center;
          ">
            💡Tip: You Can Also Move To The Extension For Analysis.
          </div>
        </div>
      `;
    }

  } catch (error) {
    console.error('🦉 Analysis error:', error);
    analysisArea.innerHTML = `
      <div style="
        text-align: center; 
        color: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      ">
        <div>
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill="#ff4444"/>
          </svg>
        </div>
        <div style="font-size: 25px; font-weight: 600;">Analysis Failed</div>
        <div style="font-size: 16px; color: rgba(255, 255, 255, 0.6);">${error.message}</div>
      </div>
    `;
  }
}


  if( extractedCode ) {
      try{
        if(typeof chrome !== "undefined" && chrome.storage && chrome.storage.local){
        chrome.storage.local.set({
          selectedCode : extractedCode
        })
        console.log("stored extracted code ://") //debug k liye
      }}
      catch(storageError){
        console.error("erorr := ", storageError);
      }
    }

    // Close overlay when clicking outside
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 300);
      }
    });

    // Auto-close after 2 minutes
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 300);
      }
    }, 120000);
  };