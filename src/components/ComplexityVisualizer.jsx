import React from 'react';
import Ploty from './Ploty.jsx';
import CustomComplexityPlotter from './CustomComplexityPlotter.jsx';

const ComplexityVisualizer = ({ 
  complexity, 
  typeOfComplexity = 'Time Complexity',
  highlight = 'linear' // fallback for Ploty
}) => {
  // Standard complexities that Ploty.jsx can handle
  const standardComplexities = [
    'O(1)', 'O(log N)', 'O(√N)', 'O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)',
    'constant', 'logarithmic', 'linear', 'quadratic', 'exponential',
    'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)', 'O(n²)', 'O(2^n)'
  ];

  // Mapping for Ploty.jsx highlight prop
  const complexityMapping = {
    'O(1)': 'const',
    'O(log N)': 'log',
    'O(log n)': 'log', 
    'O(√N)': 'sqrt',
    'O(N)': 'linear',
    'O(n)': 'linear',
    'O(N log N)': 'nlogn',
    'O(n log n)': 'nlogn',
    'O(N²)': 'quad',
    'O(n²)': 'quad',
    'O(n^2)': 'quad',
    'O(2^N)': 'exp',
    'O(2^n)': 'exp',
    'constant': 'const',
    'logarithmic': 'log',
    'linear': 'linear',
    'quadratic': 'quad',
    'exponential': 'exp'
  };

  // Function to check if complexity is standard
  const isStandardComplexity = (complexity) => {
    if (!complexity) return false;
    
    const normalizedComplexity = complexity.trim();
    
    // Check exact matches
    if (standardComplexities.some(std => 
      normalizedComplexity.toLowerCase() === std.toLowerCase()
    )) {
      return true;
    }

    // Check if it's a simple variant that Ploty can handle
    if (complexityMapping[normalizedComplexity]) {
      return true;
    }

    // Check for simple patterns that Ploty supports
    const lower = normalizedComplexity.toLowerCase();
    const simplePatterns = [
      /^o\(1\)$/,           // O(1)
      /^o\(log\s*n?\)$/,    // O(log N) or O(log n)
      /^o\(n\)$/,           // O(n)
      /^o\(n\s*log\s*n\)$/, // O(n log n)
      /^o\(n\^?2\)$/,       // O(n^2) or O(n²)
      /^o\(2\^n\)$/         // O(2^n)
    ];

    return simplePatterns.some(pattern => pattern.test(lower));
  };

  // Function to get the highlight key for Ploty
  const getHighlightKey = (complexity) => {
    if (!complexity) return highlight; // Use passed highlight as fallback
    
    const normalizedComplexity = complexity.trim();
    
    // Direct mapping
    if (complexityMapping[normalizedComplexity]) {
      return complexityMapping[normalizedComplexity];
    }

    // Pattern matching for variations
    const lower = normalizedComplexity.toLowerCase();
    if (/log/.test(lower) && !/n\s*log/.test(lower)) return 'log';
    if (/n\s*log|nlogn/.test(lower)) return 'nlogn';
    if (/n\^?2|n²|quadratic/.test(lower)) return 'quad';
    if (/2\^n|exponential/.test(lower)) return 'exp';
    if (/√|sqrt/.test(lower)) return 'sqrt';
    if (/constant|o\(1\)/.test(lower)) return 'const';
    if (/linear|o\(n\)/.test(lower)) return 'linear';

    return highlight; // Use passed highlight as fallback
  };

  // Extract complexity from result if it's a full analysis result
  const extractComplexity = (input) => {
    if (!input) return null;
    
    // If it's already a clean complexity notation, return it
    if (input.match(/^O\(.+\)$/)) {
      return input;
    }
    
    // If it's a full analysis result, extract the relevant complexity
    const lines = input.split('\n');
    const relevantLine = typeOfComplexity.includes('Time') 
      ? lines.find(line => line.includes('Time Complexity'))
      : lines.find(line => line.includes('Space Complexity'));
    
    if (relevantLine) {
      const complexityValue = relevantLine.split('=')[1]?.trim();
      if (complexityValue) {
        return complexityValue;
      }
    }
    
    return input; // Return as-is if can't extract
  };

  const extractedComplexity = extractComplexity(complexity);

  // Decide which component to render
  if (isStandardComplexity(extractedComplexity)) {
    const highlightKey = getHighlightKey(extractedComplexity);
    return (
      <Ploty 
        highlight={highlightKey} 
        typeOfComplexity={typeOfComplexity}
      />
    );
  } else {
    return (
      <CustomComplexityPlotter 
        complexity={extractedComplexity || 'O(1)'}
        typeOfComplexity={typeOfComplexity}
        maxN={60}
        step={5}
        // points={60}
        normalize={false}
      />
    );
  }
};

export default ComplexityVisualizer;