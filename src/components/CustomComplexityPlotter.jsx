import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Parser } from 'expr-eval';

/* ───────────────────────── helpers ───────────────────────── */

// Create and configure parser
const parser = new Parser({
  operators: { in: false } // keep parser strict and safe
});
parser.functions.log = Math.log2;
parser.functions.sqrt = Math.sqrt;

// Extract all variables from complexity expression
const extractVariables = (expression) => {
  // Remove O() wrapper and common symbols
  let cleaned = expression
    .replace(/^O\(/, '')
    .replace(/\)$/, '')
    .toLowerCase();
  
  // Find all single letter variables (a-z) that are word boundaries
  const variableMatches = cleaned.match(/\b[a-z]\b/g) || [];
  
  // Remove duplicates and common non-variable words
  const variables = [...new Set(variableMatches)]
    .filter(v => !['e', 'pi', 'ln'].includes(v)) // Filter out constants
    .sort(); // Sort for consistency
  
  console.log(`Extracted variables from "${expression}":`, variables);
  return variables;
};

// Create variable mappings for evaluation
const createVariableMappings = (variables, baseValue) => {
  const mappings = {};
  variables.forEach(variable => {
    mappings[variable] = baseValue;
  });
  return mappings;
};

// Dynamic safe evaluation that handles any variables
const safeEval = (expression, baseValue, variableMappings = {}) => {
  let expr = '';
  try {
    expr = expression.trim();

    // Remove O() wrapper if present
    if (expr.startsWith('O(') && expr.endsWith(')')) {
      expr = expr.slice(2, -1);
    }

    // Convert to lowercase for processing
    expr = expr.toLowerCase();

    // Get all variables in the expression
    const variables = Object.keys(variableMappings);
    
    // Handle complex patterns dynamically for any variable
    variables.forEach(variable => {
      const v = variable;
      
      // Handle square root symbols
      expr = expr.replace(new RegExp(`${v}\\s*√\\s*${v}`, 'g'), `${v} * sqrt(${v})`);
      expr = expr.replace(new RegExp(`√\\s*${v}`, 'g'), `sqrt(${v})`);
      
      // Handle log log patterns (most specific first)
      expr = expr.replace(new RegExp(`${v}\\s*log\\s*log\\s*${v}`, 'g'), `${v} * log(log(${v}))`);
      expr = expr.replace(new RegExp(`log\\s*log\\s*${v}`, 'g'), `log(log(${v}))`);
      expr = expr.replace(new RegExp(`loglog${v}`, 'g'), `log(log(${v}))`);
      
      // Handle n log n patterns
      expr = expr.replace(new RegExp(`${v}\\s*log\\s*${v}`, 'g'), `${v} * log(${v})`);
      expr = expr.replace(new RegExp(`${v}\\s*log\\s*\\(\\s*${v}\\s*\\)`, 'g'), `${v} * log(${v})`);
      
      // Handle standalone log patterns
      expr = expr.replace(new RegExp(`\\blog\\s*\\(\\s*${v}\\s*\\)`, 'g'), `log(${v})`);
      expr = expr.replace(new RegExp(`\\blog\\s*${v}(?!\\s*\\()`, 'g'), `log(${v})`);
      
      // Handle exponents with curly braces (LaTeX style)
      expr = expr.replace(new RegExp(`${v}\\^\\{([^}]+)\\}`, 'g'), (match, exp) => {
        const exponent = parseFloat(exp);
        if (exponent === 1.5) return `${v} * sqrt(${v})`;
        if (exponent === 2) return `${v} * ${v}`;
        if (exponent === 3) return `${v} * ${v} * ${v}`;
        return `pow(${v}, ${exponent})`;
      });
      
      // Handle regular exponents
      expr = expr.replace(new RegExp(`${v}\\^2`, 'g'), `${v} * ${v}`);
      expr = expr.replace(new RegExp(`${v}\\^3`, 'g'), `${v} * ${v} * ${v}`);
      expr = expr.replace(new RegExp(`${v}²`, 'g'), `${v} * ${v}`);
      expr = expr.replace(new RegExp(`${v}³`, 'g'), `${v} * ${v} * ${v}`);
      
      // Handle n^1.5 patterns
      expr = expr.replace(new RegExp(`${v}\\^1\\.5`, 'g'), `${v} * sqrt(${v})`);
      expr = expr.replace(new RegExp(`${v}\\^1,5`, 'g'), `${v} * sqrt(${v})`);
      expr = expr.replace(new RegExp(`${v}\\^3\\/2`, 'g'), `${v} * sqrt(${v})`);
      expr = expr.replace(new RegExp(`${v}\\^\\{3\\/2\\}`, 'g'), `${v} * sqrt(${v})`);
      
      // Handle factorial
      expr = expr.replace(new RegExp(`${v}!`, 'g'), `pow(${v}, ${v})`);
      
      // Handle sqrt function calls
      expr = expr.replace(new RegExp(`sqrt\\s*${v}`, 'g'), `sqrt(${v})`);
    });

    // Handle exponential patterns (2^variable)
    variables.forEach(variable => {
      expr = expr.replace(new RegExp(`2\\^${variable}`, 'g'), `pow(2, ${variable})`);
      expr = expr.replace(new RegExp(`2\\^\\{${variable}\\}`, 'g'), `pow(2, ${variable})`);
    });

    // Handle general log without specific variable (default to primary variable)
    if (variables.length > 0 && expr.includes('log') && !expr.includes('log(')) {
      const primaryVar = variables[0]; // Use first variable as primary
      expr = expr.replace(/\blog(?!\s*[a-z\(])/g, `log(${primaryVar})`);
    }

    // Replace variables with actual values
    variables.forEach(variable => {
      const value = variableMappings[variable];
      expr = expr.replace(new RegExp(`\\b${variable}\\b`, 'g'), value.toString());
    });

    console.log(`Evaluating: ${expression} -> ${expr} with mappings:`, variableMappings);

    const result = parser.evaluate(expr);
    
    // Handle edge cases for special functions
    if (isNaN(result) || result === -Infinity || result === Infinity) {
      // For log log patterns
      if (expression.toLowerCase().includes('log log')) {
        if (baseValue < 4) {
          return 0.1;
        }
        const logBase = Math.log2(baseValue);
        const logLogBase = logBase > 1 ? Math.log2(logBase) : 0.1;
        if (variables.some(v => expression.toLowerCase().includes(`${v} log log`))) {
          return baseValue * logLogBase;
        }
        return logLogBase;
      }
      
      // For ^1.5 patterns
      if (expression.toLowerCase().includes('1.5') || expression.includes('{1.5}')) {
        return baseValue * Math.sqrt(baseValue);
      }
      
      return 0;
    }
    
    return Math.max(0, result);
  } catch (e) {
    console.error('Error evaluating expression:', expression, 'with base value =', baseValue, 'Error:', e.message);
    console.error('Processed expression:', expr);
    
    // Fallback calculation for known patterns
    if (expression.toLowerCase().includes('log log')) {
      const logBase = Math.log2(baseValue);
      const logLogBase = logBase > 1 ? Math.log2(logBase) : 0.1;
      if (variables.some(v => expression.toLowerCase().includes(`${v} log log`))) {
        return baseValue * logLogBase;
      }
      return logLogBase;
    }
    if (expression.toLowerCase().includes('1.5') || expression.includes('{1.5}')) {
      return baseValue * Math.sqrt(baseValue);
    }
    
    return baseValue; // Fallback to linear
  }
};

// Dynamic color detection based on complexity patterns
const getComplexityColor = (c) => {
  const s = c.toLowerCase();
  if (s.includes('1') || s.includes('constant')) return '#27ae60';
  if (s.includes('log log')) return '#2980b9';
  if (s.includes('log') && !s.includes('log n') && !s.includes('log m') && !s.includes('log k')) return '#3498db';
  if (s.includes('1.5') || s.includes('{1.5}')) return '#16a085';
  if (s.includes('²') || s.includes('^2')) return '#e67e22';
  if (s.includes('³') || s.includes('^3')) return '#d35400';
  if (s.includes('2^') || s.includes('exponential')) return '#34495e';
  if (s.includes('!')) return '#8e44ad';
  if (s.includes('log')) return '#9b59b6'; // Any variable with log
  return '#e74c3c'; // Linear for any variable
};

const formatComplexity = (c) =>
  c
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\^n/g, 'ⁿ')
    .replace(/\^\{([^}]+)\}/g, '^$1') // Convert {1.5} to 1.5 for display
    .replace(/\*/g, '×')
    .replace(/\bsqrt\b/gi, '√');

