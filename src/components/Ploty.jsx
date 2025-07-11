import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// ---------- helper to build data ----------
function buildData(points = 60) {
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
}

// ---------- main chart component ----------
export default function ComplexityChart({ highlight = 'linear' , typeOfComplexity = 'Time Complexity' }) {
  const dataset = useMemo(() => buildData(60), []);

  /** curve list with better spacing and colors */
  const curves = [
    { key: 'const',  name: 'O(1)', color: '#27ae60' },
    { key: 'log',    name: 'O(log N)', color: '#3498db' },
    { key: 'sqrt',   name: 'O(√N)', color: '#f39c12' },
    { key: 'linear', name: 'O(N)', color: '#e74c3c' },
    { key: 'nlogn',  name: 'O(N log N)', color: '#9b59b6' },
    { key: 'quad',   name: 'O(N²)', color: '#e67e22' },
    { key: 'exp',    name: 'O(2^N)', color: '#34495e' }
  ];

  // Find the highlighted curve for display
  const highlightedCurve = curves.find(curve => curve.key === highlight);

  return (
    <div style={{ width: '400px', height: '340px' }}>
      {/* Show which complexity is highlighted */}
      {highlightedCurve && (
        <div style={{ 
          marginBottom: '10px', 
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          color: highlightedCurve.color
        }}>
          {typeOfComplexity}{highlightedCurve.name}
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={dataset} 
          margin={{ top: 20, right: 10, left: -60, bottom: 20 }}
        >
          {/* <CartesianGrid stroke="#e0e0e0" strokeDasharray="2 2" /> */}
          <XAxis 
            dataKey="n" 
            tick={{ fill: '#666', fontSize: 12 }} 
            domain={[0, 60]}
            // label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            tick={{ fill: '#333', fontSize: 12 }} 
            domain={[0, 60]}
            // label={{ value: 'Time/Operations', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{ 
              background: '#262626', 
              border: 'none',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            labelStyle={{ color: '#fff' }}
          />

          {curves.map(({ key, name, color }) => {
            const isHighlighted = key === highlight;
            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={name}
                stroke={isHighlighted ? color : '#bbb'}
                strokeWidth={isHighlighted ? 4 : 1.5}
                dot={false}
                opacity={isHighlighted ? 1 : 0.4}
                strokeDasharray={isHighlighted ? '0' : '0'}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      
    </div>
  );
}