import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { FiCpu, FiClock, FiZap, FiTrendingUp } from 'react-icons/fi';
import { BsSpeedometer2, BsGraphUp } from 'react-icons/bs';
import { MdSpeed, MdTimer } from 'react-icons/md';

const CPUAnalysis = ({ selectedCode, complexity = 'O(n)' }) => {
  const [inputSize, setInputSize] = useState(1000);
  const [customInput, setCustomInput] = useState('');

  // Parse complexity to get growth function
  const parseComplexity = (comp) => {
    const c = comp.toLowerCase().replace(/o\(|\)/g, '');
    if (c.includes('1') || c === 'constant') return (n) => 1;
    if (c.includes('log log')) return (n) => Math.log2(Math.log2(n)) || 0.1;
    if (c.includes('log')) return (n) => Math.log2(n);
    if (c.includes('n²') || c.includes('n^2')) return (n) => n * n;
    if (c.includes('n³') || c.includes('n^3')) return (n) => n * n * n;
    if (c.includes('2^n')) return (n) => Math.pow(2, Math.min(n, 20));
    if (c.includes('n!')) return (n) => n <= 10 ? factorial(n) : Math.pow(n, n);
    if (c.includes('n log n')) return (n) => n * Math.log2(n);
    if (c.includes('n')) return (n) => n;
    return (n) => n;
  };

  const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);

  // Generate performance data
  const performanceData = useMemo(() => {
    const growthFn = parseComplexity(complexity);
    const data = [];
    const step = Math.max(1, Math.floor(inputSize / 20));
    
    for (let n = 1; n <= inputSize; n += step) {
      const operations = growthFn(n);
      const timeMs = operations * 0.001; // Approximate time per operation
      data.push({
        inputSize: n,
        operations: operations,
        timeMs: timeMs,
        cpuUsage: Math.min(95, (operations / 1000000) * 100)
      });
    }
    return data;
  }, [complexity, inputSize]);

  // Execution breakdown data
  const executionBreakdown = [
    { name: 'Core Logic', value: 45, color: '#e74c3c' },
    { name: 'Memory Access', value: 25, color: '#3498db' },
    { name: 'I/O Operations', value: 15, color: '#f39c12' },
    { name: 'Overhead', value: 15, color: '#95a5a6' }
  ];

  // Calculate metrics
  const totalOperations = performanceData[performanceData.length - 1]?.operations || 0;
  const estimatedTime = performanceData[performanceData.length - 1]?.timeMs || 0;
  const avgCpuUsage = performanceData.reduce((sum, d) => sum + d.cpuUsage, 0) / performanceData.length;

  return (
    <div style={{ 
      padding: '20px', 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      borderRadius: '12px',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '20px',
        borderBottom: '2px solid #3498db',
        paddingBottom: '15px'
      }}>
        <FiCpu size={32} style={{ color: '#3498db', marginRight: '12px' }} />
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
            CPU Performance Analysis
        </h2>
      </div>

      {/* Input Controls */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '15px', 
        marginBottom: '25px',
        padding: '15px',
        background: 'rgba(52, 152, 219, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(52, 152, 219, 0.3)'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#bdc3c7' }}>
            Input Size (n)
          </label>
          <input
            type="range"
            min="10"
            max="10000"
            value={inputSize}
            onChange={(e) => setInputSize(parseInt(e.target.value))}
            style={{ width: '100%', marginBottom: '5px' }}
          />
          <span style={{ fontSize: '12px', color: '#ecf0f1' }}>{inputSize.toLocaleString()}</span>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#bdc3c7' }}>
            Complexity
          </label>
          <div style={{ 
            padding: '8px 12px', 
            background: '#34495e', 
            borderRadius: '6px',
            fontSize: '14px',
            color: '#ecf0f1'
          }}>
            {complexity}
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '25px' 
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #e74c3c, #c0392b)', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <MdTimer size={24} style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: '600' }}>
            {estimatedTime < 1 ? `${(estimatedTime * 1000).toFixed(1)}μs` : `${estimatedTime.toFixed(1)}ms`}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Estimated Time</div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #3498db, #2980b9)', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <BsSpeedometer2 size={24} style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: '600' }}>
            {totalOperations.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Total Operations</div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f39c12, #e67e22)', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <FiZap size={24} style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: '600' }}>
            {avgCpuUsage.toFixed(1)}%
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Avg CPU Usage</div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #27ae60, #229954)', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <BsGraphUp size={24} style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: '600' }}>
            {(totalOperations / inputSize).toFixed(1)}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Ops per Input</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'flex', flexDirection:'column', gap: '20px', marginBottom: '20px' }}>
        {/* Performance Growth Chart */}
        <div style={{ 
          background: 'rgba(44, 62, 80, 0.3)', 
          padding: '15px', 
          borderRadius: '8px',
          border: '1px solid rgba(52, 152, 219, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#ecf0f1' }}>
            <FiTrendingUp style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Performance Growth vs Input Size
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="inputSize" 
                stroke="#bdc3c7" 
                fontSize={12}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis 
                stroke="#bdc3c7" 
                fontSize={12}
                tickFormatter={(value) => value > 1000000 ? `${(value/1000000).toFixed(1)}M` : value.toLocaleString()}
              />
              <Tooltip 
                contentStyle={{ 
                  background: '#2c3e50', 
                  border: '1px solid #3498db', 
                  borderRadius: '6px',
                  color: '#ecf0f1'
                }}
                formatter={(value, name) => [
                  name === 'operations' ? value.toLocaleString() : `${value.toFixed(2)}ms`,
                  name === 'operations' ? 'Operations' : 'Time (ms)'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="operations" 
                stroke="#e74c3c" 
                strokeWidth={3}
                dot={{ fill: '#e74c3c', r: 4 }}
                name="operations"
              />
              <Line 
                type="monotone" 
                dataKey="timeMs" 
                stroke="#3498db" 
                strokeWidth={3}
                dot={{ fill: '#3498db', r: 4 }}
                name="timeMs"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Execution Breakdown Pie Chart */}
        <div style={{ 
          background: 'rgba(44, 62, 80, 0.3)', 
          padding: '15px', 
          borderRadius: '8px',
          border: '1px solid rgba(52, 152, 219, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#ecf0f1' }}>
            Execution Cost Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={executionBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {executionBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#2c3e50', 
                  border: '1px solid #3498db', 
                  borderRadius: '6px',
                  color: '#ecf0f1'
                }}
                formatter={(value) => [`${value}%`, 'Usage']}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div style={{ marginTop: '10px' }}>
            {executionBreakdown.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '5px',
                fontSize: '12px'
              }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: item.color, 
                  marginRight: '8px',
                  borderRadius: '2px'
                }} />
                <span style={{ color: '#ecf0f1' }}>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CPU Usage Over Time */}
      <div style={{ 
        background: 'rgba(44, 62, 80, 0.3)', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid rgba(52, 152, 219, 0.2)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#ecf0f1' }}>
          <MdSpeed style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          CPU Usage Pattern
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={performanceData.slice(-10)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="inputSize" 
              stroke="#bdc3c7" 
              fontSize={12}
            />
            <YAxis 
              stroke="#bdc3c7" 
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#2c3e50', 
                border: '1px solid #3498db', 
                borderRadius: '6px',
                color: '#ecf0f1'
              }}
              formatter={(value) => [`${value.toFixed(1)}%`, 'CPU Usage']}
            />
            <Bar 
              dataKey="cpuUsage" 
              fill="url(#cpuGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f39c12" />
                <stop offset="100%" stopColor="#e67e22" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CPUAnalysis;