export const makeDraggable = (windowElement, titlebarElement) => {
    let isDragging = false;
    let startX = 0, startY = 0;
    let offsetX = 0, offsetY = 0;

    const handleMouseDown = (e) => {
      if (!titlebarElement.contains(e.target) || e.target.classList.contains('bigowl-control-btn')) {
        return;
      }

      isDragging = true;
      titlebarElement.style.cursor = 'grabbing';
      
      const rect = windowElement.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      offsetX = startX - rect.left;
      offsetY = startY - rect.top;

      e.preventDefault();
      e.stopPropagation();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      const windowWidth = windowElement.offsetWidth;
      const windowHeight = windowElement.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const boundedX = Math.max(0, Math.min(newX, viewportWidth - windowWidth));
      const boundedY = Math.max(0, Math.min(newY, viewportHeight - windowHeight));

      windowElement.style.left = `${boundedX}px`;
      windowElement.style.top = `${boundedY}px`;
      windowElement.style.transform = 'none';
    };

    const handleMouseUp = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      titlebarElement.style.cursor = 'move';
      
      e.preventDefault();
      e.stopPropagation();
    };

    titlebarElement.addEventListener('mousedown', handleMouseDown, { passive: false });
    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp, { passive: false });

    titlebarElement.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      handleMouseDown({ 
        ...e, 
        clientX: touch.clientX, 
        clientY: touch.clientY,
        target: e.target,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation()
      });
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      handleMouseMove({
        ...e,
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation()
      });
    }, { passive: false });

    document.addEventListener('touchend', handleMouseUp, { passive: false });

    const viewportWidth = window.innerWidth;
    const windowWidth = 520; // Slightly larger for better content display
    const rightMargin = 20;
    
    windowElement.style.position = 'fixed';
    windowElement.style.left = `${viewportWidth - windowWidth - rightMargin}px`;
    windowElement.style.top = '20px';
    windowElement.style.transform = 'none';
  };