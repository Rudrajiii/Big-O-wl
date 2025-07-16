import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BiSolidMemoryCard } from 'react-icons/bi';
import { FiDatabase, FiHardDrive, FiActivity } from 'react-icons/fi';
import { MdMemory, MdStorage, MdSpeed } from 'react-icons/md';
import { BsSpeedometer, BsGraphUp } from 'react-icons/bs';

const MemoryAnalysis = ({ selectedCode, complexity = 'O(n)' }) => {
  const [inputSize, setInputSize] = useState(1000);
  const [memoryType, setMemoryType] = useState('stack'); // stack, heap, both

  // Parse space complexity
  const parseSpaceComplexity = (comp) => {
    const c = comp.toLowerCase().replace(/o\(|\)/g, '');
    if (c.includes('1') || c === 'constant') return (n) => 32; // 32 bytes constant
    if (c.includes('log')) return (n) => 32 + Math.log2(n) * 8;
    if (c.includes('n²') || c.includes('n^2')) return (n) => n * n * 4;
    if (c.includes('n³') || c.includes('n^3')) return (n) => n * n * n * 4;
    if (c.includes('n')) return (n) => n * 4; // 4 bytes per integer
    return (n) => 32; // default constant
  };

  // Generate memory usage data
  const memoryData = useMemo(() => {
    const spaceFn = parseSpaceComplexity(complexity);
    const data = [];
    const step = Math.max(1, Math.floor(inputSize / 20));
    
    for (let n = 1; n <= inputSize; n += step) {
      const baseMemory = spaceFn(n);
      const stackMemory = Math.min(baseMemory * 0.3, 8192); // Stack limit
      const heapMemory = baseMemory * 0.7;
      const totalMemory = stackMemory + heapMemory;
      
      data.push({
        inputSize: n,
        stackMemory: stackMemory,
        heapMemory: heapMemory,
        totalMemory: totalMemory,
        peakMemory: totalMemory * 1.2, // Peak during operations
        efficiency: Math.max(20, 100 - (totalMemory / (n * 8)) * 100)
      });
    }
    return data;
  }, [complexity, inputSize]);

  // Memory breakdown by type
  const memoryBreakdown = [
    { name: 'Variables', value: 35, color: '#3498db', bytes: 1024 },
    { name: 'Arrays/Objects', value: 40, color: '#e74c3c', bytes: 2048 },
    { name: 'Call Stack', value: 15, color: '#f39c12', bytes: 512 },
    { name: 'Overhead', value: 10, color: '#95a5a6', bytes: 256 }
  ];

  // Calculate metrics
  const currentData = memoryData[memoryData.length - 1] || {};
  const totalMemory = currentData.totalMemory || 0;
  const peakMemory = currentData.peakMemory || 0;
  const efficiency = currentData.efficiency || 0;

  // Format bytes
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

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
        borderBottom: '2px solid #27ae60',
        paddingBottom: '15px'
      }}>
        <BiSolidMemoryCard size={32} style={{ color: '#27ae60', marginRight: '12px' }} />
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
            Memory Profiling Analysis
        </h2>
      </div>

      {/* Input Controls */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '15px', 
        marginBottom: '25px',
        padding: '15px',
        background: 'rgba(39, 174, 96, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(39, 174, 96, 0.3)'
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
            Space Complexity
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
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#bdc3c7' }}>
            Memory Type
          </label>
          <select
            value={memoryType}
            onChange={(e) => setMemoryType(e.target.value)}
            style={{ 
              width: '100%',
              padding: '8px 12px', 
              background: '#34495e', 
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#ecf0f1'
            }}
          >
            <option value="stack">Stack</option>
            <option value="heap">Heap</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      {/* Memory Metrics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '25px' 
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #27ae60, #229954)', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <MdMemory size={24} style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: '600' }}>
            {formatBytes(totalMemory)}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Total Memory</div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #e74c3c, #c0392b)', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <FiActivity size={24} style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: '600' }}>
            {formatBytes(peakMemory)}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Peak Memory</div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f39c12, #e67e22)', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <BsSpeedometer size={24} style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: '600' }}>
            {efficiency.toFixed(1)}%
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Memory Efficiency</div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #9b59b6, #8e44ad)', 
          padding: '15px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <MdStorage size={24} style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: '600' }}>
            {(totalMemory / inputSize).toFixed(1)} B
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Memory per Item</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'flex', flexDirection:'column', gap: '20px', marginBottom: '20px' }}>
        {/* Memory Growth Chart */}
        <div style={{ 
          background: 'rgba(44, 62, 80, 0.3)', 
          padding: '15px', 
          borderRadius: '8px',
          border: '1px solid rgba(39, 174, 96, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#ecf0f1' }}>
            <BsGraphUp style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Memory Usage Growth Pattern
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={memoryData}>
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
                tickFormatter={(value) => formatBytes(value)}
              />
              <Tooltip 
                contentStyle={{ 
                  background: '#2c3e50', 
                  border: '1px solid #27ae60', 
                  borderRadius: '6px',
                  color: '#ecf0f1'
                }}
                formatter={(value, name) => [
                  formatBytes(value),
                  name === 'stackMemory' ? 'Stack Memory' : 
                  name === 'heapMemory' ? 'Heap Memory' : 
                  name === 'totalMemory' ? 'Total Memory' : 'Peak Memory'
                ]}
              />
              {memoryType === 'both' && (
                <>
                  <Area 
                    type="monotone" 
                    dataKey="stackMemory" 
                    stackId="1"
                    stroke="#3498db" 
                    fill="#3498db"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="heapMemory" 
                    stackId="1"
                    stroke="#e74c3c" 
                    fill="#e74c3c"
                    fillOpacity={0.6}
                  />
                </>
              )}
              {memoryType === 'stack' && (
                <Area 
                  type="monotone" 
                  dataKey="stackMemory" 
                  stroke="#3498db" 
                  fill="#3498db"
                  fillOpacity={0.6}
                />
              )}
              {memoryType === 'heap' && (
                <Area 
                  type="monotone" 
                  dataKey="heapMemory" 
                  stroke="#e74c3c" 
                  fill="#e74c3c"
                  fillOpacity={0.6}
                />
              )}
              <Line 
                type="monotone" 
                dataKey="peakMemory" 
                stroke="#f39c12" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Breakdown Pie Chart */}
        <div style={{ 
          background: 'rgba(44, 62, 80, 0.3)', 
          padding: '15px', 
          borderRadius: '8px',
          border: '1px solid rgba(39, 174, 96, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#ecf0f1' }}>
            Memory Allocation
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={memoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {memoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#2c3e50', 
                  border: '1px solid #27ae60', 
                  borderRadius: '6px',
                  color: '#ecf0f1'
                }}
                formatter={(value, name, props) => [
                  `${value}% (${formatBytes(props.payload.bytes)})`, 
                  'Usage'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div style={{ marginTop: '10px' }}>
            {memoryBreakdown.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '5px',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: item.color, 
                    marginRight: '8px',
                    borderRadius: '2px'
                  }} />
                  <span style={{ color: '#ecf0f1' }}>{item.name}</span>
                </div>
                <span style={{ color: '#bdc3c7' }}>{formatBytes(item.bytes)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Memory Efficiency Over Time */}
      <div style={{ 
        background: 'rgba(44, 62, 80, 0.3)', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid rgba(39, 174, 96, 0.2)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#ecf0f1' }}>
          <FiDatabase style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Memory Efficiency Pattern
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={memoryData}>
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
                border: '1px solid #27ae60', 
                borderRadius: '6px',
                color: '#ecf0f1'
              }}
              formatter={(value) => [`${value.toFixed(1)}%`, 'Efficiency']}
            />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#27ae60"
              strokeWidth={3}
              dot={{ fill: '#27ae60', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MemoryAnalysis;