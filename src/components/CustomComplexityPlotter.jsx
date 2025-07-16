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

// Evaluate expression using expr-eval
const safeEval = (expression, n, m = n) => {
  let expr = '';
  try {
    expr = expression.trim();

    // Remove O() wrapper if present
    if (expr.startsWith('O(') && expr.endsWith(')')) {
      expr = expr.slice(2, -1);
    }

    // Handle common complexity patterns first - ORDER MATTERS!
    // Process most specific patterns first to avoid conflicts
    expr = expr
      .toLowerCase()
      // Handle square root symbols first - be very specific with word boundaries
      .replace(/n\s*√\s*n/g, 'n * sqrt(n)')
      .replace(/m\s*√\s*m/g, 'm * sqrt(m)')
      .replace(/√\s*n/g, 'sqrt(n)')
      .replace(/√\s*m/g, 'sqrt(m)')
      
      // Handle n log log n patterns FIRST (most specific)
      .replace(/n\s*log\s*log\s*n/g, 'n * log(log(n))')
      .replace(/m\s*log\s*log\s*m/g, 'm * log(log(m))')
      .replace(/n\s*log\s*log\s*m/g, 'n * log(log(m))')
      .replace(/m\s*log\s*log\s*n/g, 'm * log(log(n))')
      
      // Handle standalone log log n patterns
      .replace(/log\s*log\s*n/g, 'log(log(n))')
      .replace(/log\s*log\s*m/g, 'log(log(m))')
      .replace(/loglogn/g, 'log(log(n))')
      .replace(/loglogm/g, 'log(log(m))')
      
      // Handle n log n pattern (after log log patterns)
      .replace(/n\s*log\s*n/g, 'n * log(n)')
      .replace(/m\s*log\s*m/g, 'm * log(m)')
      .replace(/n\s*log\s*m/g, 'n * log(m)')
      .replace(/m\s*log\s*n/g, 'm * log(n)')
      
      // Handle n log(n) pattern (with parentheses)
      .replace(/n\s*log\s*\(\s*n\s*\)/g, 'n * log(n)')
      .replace(/m\s*log\s*\(\s*m\s*\)/g, 'm * log(m)')
      
      // Handle standalone log patterns (least specific)
      .replace(/\blog\s*\(\s*n\s*\)/g, 'log(n)')
      .replace(/\blog\s*\(\s*m\s*\)/g, 'log(m)')
      .replace(/\blog\s*n(?!\s*\()/g, 'log(n)')
      .replace(/\blog\s*m(?!\s*\()/g, 'log(m)')
      .replace(/\blog(?!\s*[nm\(])/g, 'log(n)')
      
      // Handle exponents with curly braces (LaTeX style)
      .replace(/n\^\{([^}]+)\}/g, (match, exp) => {
        const exponent = parseFloat(exp);
        if (exponent === 1.5) return 'n * sqrt(n)';
        if (exponent === 2) return 'n * n';
        if (exponent === 3) return 'n * n * n';
        return `pow(n, ${exponent})`;
      })
      .replace(/m\^\{([^}]+)\}/g, (match, exp) => {
        const exponent = parseFloat(exp);
        if (exponent === 1.5) return 'm * sqrt(m)';
        if (exponent === 2) return 'm * m';
        if (exponent === 3) return 'm * m * m';
        return `pow(m, ${exponent})`;
      })
      .replace(/2\^\{([^}]+)\}/g, (match, exp) => {
        return `pow(2, ${exp.replace(/n/g, 'n').replace(/m/g, 'm')})`;
      })
      
      // Handle regular exponents
      .replace(/n\^2/g, 'n * n')
      .replace(/n\^3/g, 'n * n * n')
      .replace(/m\^2/g, 'm * m')
      .replace(/m\^3/g, 'm * m * m')
      .replace(/n²/g, 'n * n')
      .replace(/n³/g, 'n * n * n')
      .replace(/2\^n/g, 'pow(2, n)')
      
      // Handle n^1.5 (n * sqrt(n)) - multiple formats
      .replace(/n\^1\.5/g, 'n * sqrt(n)')
      .replace(/n\^1,5/g, 'n * sqrt(n)')
      .replace(/n\^3\/2/g, 'n * sqrt(n)')
      .replace(/n\^{3\/2}/g, 'n * sqrt(n)')
      
      // Handle factorial (approximate for large n)
      .replace(/n!/g, 'pow(n, n)')
      
      // Handle sqrt function calls (after all other replacements)
      .replace(/sqrt\s*n/g, 'sqrt(n)')
      .replace(/sqrt\s*m/g, 'sqrt(m)');

    // Replace variables with actual values
    expr = expr
      .replace(/\bn\b/g, n.toString())
      .replace(/\bm\b/g, m.toString());

    console.log(`Evaluating: ${expression} -> ${expr} with n=${n}`); // Debug log

    const result = parser.evaluate(expr);
    
    // Handle edge cases for special functions
    if (isNaN(result) || result === -Infinity || result === Infinity) {
      // For log log n, we need n >= 4 for reasonable results
      if (expression.toLowerCase().includes('log log')) {
        if (n < 4) {
          return 0.1; // Small positive value for visualization
        }
        // If still invalid, try a fallback calculation
        const logN = Math.log2(n);
        const logLogN = logN > 1 ? Math.log2(logN) : 0.1;
        if (expression.toLowerCase().includes('n log log')) {
          return n * logLogN;
        }
        return logLogN;
      }
      
      // For n^1.5 patterns
      if (expression.toLowerCase().includes('1.5') || expression.includes('{1.5}')) {
        return n * Math.sqrt(n);
      }
      
      return 0;
    }
    
    return Math.max(0, result); // Ensure non-negative values
  } catch (e) {
    console.error('Error evaluating expression:', expression, 'with n =', n, 'Error:', e.message);
    console.error('Processed expression:', expr);
    
    // Fallback calculation for known patterns
    if (expression.toLowerCase().includes('n log log n')) {
      const logN = Math.log2(n);
      const logLogN = logN > 1 ? Math.log2(logN) : 0.1;
      return n * logLogN;
    }
    if (expression.toLowerCase().includes('log log n')) {
      const logN = Math.log2(n);
      return logN > 1 ? Math.log2(logN) : 0.1;
    }
    if (expression.toLowerCase().includes('1.5') || expression.includes('{1.5}')) {
      return n * Math.sqrt(n);
    }
    
    return 0;
  }
};

