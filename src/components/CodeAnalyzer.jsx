import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Clock, HardDrive, Code, AlertCircle, CheckCircle, TrendingUp, Star, Zap, Shield, Cpu, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import '../styles/test.scss';
import { BiSolidMemoryCard, BiLineChart } from 'react-icons/bi';

const Test = () => {
  const [expandedSections, setExpandedSections] = useState({
    timeComplexity: false,
    memoryAnalysis: false,
    codeQuality: false,
    designAnalysis: false,
    potentialIssues: false,
    optimizations: false
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemoryData();
  }, []);

  const loadMemoryData = () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['memoryAnalysis'], (result) => {
          console.log('Loaded data:', result.memoryAnalysis); // Debug log
          if (result.memoryAnalysis) {
            setData(result.memoryAnalysis);
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

  if (loading) {
    return (
      <div className="test-container">
        <div className="analysis-page__loading">
          <BiSolidMemoryCard size={48} className="analysis-page__loading-icon" />
          <p>Loading overall analysis...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="test-container">
        <div className="analysis-page__no-data">
          <BiSolidMemoryCard size={48} className="analysis-page__no-data-icon" />
          <h3>No Analysis Available</h3>
          <p>Please run a complete analysis first.</p>
        </div>
      </div>
    );
  }

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

  // Safe data extraction with defaults
  const timeComplexity = data.time_complexity || {};
  const memoryAnalysis = data.memory_analysis || {};
  const codeQuality = data.code_quality || {};
  const designAnalysis = data.design_analysis || {};
  const potentialIssues = data.potential_issues || {};
  console.log('Potential Issues:', potentialIssues);
  const optimizationSuggestions = data.optimization_suggestions || {};
  const finalRating = data.final_rating || {};

  // Chart data preparation for time complexity with safe access
  const timeComplexityChartData = timeComplexity.chart_data?.input_sizes?.map((size, index) => ({
    inputSize: size,
    operations: timeComplexity.chart_data.operations_count[index] || 0
  })) || [];

  const timeComplexityLabelData = [
    {"Best Case": timeComplexity.best_case || 'N/A'},
    {"Worst Case": timeComplexity.worst_case || 'N/A'},
    {"Growth Type": timeComplexity.chart_data?.growth_type || 'N/A'}
  ];

  // Chart data preparation for memory analysis with safe access
  const memoryChartData = memoryAnalysis.chart_data?.input_sizes?.map((size, index) => ({
    inputSize: size,
    memoryUsage: memoryAnalysis.chart_data.memory_usage_bytes[index] || 0
  })) || [];

  const memoryLabelData = [
    {"Total Memory Used": memoryAnalysis.total_memory_used || 'N/A'},
    {"Peak Memory": memoryAnalysis.peak_memory || 'N/A'},
    {"Memory Growth": memoryAnalysis.memory_growth || 'N/A'},
  ];

  const parseMemoryValue = (str) => {
    if (!str) return 0;
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const variableMemoryData = Object.entries(memoryAnalysis.variable_memory || {}).map(([key, value]) => ({
    name: key,
    value: parseMemoryValue(value?.estimate || '0'),
    description: value?.description || 'No description'
  }));

  const ratingChartData = [
    { metric: 'Efficiency', score: finalRating.efficiency_score || 0, fullMark: 10 },
    { metric: 'Readability', score: finalRating.readability_score || 0, fullMark: 10 },
    { metric: 'Scalability', score: finalRating.scalability_score || 0, fullMark: 10 }
  ];

  const qualityMetrics = [
    { 
      name: 'Readability', 
      labelValue: codeQuality.readability || 'N/A', 
      value: codeQuality.readability === 'High' ? 90 : codeQuality.readability === 'Medium' ? 70 : 50 
    },
    { 
      name: 'Modularity', 
      labelValue: codeQuality.modularity || 'N/A', 
      value: codeQuality.modularity === 'Well-separated' ? 85 : 60 
    },
    { 
      name: 'Naming', 
      labelValue: codeQuality.naming_conventions || 'N/A', 
      value: codeQuality.naming_conventions === 'Consistent' ? 80 : 60 
    },
    { 
      name: 'Comments', 
      labelValue: codeQuality.comments || 'N/A', 
      value: codeQuality.comments === 'Sufficient' ? 75 : 50 
    }
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
          {ratingChartData.map((item, index) => (
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
          ))}
        </div>
        
        
        <div className="test-rating__comment">
          <p>"{finalRating.overall_comment || 'No comment available.'}"</p>
        </div>
      </div>

      {/* Analysis Sections */}
      <div className="test-sections">
        {/* Time Complexity */}
        {timeComplexity.overall && (
          <div className="test-section">
            <div className="test-section__header" onClick={() => toggleSection('timeComplexity')}>
              <div className="test-section__header-left">
                <Clock className="test-section__icon" />
                <h3>Time Complexity</h3>
                <span className="test-section__badge test-section__badge--success">{timeComplexity.overall}</span>
              </div>
              {expandedSections.timeComplexity ? <ChevronDown /> : <ChevronRight />}
            </div>
            {expandedSections.timeComplexity && (
              <div className="test-section__content">
                <div className="test-section__grid">
                  {timeComplexityLabelData.map((item, index) => (
                    <div className="test-section__item" key={index}>
                      <span className="test-section__label">{Object.keys(item)[0]} ~</span>
                      <span className="test-section__value">{Object.values(item)[0]}</span>
                    </div>
                  ))}
                </div>
                {timeComplexity.explanation && (
                  <p className="test-section__explanation">{timeComplexity.explanation}</p>
                )}
                
                {/* Time Complexity Chart */}
                {timeComplexityChartData.length > 0 && (
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
                )}
              </div>
            )}
          </div>
        )}

        {/* Memory Analysis */}
        {memoryAnalysis.memory_behavior && (
          <div className="test-section">
            <div className="test-section__header" onClick={() => toggleSection('memoryAnalysis')}>
              <div className="test-section__header-left">
                <HardDrive className="test-section__icon" />
                <h3>Memory Analysis</h3>
                <span className="test-section__badge test-section__badge--success">{memoryAnalysis.memory_behavior}</span>
              </div>
              {expandedSections.memoryAnalysis ? <ChevronDown /> : <ChevronRight />}
            </div>
            {expandedSections.memoryAnalysis && (
              <div className="test-section__content">
                <div className="test-section__grid">
                  {memoryLabelData.map((item, index) => {
                    const key = Object.keys(item)[0];
                    const value = Object.values(item)[0];
                    return (
                      <div className="test-section__item" key={index}>
                        <span className="test-section__label">{key} ~</span>
                        <span className="test-section__value">{value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Memory Usage Line Chart */}
                {memoryChartData.length > 0 && (
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
                )}

                {/* Variable Memory Pie Chart */}
                {variableMemoryData.length > 0 && (
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
                )}

                {/* Variable Memory Breakdown */}
                {Object.keys(memoryAnalysis.variable_memory || {}).length > 0 && (
                  <div className="test-section__variables">
                    <h4>Variable Memory Breakdown:</h4>
                    {Object.entries(memoryAnalysis.variable_memory).map(([key, value]) => (
                      <div key={key} className="test-section__variable">
                        <span className="test-section__variable-name">{key}</span>
                        <span className="test-section__variable-size">{value?.estimate || 'N/A'}</span>
                        <span className="test-section__variable-desc">{value?.description || 'No description'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Code Quality */}
        {codeQuality.readability && (
          <div className="test-section">
            <div className="test-section__header" onClick={() => toggleSection('codeQuality')}>
              <div className="test-section__header-left">
                <CheckCircle className="test-section__icon" />
                <h3>Code Quality</h3>
                <span className="test-section__badge test-section__badge--success">{codeQuality.readability}</span>
              </div>
              {expandedSections.codeQuality ? <ChevronDown /> : <ChevronRight />}
            </div>
            {expandedSections.codeQuality && (
              <div className="test-section__content">
                <div className="test-section__grid">
                  {qualityMetrics.map((metric, index) => ( 
                    <div className="test-section__item" key={index}>
                      <span className="test-section__label">{metric.name} ~</span>
                      <span className="test-section__value">
                        {metric.labelValue} <span style={{ color: getScoreColor(metric.value / 10) }}>({metric.value}%)</span> 
                      </span>
                    </div>
                  ))}
                </div>

                

                {/* Code Smells */}
                {codeQuality.code_smells && codeQuality.code_smells.length > 0 && (
                  <div className="test-section__list">
                    <h4>Code Smells Analysis:</h4>
                    {codeQuality.code_smells.map((smell, index) => (
                      <div key={index} className="test-section__list-item test-section__list-item--success">
                        <CheckCircle size={16} />
                        {smell}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Design Analysis */}
        {designAnalysis.paradigm && (
          <div className="test-section">
            <div className="test-section__header" onClick={() => toggleSection('designAnalysis')}>
              <div className="test-section__header-left">
                <Cpu className="test-section__icon" />
                <h3>Design Analysis</h3>
                <span className="test-section__badge--success test-section__badge">{designAnalysis.paradigm}</span>
              </div>
              {expandedSections.designAnalysis ? <ChevronDown /> : <ChevronRight />}
            </div>
            {expandedSections.designAnalysis && (
              <div className="test-section__content">
                <div className="test-section__grid">
                  {Object.entries(designAnalysis).map(([key, value]) => (
                    <div key={key} className="test-section__item">
                      <span className="test-section__label">{key.replace('_', ' ')} ~</span>
                      <span className="test-section__value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Potential Issues */}
        {(potentialIssues.edge_cases?.length > 0 || potentialIssues.security?.length > 0) && (
          <div className="test-section">
            <div className="test-section__header" onClick={() => toggleSection('potentialIssues')}>
              <div className="test-section__header-left">
                <AlertCircle className="test-section__icon" />
                <h3>Potential Issues</h3>
                <span className="test-section__badge test-section__badge--warning">
                  {potentialIssues.edge_cases?.length || 0} Edge Cases
                </span>
              </div>
              {expandedSections.potentialIssues ? <ChevronDown /> : <ChevronRight />}
            </div>
            {expandedSections.potentialIssues && (
                <div className="test-section__content">
                    {potentialIssues.bugs && potentialIssues.bugs.length > 0 ? (
                        <div className="test-section__subsection">
                            <h4>Bugs:</h4>
                            {potentialIssues.bugs.map((bug, index) => (
                                <div key={index} style={{ color: 'red' }} className="test-section__list-item test-section__list-item--error">
                                    <AlertCircle size={16} />
                                    {bug}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="test-section__subsection">
                          <h4>Bugs:</h4>
                            <div style={{ color: 'red' }} className="test-section__list-item test-section__list-item--error">
                              <AlertCircle size={16} /> No Bugs Found
                            </div>
                        </div>
                    )}
                </div>
            )}

            {expandedSections.potentialIssues && (
              <div className="test-section__content">
                {potentialIssues.edge_cases && potentialIssues.edge_cases.length > 0 && (
                  <div className="test-section__subsection">
                    <h4>Edge Cases:</h4>
                    {potentialIssues.edge_cases.map((edge, index) => (
                      <div key={index} className="test-section__list-item test-section__list-item--warning">
                        <AlertCircle size={16} />
                        {edge}
                      </div>
                    ))}
                  </div>
                )}
                {potentialIssues.security && potentialIssues.security.length > 0 && (
                  <div className="test-section__subsection">
                    <h4>Security:</h4>
                    {potentialIssues.security.map((sec, index) => (
                      <div key={index} className="test-section__list-item test-section__list-item--success">
                        <Shield size={16} />
                        {sec}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Optimization Suggestions */}
        {optimizationSuggestions.design?.length > 0 && (
          <div className="test-section">
            <div className="test-section__header" onClick={() => toggleSection('optimizations')}>
              <div className="test-section__header-left">
                <Zap className="test-section__icon" />
                <h3>Optimization Suggestions</h3>
                <span className="test-section__badge test-section__badge--info">
                  {optimizationSuggestions.design.length} Suggestions
                </span>
              </div>
              {expandedSections.optimizations ? <ChevronDown /> : <ChevronRight />}
            </div>
            {expandedSections.optimizations && (
              <div className="test-section__content">
                <div className="test-section__subsection">
                  <h4>Design Improvements:</h4>
                  {optimizationSuggestions.design.map((suggestion, index) => (
                    <div key={index} className="test-section__list-item test-section__list-item--info">
                      <TrendingUp size={16} />
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;