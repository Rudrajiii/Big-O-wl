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
        const complexityResult = await analyzeComplexity(extractedCode);
        analysisArea.innerHTML = '';

        const isComplexityDetermined = !complexityResult.includes("Cannot determine");

        if (isComplexityDetermined) {
          const timeComplexity = getComplexityHighlight(complexityResult, true);
          const spaceComplexity = getComplexityHighlight(complexityResult, false);

          // Create multi-page visualizer with charts
          const visualizer = createComplexityVisualizer(timeComplexity, spaceComplexity);
          analysisArea.appendChild(visualizer);
        } else {
          analysisArea.innerHTML = `
            <div style="
              text-align: center; 
              color: rgba(255, 255, 255, 0.8);
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
            ">
              <div style="font-size: 48px;">⚠️</div>
              <div style="font-size: 20px; font-weight: 400;">We are unable to extract the code this time . please just select the code section and go the extension for details.</div>
              <div style="font-size: 16px; color: rgba(255, 255, 255, 0.6);">This code snippet may not contain algorithmic patterns</div>
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
            <div style="font-size: 48px;">❌</div>
            <div style="font-size: 20px; font-weight: 400;">Analysis Failed</div>
            <div style="font-size: 16px; color: rgba(255, 255, 255, 0.6);">${error.message}</div>
          </div>
        `;
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