// Colors based on complexity
const getComplexityColor = (c) => {
  const s = c.toLowerCase();
  if (s.includes('1') || s.includes('constant')) return '#27ae60';
  if (s.includes('log log')) return '#2980b9'; // Special case for log log patterns
  if (s.includes('log') && !s.includes('n log')) return '#3498db';
  if (s.includes('1.5') || s.includes('{1.5}')) return '#16a085'; // Special case for n^1.5
  if (s.includes('n') && s.includes('m') && s.includes('*')) return '#e67e22';
  if (s.includes('n') && s.includes('m') && s.includes('+')) return '#f39c12';
  if (s.includes('n²') || s.includes('n^2')) return '#e67e22';
  if (s.includes('n³') || s.includes('n^3')) return '#d35400';
  if (s.includes('2^n') || s.includes('exponential')) return '#34495e';
  if (s.includes('n!')) return '#8e44ad';
  if (s.includes('n log n')) return '#9b59b6';
  if (s.includes('n')) return '#e74c3c';
  return '#7f8c8d';
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
  const usesM = useMemo(() => /m\b/i.test(complexity), [complexity]);

  const data = useMemo(() => {
    let maxVal = 0;
    // Start from n=4 for log log patterns, n=2 for log patterns, n=1 for others
    const startN = complexity.toLowerCase().includes('log log') ? 4 : 
                   complexity.toLowerCase().includes('log') ? 2 : 1;
    
    // First pass: find max value
    for (let n = startN; n <= maxN; n += step) {
      const m = usesM ? Math.min(n, maxN) : n;
      const val = safeEval(complexity, n, m);
      maxVal = Math.max(maxVal, val);
    }

    console.log(`Max value for ${complexity}: ${maxVal}`); // Debug log

    const arr = [];
    // Second pass: generate data points
    for (let n = startN; n <= maxN; n += step) {
      const m = usesM ? Math.min(n, maxN) : n;
      const val = safeEval(complexity, n, m);
      arr.push({
        n,
        value: normalize && maxVal ? val / maxVal : val,
        normalizedValue: maxVal ? val / maxVal : 0
      });
    }

    return arr;
  }, [complexity, maxN, step, normalize, usesM]);

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
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 10, left: -60, bottom: 20 }}
        >
          <XAxis dataKey="n" stroke="#888" fontSize={12} />
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
            labelFormatter={(n) => `n = ${n}`}
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