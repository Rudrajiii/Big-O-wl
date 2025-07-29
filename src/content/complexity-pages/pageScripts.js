import { createComplexityChart } from '../helpers/complexityChart';
// Update complexity mapping to include log n variations
export const mapComplexityToKey = (complexity) => {
    const mapping = {
      'O(1)': 'const',
      'O(log n)': 'log',
      'O(log N)': 'log',
      'O(logn)': 'log',
      'O(log(n))': 'log',
      'O(Log n)': 'log',
      'O(Log N)': 'log',
      'O(√n)': 'sqrt', 
      'O(√N)': 'sqrt',
      'O(n)': 'linear',
      'O(N)': 'linear',
      'O(n log n)': 'nlogn',
      'O(N log N)': 'nlogn',
      'O(n*log n)': 'nlogn',
      'O(nlogn)': 'nlogn',
      'O(n²)': 'quad',
      'O(N²)': 'quad',
      'O(n^2)': 'quad',
      'O(N^2)': 'quad',
      'O(2^n)': 'exp',
      'O(2^N)': 'exp'
    };
    return mapping[complexity] || null;
  };

  // Create complexity page with chart
export const createComplexityPage = (complexityType, complexityValue) => {
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 20px;
      
      color: #e8e8e8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
    `;

    // Map complexity to chart key
    const chartKey = mapComplexityToKey(complexityValue);
    
    // Create the chart
    const chart = createComplexityChart(chartKey, complexityType, complexityValue);
    container.appendChild(chart);

    return container;
  };