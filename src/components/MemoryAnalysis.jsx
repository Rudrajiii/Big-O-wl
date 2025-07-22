import React, { useState, useEffect } from 'react';
import { BiSolidMemoryCard, BiLineChart } from 'react-icons/bi';
import { FiCpu, FiDatabase, FiTrendingUp, FiZap } from 'react-icons/fi';
import { MdMemory, MdSpeed, MdStorage } from 'react-icons/md';
import { BsGraphUp, BsSpeedometer } from 'react-icons/bs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import '../styles/MemAnalysis.scss';

const MemoryAnalysis = ({complexity}) => {
  const [memoryData, setMemoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  console.log("complexity", complexity);

  // Helper function to parse memory values safely
  const parseMemoryValue = (memoryStr) => {
    if (!memoryStr) return 0;
    
    // Convert to string and lowercase for easier matching
    const str = memoryStr.toString().toLowerCase();
    
    // Extract number and unit, handle ~ symbol and various formats
    const match = str.match(/~?\s*(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?/);
    if (!match) {
      console.warn('Could not parse memory value:', memoryStr);
      return 0;
    }
    
    const value = parseFloat(match[1]);
    const unit = match[2] || 'b';
    
    // Convert to bytes
    switch (unit) {
      case 'kb': return value * 1024;
      case 'mb': return value * 1024 * 1024;
      case 'gb': return value * 1024 * 1024 * 1024;
      default: return value; // bytes
    }
  };

  useEffect(() => {
    loadMemoryData();
  }, []);

  const loadMemoryData = () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['memoryAnalysis'], (result) => {
          if (result.memoryAnalysis) {
            setMemoryData(result.memoryAnalysis);
          }
          setLoading(false);
        });
      } else {
        // Fallback for development without chrome extension
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading memory data:', error);
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getMemoryEfficiencyColor = (efficiency) => {
    if (efficiency === 'High') return '#27ae60';
    if (efficiency === 'Medium') return '#f39c12';
    return '#e74c3c';
  };

  const getScalabilityColor = (scalability) => {
    if (scalability === 'Stable') return '#27ae60';
    if (scalability === 'Growing') return '#f39c12';
    return '#e74c3c';
  };

  if (loading) {
    return (
      <div className="memory-page">
        <div className="memory-page__loading">
          <BiSolidMemoryCard size={48} className="memory-page__loading-icon" />
          <p>Loading memory analysis...</p>
        </div>
      </div>
    );
  }

  if (!memoryData) {
    return (
      <div className="memory-page">
        <div className="memory-page__no-data">
          <BiSolidMemoryCard size={48} className="memory-page__no-data-icon" />
          <h3>No Memory Analysis Available</h3>
          <p>Please run a memory analysis first by clicking the memory icon.</p>
        </div>
      </div>
    );
  }

  // Prepare chart data with safe parsing
  const chartData = memoryData.chart_data?.input_sizes?.map((size, index) => ({
    inputSize: size,
    memoryUsage: parseMemoryValue(memoryData.chart_data.memory_usage_bytes[index])
  })) || [];

  // Variable memory breakdown for pie chart with safe parsing
  const variableMemory = Object.entries(memoryData.details?.variable_memory || {}).map(([key, value]) => {
    // Safe extraction of numeric value
    const numericValue = parseMemoryValue(value?.estimate);
    return {
      name: key,
      value: numericValue,
      originalEstimate: value?.estimate || 'Unknown', // Keep original for display
      description: value?.description || 'No description',
      color: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6', '#1abc9c'][Object.keys(memoryData.details.variable_memory).indexOf(key) % 6]
    };
  }).filter(item => item.value > 0); // Filter out items with 0 or invalid values

  return (
    <div className="memory-page">


      {/* Navigation Tabs */}
      <div className="memory-page__tabs">
        <button 
          className={`memory-page__tab ${activeTab === 'overview' ? 'memory-page__tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FiDatabase size={16} />
          Overview
        </button>
        <button 
          className={`memory-page__tab ${activeTab === 'details' ? 'memory-page__tab--active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <MdMemory size={16} />
          Details
        </button>
        <button 
          className={`memory-page__tab ${activeTab === 'charts' ? 'memory-page__tab--active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          <BiLineChart size={16} />
          Charts
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="memory-page__content">
          {/* Summary Cards */}
          <div className="memory-page__summary">
            <div className="memory-page__card memory-page__card--primary">
              <MdStorage size={24} className="memory-page__card-icon" />
              <div className="memory-page__card-content">
                <h3>{memoryData.summary?.total_memory_used || 'N/A'}</h3>
                <p>Total Memory Used</p>
              </div>
            </div>

            <div className="memory-page__card memory-page__card--danger">
              <FiZap size={24} className="memory-page__card-icon" />
              <div className="memory-page__card-content">
                <h3>{memoryData.summary?.peak_memory || 'N/A'}</h3>
                <p>Peak Memory</p>
              </div>
            </div>

            <div className="memory-page__card memory-page__card--warning">
              <FiTrendingUp size={24} className="memory-page__card-icon" />
              <div className="memory-page__card-content">
                <h3>{memoryData.summary?.memory_growth || 'N/A'}</h3>
                <p>Growth Pattern</p>
              </div>
            </div>

            <div className="memory-page__card memory-page__card--success">
              <BsSpeedometer size={24} className="memory-page__card-icon" />
              <div className="memory-page__card-content">
                <h3>{memoryData.memory_classification?.efficiency || 'N/A'}</h3>
                <p>Efficiency</p>
              </div>
            </div>
          </div>

          {/* Memory Classification */}
          <div className="memory-page__classification">
            <h3 className="memory-page__section-title">
              <FiCpu className="memory-page__section-icon" />
              Memory Classification
            </h3>
            <div className="memory-page__classification-grid">
              <div className="memory-page__classification-item">
                <span className="memory-page__classification-label">Overall Usage:</span>
                <span 
                  className="memory-page__classification-value"
                  style={{ color: getMemoryEfficiencyColor(memoryData.memory_classification?.overall) }}
                >
                  {memoryData.memory_classification?.overall || 'Unknown'}
                </span>
              </div>
              <div className="memory-page__classification-item">
                <span className="memory-page__classification-label">Scalability:</span>
                <span 
                  className="memory-page__classification-value"
                  style={{ color: getScalabilityColor(memoryData.memory_classification?.scalability) }}
                >
                  {memoryData.memory_classification?.scalability || 'Unknown'}
                </span>
              </div>
              <div className="memory-page__classification-item">
                <span className="memory-page__classification-label">Efficiency:</span>
                <span 
                  className="memory-page__classification-value"
                  style={{ color: getMemoryEfficiencyColor(memoryData.memory_classification?.efficiency) }}
                >
                  {memoryData.memory_classification?.efficiency || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Observation */}
          <div className="memory-page__observation">
            <h3 className="memory-page__section-title">
              <FiDatabase className="memory-page__section-icon" />
              Key Observation
            </h3>
            <div className="memory-page__observation-content">
              <p>{memoryData.summary?.observation || 'No observation available.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="memory-page__content">
          {/* Variable Memory Details */}
          <div className="memory-page__variables">
            <h3 className="memory-page__section-title">
              <MdMemory className="memory-page__section-icon" />
              Variable Memory Breakdown
            </h3>
            <div className="memory-page__variables-grid">
              {Object.entries(memoryData.details?.variable_memory || {}).map(([key, value]) => (
                <div key={key} className="memory-page__variable-card">
                  <h4 className="memory-page__variable-name">{key}</h4>
                  <p className="memory-page__variable-description">{value?.description || 'No description'}</p>
                  <span className="memory-page__variable-size">{value?.estimate || 'Unknown'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Temporary Objects */}
          {memoryData.details?.temporary_objects && (
            <div className="memory-page__temp-objects">
              <h3 className="memory-page__section-title">
                <FiZap className="memory-page__section-icon" />
                Temporary Objects
              </h3>
              <div className="memory-page__temp-grid">
                {Object.entries(memoryData.details.temporary_objects).map(([key, value]) => (
                  <div key={key} className="memory-page__temp-item">
                    <span className="memory-page__temp-name">{key}:</span>
                    <span className="memory-page__temp-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Notes */}
          {memoryData.analysis_notes && (
            <div className="memory-page__notes">
              <h3 className="memory-page__section-title">
                <BsGraphUp className="memory-page__section-icon" />
                Analysis Notes
              </h3>
              <div className="memory-page__notes-grid">
                {Object.entries(memoryData.analysis_notes).map(([key, value]) => (
                  <div key={key} className="memory-page__note-item">
                    <span className="memory-page__note-label">{key.replace(/_/g, ' ')}:</span>
                    <span className="memory-page__note-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="memory-page__content">
          {/* Memory Usage Chart */}
          <div className="memory-page__chart-section">
            <h3 className="memory-page__section-title">
              <BiLineChart className="memory-page__section-icon" />
              Memory Usage vs Input Size
            </h3>
            <div className="memory-page__chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="inputSize" 
                    stroke="#bdc3c7" 
                    fontSize={12}
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
                    formatter={(value) => [formatBytes(value), 'Memory Usage']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="memoryUsage" 
                    stroke="#27ae60"
                    strokeWidth={3}
                    dot={{ fill: '#27ae60', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Variable Memory Pie Chart */}
          <div className="memory-page__chart-section">
            <h3 className="memory-page__section-title">
              <MdMemory className="memory-page__section-icon" />
              Variable Memory Distribution
            </h3>
            <div className="memory-page__pie-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={variableMemory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {variableMemory.map((entry, index) => (
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
                    formatter={(value) => [formatBytes(value), 'Memory']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="memory-page__pie-legend">
                {variableMemory.map((item, index) => (
                  <div key={index} className="memory-page__legend-item">
                    <div 
                      className="memory-page__legend-color"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="memory-page__legend-text">
                      {item.name}: {item.originalEstimate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryAnalysis;