import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, HardDrive, Code, AlertCircle, CheckCircle, TrendingUp, Star, Zap, Shield, Cpu, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import '../styles/test.scss';

const Test = () => {
  const [expandedSections, setExpandedSections] = useState({
    timeComplexity: false,
    memoryAnalysis: false,
    codeQuality: false,
    designAnalysis: false,
    potentialIssues: false,
    optimizations: false
  });

  const data = {
    "time_complexity": {
      "overall": "O(n)",
      "best_case": "O(n)",
      "worst_case": "O(n)",
      "explanation": "Linear scans of the array",
      "chart_data": {
        "input_sizes": [10, 100, 1000, 10000],
        "operations_count": [10, 100, 1000, 10000],
        "growth_type": "linear"
      }
    },
    "memory_analysis": {
      "total_memory_used": "~128 B",
      "peak_memory": "~160 B",
      "memory_growth": "constant",
      "variable_memory": {
        "nums": {
          "description": "Input array",
          "estimate": "~64 B"
        },
        "i": {
          "description": "Index variable",
          "estimate": "~4 B"
        },
        "j": {
          "description": "Index variable",
          "estimate": "~4 B"
        },
        "temp": {
          "description": "Temporary variable",
          "estimate": "~4 B"
        }
      },
      "temporary_objects": {
        "swap": "~0 B"
      },
      "memory_behavior": "O(1)",
      "chart_data": {
        "input_sizes": [10, 100, 1000, 10000],
        "memory_usage_bytes": [128, 128, 128, 128]
      }
    },
    "code_quality": {
      "readability": "High",
      "modularity": "Well-separated",
      "naming_conventions": "Consistent",
      "comments": "Sufficient",
      "code_smells": ["No deep nesting", "No magic numbers", "No repeated logic"]
    },
    "design_analysis": {
      "paradigm": "Procedural",
      "structure": "Single function with helper functions",
      "reusability": "Reusable",
      "extensibility": "Easily extendable"
    },
    "potential_issues": {
      "bugs": [],
      "edge_cases": ["Empty input", "Single-element input"],
      "performance_issues": [],
      "security": ["None"]
    },
    "optimization_suggestions": {
      "memory": [],
      "performance": [],
      "design": ["Consider using more descriptive variable names"]
    },
    "final_rating": {
      "efficiency_score": 9,
      "readability_score": 8,
      "scalability_score": 9,
      "overall_comment": "Efficient, readable, and scalable code."
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'var(--leetcode-green)';
    if (score >= 7) return 'var(--leetcode-yellow)';
    if (score >= 5) return 'var(--leetcode-orange)';
    return 'var(--leetcode-red)';
  };

  const getScoreText = (score) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Average';
    return 'Needs Improvement';
  };

  //* Chart data preparation for time complexity
  const timeComplexityChartData = data.time_complexity.chart_data.input_sizes.map((size, index) => ({
    inputSize: size,
    operations: data.time_complexity.chart_data.operations_count[index]
  }));

  const timeComplexityLabelData = [
                    {"Best Case" : data.time_complexity.best_case},
                    {"Worst Case" : data.time_complexity.worst_case},
                    {"Growth Type" : data.time_complexity.chart_data.growth_type}
                ];
  //* Chart data preparation for memory analysis
  const memoryChartData = data.memory_analysis.chart_data.input_sizes.map((size, index) => ({
    inputSize: size,
    memoryUsage: data.memory_analysis.chart_data.memory_usage_bytes[index]
  }));

  const memoryLabelData = [
    {"Total Memory Used": data.memory_analysis.total_memory_used},
    {"Peak Memory": data.memory_analysis.peak_memory},
    {"Memory Growth": data.memory_analysis.memory_growth},
  ]

  const parseMemoryValue = (str) => {
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const variableMemoryData = Object.entries(data.memory_analysis.variable_memory).map(([key, value]) => ({
    name: key,
    value: parseMemoryValue(value.estimate),
    description: value.description
  }));

  const ratingChartData = [
    { metric: 'Efficiency', score: data.final_rating.efficiency_score, fullMark: 10 },
    { metric: 'Readability', score: data.final_rating.readability_score, fullMark: 10 },
    { metric: 'Scalability', score: data.final_rating.scalability_score, fullMark: 10 }
  ];

  const qualityMetrics = [
    { name: 'Readability', labelValue:data.code_quality.readability, value: data.code_quality.readability === 'High' ? 90 : data.code_quality.readability === 'Medium' ? 70 : 50 },
    { name: 'Modularity', labelValue:data.code_quality.modularity, value: data.code_quality.modularity === 'Well-separated' ? 85 : 60 },
    { name: 'Naming', labelValue:data.code_quality.naming_conventions, value: data.code_quality.naming_conventions === 'Consistent' ? 80 : 60 },
    { name: 'Comments', labelValue:data.code_quality.comments, value: data.code_quality.comments === 'Sufficient' ? 75 : 50 }
  ];


  const CHART_COLORS = ['#00b8a3', '#ffa116', '#ff8c00', '#ff4757', '#0ea5e9', '#8b5cf6'];

  return (
    <div className="test-container">

      {/* Rating Section - Top Priority */}
      <div className="test-rating">
        <h2 className="test-rating__title">
          <Star className="test-rating__icon" />
          Overall Rating
        </h2>
        <div className="test-rating__scores">
            {
                ratingChartData.map((item, index) => (
                    <div className="test-rating__score" key={index}>
                        <div className="test-rating__score-circle" style={{ borderColor: getScoreColor(item.score) }}>
                            <span className="test-rating__score-value">{item.score}</span>
                            {/* <span className="test-rating__score-max">/10</span> */}
                        </div>
                        <div className="test-rating__score-info">
                            <h4>{item.metric}</h4>
                            <p>{getScoreText(item.score)}</p>
                        </div>
                    </div>
                ))
            }
        </div>
        <div className="test-rating__comment">
          <p>"{data.final_rating.overall_comment}"</p>
        </div>
      </div>

      {/* Analysis Sections */}
      <div className="test-sections">
        {/* Time Complexity */}
        <div className="test-section">
          <div className="test-section__header" onClick={() => toggleSection('timeComplexity')}>
            <div className="test-section__header-left">
              <Clock className="test-section__icon" />
              <h3>Time Complexity</h3>
              <span className="test-section__badge">{data.time_complexity.overall}</span>
            </div>
            {expandedSections.timeComplexity ? <ChevronDown /> : <ChevronRight />}
          </div>
          {expandedSections.timeComplexity && (
            <div className="test-section__content">
              <div className="test-section__grid">
                {
                    timeComplexityLabelData.map((item, index) => (
                        <div className="test-section__item" key={index}>
                            <span className="test-section__label">{Object.keys(item)[0]} ~</span>
                            <span className="test-section__value">{Object.values(item)[0]}</span>
                        </div>
                    ))
                }
              </div>
              <p className="test-section__explanation">{data.time_complexity.explanation}</p>
              
              {/* Time Complexity Chart */}
              <div className="test-section__chart">
                <h4>
                  <BarChart3 size={16} />
                  Operations vs Input Size
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeComplexityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="inputSize" stroke="#a0a0a0" />
                    <YAxis stroke="#a0a0a0" />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#262626', 
                        border: '1px solid #00b8a3',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Line type="monotone" dataKey="operations" stroke="#00b8a3" strokeWidth={3} dot={{ fill: '#00b8a3', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Memory Analysis */}
        <div className="test-section">
          <div className="test-section__header" onClick={() => toggleSection('memoryAnalysis')}>
            <div className="test-section__header-left">
              <HardDrive className="test-section__icon" />
              <h3>Memory Analysis</h3>
              <span className="test-section__badge">{data.memory_analysis.memory_behavior}</span>
            </div>
            {expandedSections.memoryAnalysis ? <ChevronDown /> : <ChevronRight />}
          </div>
          {expandedSections.memoryAnalysis && (
            <div className="test-section__content">
              <div className="test-section__grid">
                {
                    memoryLabelData.map((item , index) => {
                        const key = Object.keys(item)[0];
                        const value = Object.values(item)[0];
                        return (
                            <div className="test-section__item" key={index}>
                            <span className="test-section__label">{key} ~</span>
                            <span className="test-section__value">{value}</span>
                            </div>
                        );
                    })
                }
              </div>

              {/* Memory Usage Line Chart */}
              <div className="test-section__chart">
                <h4>
                  <TrendingUp size={16} />
                  Memory Usage vs Input Size
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={memoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="inputSize" stroke="#a0a0a0" />
                    <YAxis stroke="#a0a0a0" />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#262626', 
                        border: '1px solid #ffa116',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Line type="monotone" dataKey="memoryUsage" stroke="#ffa116" strokeWidth={3} dot={{ fill: '#ffa116', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Variable Memory Pie Chart */}
              <div className="test-section__chart">
                <h4>
                  <PieChartIcon size={16} />
                  Variable Memory Distribution
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={variableMemoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {variableMemoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: '#262626', 
                        border: '1px solid #00b8a3',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="test-section__variables">
                <h4>Variable Memory Breakdown:</h4>
                {Object.entries(data.memory_analysis.variable_memory).map(([key, value]) => (
                  <div key={key} className="test-section__variable">
                    <span className="test-section__variable-name">{key}</span>
                    <span className="test-section__variable-size">{value.estimate}</span>
                    <span className="test-section__variable-desc">{value.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Code Quality */}
        <div className="test-section">
          <div className="test-section__header" onClick={() => toggleSection('codeQuality')}>
            <div className="test-section__header-left">
              <CheckCircle className="test-section__icon" />
              <h3>Code Quality</h3>
              <span className="test-section__badge test-section__badge--success">{data.code_quality.readability}</span>
            </div>
            {expandedSections.codeQuality ? <ChevronDown /> : <ChevronRight />}
          </div>
          {expandedSections.codeQuality && (
            <div className="test-section__content">
              <div className="test-section__grid">
                {
                    qualityMetrics.map((metric, index) => ( 
                        <div className="test-section__item" key={index}>
                            <span className="test-section__label">{metric.name} ~</span>
                            <span className="test-section__value" >
                            {metric.labelValue} <span style={{ color: getScoreColor(metric.value / 10) }}>({metric.value}%)</span> 
                            </span>
                        </div>
                        ))
                }
                
              </div>

              

              <div className="test-section__list">
                <h4>Code Smells Analysis:</h4>
                {data.code_quality.code_smells.map((smell, index) => (
                  <div key={index} className="test-section__list-item test-section__list-item--success">
                    <CheckCircle size={16} />
                    {smell}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Design Analysis */}
        <div className="test-section">
          <div className="test-section__header" onClick={() => toggleSection('designAnalysis')}>
            <div className="test-section__header-left">
              <Cpu className="test-section__icon" />
              <h3>Design Analysis</h3>
              <span className="test-section__badge">{data.design_analysis.paradigm}</span>
            </div>
            {expandedSections.designAnalysis ? <ChevronDown /> : <ChevronRight />}
          </div>
          {expandedSections.designAnalysis && (
            <div className="test-section__content">
              <div className="test-section__grid">
                {Object.entries(data.design_analysis).map(([key, value]) => (
                  <div key={key} className="test-section__item">
                    <span className="test-section__label">{key.replace('_', ' ')} ~</span>
                    <span className="test-section__value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Potential Issues */}
        <div className="test-section">
          <div className="test-section__header" onClick={() => toggleSection('potentialIssues')}>
            <div className="test-section__header-left">
              <AlertCircle className="test-section__icon" />
              <h3>Potential Issues</h3>
              <span className="test-section__badge test-section__badge--warning">
                {data.potential_issues.edge_cases.length} Edge Cases
              </span>
            </div>
            {expandedSections.potentialIssues ? <ChevronDown /> : <ChevronRight />}
          </div>
          {expandedSections.potentialIssues && (
            <div className="test-section__content">
              

              <div className="test-section__subsection">
                <h4>Edge Cases:</h4>
                {data.potential_issues.edge_cases.map((edge, index) => (
                  <div key={index} className="test-section__list-item test-section__list-item--warning">
                    <AlertCircle size={16} />
                    {edge}
                  </div>
                ))}
              </div>
              <div className="test-section__subsection">
                <h4>Security:</h4>
                {data.potential_issues.security.map((sec, index) => (
                  <div key={index} className="test-section__list-item test-section__list-item--success">
                    <Shield size={16} />
                    {sec}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Optimization Suggestions */}
        <div className="test-section">
          <div className="test-section__header" onClick={() => toggleSection('optimizations')}>
            <div className="test-section__header-left">
              <Zap className="test-section__icon" />
              <h3>Optimization Suggestions</h3>
              <span className="test-section__badge test-section__badge--info">
                {data.optimization_suggestions.design.length} Suggestions
              </span>
            </div>
            {expandedSections.optimizations ? <ChevronDown /> : <ChevronRight />}
          </div>
          {expandedSections.optimizations && (
            <div className="test-section__content">
              

              <div className="test-section__subsection">
                <h4>Design Improvements:</h4>
                {data.optimization_suggestions.design.map((suggestion, index) => (
                  <div key={index} className="test-section__list-item test-section__list-item--info">
                    <TrendingUp size={16} />
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;