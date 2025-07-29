export const createComplexityChart = (highlight = 'linear', typeOfComplexity = 'Time Complexity', complexityValue = 'O(n)') => {
    const container = document.createElement('div');
    container.style.cssText = `
      width: 400px;
      height: 340px;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    const curves = [
      { key: 'const',  name: 'O(1)', color: '#27ae60' },
      { key: 'log',    name: 'O(log n)', color: '#3498db' },  // Changed to lowercase 'n'
      { key: 'sqrt',   name: 'O(√n)', color: '#f39c12' },
      { key: 'linear', name: 'O(n)', color: '#e74c3c' },
      { key: 'nlogn',  name: 'O(n log n)', color: '#9b59b6' },
      { key: 'quad',   name: 'O(n²)', color: '#e67e22' },
      { key: 'exp',    name: 'O(2^n)', color: '#34495e' }
    ];

    const highlightedCurve = curves.find(curve => curve.key === highlight);

    // Check if complexity is supported
    if (!highlightedCurve) {
      // Show fallback message for unsupported complexities
      container.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          gap: 15px;
          margin: 0 15px;
        ">
          <div style="
            font-size: 22px; 
            font-weight: 300;
            color: #fff;
            font-style: italic;
            font-family: 'Times New Roman', serif;
            margin-bottom: 10px;
          ">
           
            ${typeOfComplexity} ~ ${complexityValue}
          </div>
          <div style="font-size: 18px; color: rgba(255, 255, 255, 0.7);">
            This complexity is not in our standard chart
          </div>
          <div style="
            
            font-weight:500
            font-size: 16px;
            color: #2CB744;
          ">
            Refer to BigOwl to get its Plot
          </div>
        </div>
      `;
      return container;
    }

    // Title showing complexity type
    const title = document.createElement('div');
    title.style.cssText = `
      margin-bottom: 15px;
      text-align: center;
      font-size: 22px;
      font-weight: 400;
      font-style: italic;
      font-family: 'Times New Roman', serif;
      color: #fff;
    `;
    title.textContent = `${typeOfComplexity} ~ ${highlightedCurve.name}`;

    // Create SVG chart with increased height
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '450');
    svg.setAttribute('height', '300');
    svg.style.cssText = `
      border-radius: 8px;
    `;

    // Build data for complexity chart
    const buildData = (points = 60) => {
    const data = [];
    for (let n = 1; n <= points; n++) {
      data.push({
        n,
        const: 8,                        // Constant - horizontal line
        log: Math.log2(n) * 5,           // Logarithmic - gentle curve
        sqrt: Math.sqrt(n) * 7,          // Square root - moderate curve
        linear: n,                       // Linear - diagonal line
        nlogn: n * Math.log2(n) / 8,     // N log N - faster growth
        quad: n * n / 90,                // Quadratic - steep curve
        exp: Math.min(Math.pow(2, n / 15), 60) // Exponential - capped for visibility
      });
    }
    return data;
  };

    const dataset = buildData(60);
    const margin = { top: 20, right: 20, bottom: 35, left: 35 };
    const width = 450 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create scales
    const xScale = (n) => (n / 60) * width;
    const yScale = (val) => height - (val / 60) * height;

    // Create chart group
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chartGroup.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw curves
    curves.forEach(({ key, name, color }) => {
      const isHighlighted = key === highlight;
      let pathData = '';
      
      dataset.forEach((point, index) => {
        const x = xScale(point.n);
        const y = yScale(point[key]);
        
        // For all complexities except constant, start from origin (0,0 mapped to chart coordinates)
        if (index === 0) {
          if (key === 'const') {
            // Constant starts from its actual value
            pathData += `M ${x} ${y}`;
          } else {
            // All other complexities start from origin
            pathData += `M ${xScale(1)} ${yScale(dataset[0][key])}`;
          }
        } else {
          pathData += ` L ${x} ${y}`;
        }
      });

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('stroke', isHighlighted ? color : '#bbb');
      path.setAttribute('stroke-width', isHighlighted ? '3' : '1.5');
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', isHighlighted ? '1' : '0.4');
      
      if (isHighlighted) {
        // Add glow effect for highlighted curve
        path.setAttribute('filter', `drop-shadow(0 0 4px ${color}66)`);
      }

      chartGroup.appendChild(path);
    });

    // Add axes (simple lines without grid)
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', height);
    xAxis.setAttribute('x2', width);
    xAxis.setAttribute('y2', height);
    xAxis.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
    xAxis.setAttribute('stroke-width', '2');
    chartGroup.appendChild(xAxis);

    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', height);
    yAxis.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
    yAxis.setAttribute('stroke-width', '2');
    chartGroup.appendChild(yAxis);

    // Add minimal axis labels
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', width / 2);
    xLabel.setAttribute('y', height + 25);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('fill', 'rgba(255, 255, 255, 0.6)');
    xLabel.setAttribute('font-size', '12');
    chartGroup.appendChild(xLabel);

    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', -height / 2);
    yLabel.setAttribute('y', -20);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('fill', 'rgba(255, 255, 255, 0.6)');
    yLabel.setAttribute('font-size', '12');
    yLabel.setAttribute('transform', `rotate(-90, ${-height / 2}, -20)`);
    yLabel.textContent = 'Operations';
    chartGroup.appendChild(yLabel);

    // Add origin point marker
    const originDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    originDot.setAttribute('cx', 0);
    originDot.setAttribute('cy', height);
    originDot.setAttribute('r', 2);
    originDot.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
    chartGroup.appendChild(originDot);

    svg.appendChild(chartGroup);

    container.appendChild(title);
    container.appendChild(svg);

    return container;
  };