/* ───────────────────────── Main Component ───────────────────────── */

const CustomComplexityPlotter = ({
  complexity,
  typeOfComplexity = 'Time Complexity — ',
  maxN = 60,
  step = 1,
  normalize = false
}) => {
  // Extract all variables dynamically
  const variables = useMemo(() => extractVariables(complexity), [complexity]);
  const primaryVariable = variables[0] || 'n'; // Use first variable as primary for display

  const data = useMemo(() => {
    let maxVal = 0;
    
    // Start from appropriate values based on complexity type
    const startN = complexity.toLowerCase().includes('log log') ? 4 : 
                   complexity.toLowerCase().includes('log') ? 2 : 1;
    
    // First pass: find max value
    for (let baseValue = startN; baseValue <= maxN; baseValue += step) {
      const variableMappings = createVariableMappings(variables, baseValue);
      const val = safeEval(complexity, baseValue, variableMappings);
      maxVal = Math.max(maxVal, val);
    }

    console.log(`Max value for ${complexity} with variables [${variables.join(', ')}]: ${maxVal}`);

    const arr = [];
    // Second pass: generate data points
    for (let baseValue = startN; baseValue <= maxN; baseValue += step) {
      const variableMappings = createVariableMappings(variables, baseValue);
      const val = safeEval(complexity, baseValue, variableMappings);
      arr.push({
        n: baseValue,
        value: normalize && maxVal ? val / maxVal : val,
        normalizedValue: maxVal ? val / maxVal : 0,
        variables: variableMappings
      });
    }

    return arr;
  }, [complexity, maxN, step, normalize, variables]);

  const color = getComplexityColor(complexity);

  return (
    <div style={{ width: 400, height: 340 }}>
      <div
        style={{
          marginBottom: 10,
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 600,
          color
        }}
      >
        {typeOfComplexity}
        {formatComplexity(complexity)}
        {variables.length > 1 && (
          <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>
            Variables: {variables.join(', ')}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 10, left: -60, bottom: 20 }}
        >
          <XAxis 
            dataKey="n" 
            stroke="#888" 
            fontSize={12}
            label={{ 
              value: variables.length > 1 ? variables.join(',') : primaryVariable, 
              position: 'insideBottom', 
              offset: -10 
            }}
          />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: 'rgba(30,30,30,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#fff',
              fontSize: '0.8rem'
            }}
            formatter={(v, n) => [
              isNaN(v) ? '0' : normalize ? v.toFixed(4) : v.toFixed(2),
              n
            ]}
            labelFormatter={(baseValue, payload) => {
              if (variables.length === 1) {
                return `${primaryVariable} = ${baseValue}`;
              } else if (variables.length > 1) {
                return variables.map(v => `${v} = ${baseValue}`).join(', ');
              }
              return `input = ${baseValue}`;
            }}
          />
          <Line
            type="monotone"
            dataKey={normalize ? 'normalizedValue' : 'value'}
            stroke={color}
            dot={{ stroke: color, fill: color, r: 3 }}
            activeDot={{ r: 5 }}
            strokeWidth={2}
            name={formatComplexity(complexity)}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomComplexityPlotter;