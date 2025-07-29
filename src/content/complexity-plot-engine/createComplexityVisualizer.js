import { createComplexityPage } from "../complexity-pages/pageScripts";
// Create multi-page complexity visualizer
export const createComplexityVisualizer = (timeComplexity, spaceComplexity) => {
    const container = document.createElement('div');
    container.style.cssText = `
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    `;

    // Create pages
    const timePage = createComplexityPage('Time Complexity', timeComplexity);
    const spacePage = createComplexityPage('Space Complexity', spaceComplexity);

    // Page container for sliding effect
    const pagesContainer = document.createElement('div');
    pagesContainer.style.cssText = `
      display: flex;
      width: 200%;
      height: 100%;
      transition: transform 0.3s ease-in-out;
      transform: translateX(0%);
    `;

    timePage.style.cssText += `
      width: 50%;
      flex-shrink: 0;
    `;

    spacePage.style.cssText += `
      width: 50%;
      flex-shrink: 0;
    `;

    pagesContainer.appendChild(timePage);
    pagesContainer.appendChild(spacePage);

    // Navigation dots
    const navDots = document.createElement('div');
    navDots.style.cssText = `
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 10;
    `;

    let currentPage = 0;
    const pages = ['Time', 'Space'];

    pages.forEach((pageName, index) => {
      const dot = document.createElement('button');
      dot.style.cssText = `
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        background: ${index === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'};
      `;

      dot.addEventListener('click', () => {
        currentPage = index;
        
        // Update dots
        navDots.querySelectorAll('button').forEach((d, i) => {
          d.style.background = i === index ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)';
        });

        // Slide to page
        pagesContainer.style.transform = `translateX(-${index * 50}%)`;
      });

      navDots.appendChild(dot);
    });

    

    // Swipe/Click navigation
    let startX = 0;
    let isDragging = false;

    pagesContainer.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    pagesContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });

    pagesContainer.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.clientX;
      const deltaX = startX - endX;

      if (Math.abs(deltaX) > 50) { // Minimum swipe distance
        if (deltaX > 0 && currentPage < pages.length - 1) {
          // Swipe left - next page
          currentPage++;
        } else if (deltaX < 0 && currentPage > 0) {
          // Swipe right - previous page
          currentPage--;
        }

        // Update UI
        navDots.children[currentPage].click();
      }
    });

    // Auto-advance to space complexity after 3 seconds
    setTimeout(() => {
      if (currentPage === 0) {
        navDots.children[1].click();
      }
    }, 3000);

    container.appendChild(pagesContainer);
    // container.appendChild(pageIndicator);
    container.appendChild(navDots);
    
    return container;
  };