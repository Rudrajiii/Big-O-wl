import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/popup.scss';
import __star__ from '../assets/stars.svg';
import __tick__ from '../assets/tick.svg';
import __loading__ from '../assets/3dx-rotate.gif';
import { FaTrashRestoreAlt } from "react-icons/fa";
import ComplexityVisualizer from '../components/ComplexityVisualizer.jsx'; 
import LoadingScreen from '../components/LoadingScreen.jsx';
import PayMePage from '../components/PayMePage.jsx';
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { sysPrompt } from '../utils/SYSTEM_PROMPT.jsx';
import { SYSTEM_PROMPT_FOR_MEM_ANALYSIS } from '../utils/SYSTEM_PROMPT_FOR_MEM_ANALYSIS.jsx';
import { complexityMap } from '../utils/COMPLEXITY_MAP.jsx';
import { LuHeartHandshake } from "react-icons/lu";
import { IoArrowBack } from "react-icons/io5";
import Toast from '../components/Toast.jsx';
import { ImLeaf } from "react-icons/im";
import { BiSolidMemoryCard } from "react-icons/bi";
import DynamicTest from '../components/CodeAnalyzer.jsx'
import { FaCodeMerge } from "react-icons/fa6";
import { groqResponse } from '../content/helpers/groqResponse.js';


/* ---------- groq client ---------- */
// const groq = new Groq({
//   apiKey: import.meta.env.VITE_GROQ_API_KEY,
//   dangerouslyAllowBrowser: true
// });

export default function App() {
  const [selectedCode, setSelectedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [result, setResult] = useState('');
  const [showPlot, setShowPlot] = useState(false);
  const [showCodeSection, setShowCodeSection] = useState(true);
  const [emoji, setEmoji] = useState(true);
  const [showExplicitArrowOfComplexity, setShowExplicitArrowOfComplexity] = useState(false);
  const [showLineComplexity, setShowLineComplexity] = useState(true);
  const [isComplexityDetermined, setIsComplexityDetermined] = useState(true);
  const [currentPage, setCurrentPage] = useState('main'); 
  // const [state, setState] = useState({ show: true });

  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'warning'
  });

  // Function to show toast
  const showToast = (message, type = 'warning') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  // Function to hide toast
  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const getComplexityHighlight = (result , showLineComplexity) => {
    if (!result || result.includes("Cannot determine")) return 'linear'; 
    console.log('result:', result);
    // Extract time complexity line
    const lines = result.split('\n');
    const timeLine = lines.find(line => line.includes('Time Complexity'));
    const spaceLine = lines.find(line => line.includes('Space Complexity'));
    if (!timeLine) return 'linear';
    if (!spaceLine) return 'linear';
    const timeComplexityValue = timeLine.split('=')[1]?.trim();
    const spaceComplexityValue = spaceLine.split('=')[1]?.trim();
    if (!timeComplexityValue) return 'linear';
    if (!spaceComplexityValue) return 'linear';
    
    return showLineComplexity ? timeComplexityValue : spaceComplexityValue;
  };
  
  // Function to load selected code from storage
  const loadSelectedCode = () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['selectedCode'], (result) => {
          if (chrome.runtime.lastError) {
            console.error('Chrome storage error:', chrome.runtime.lastError);
            return;
          }
          if (result.selectedCode) {
            setSelectedCode(result.selectedCode);
          }
        });
      }
    } catch (error) {
      console.error('Error loading selected code:', error);
    }
  };

  // Function to clear selected code
  const clearSelectedCode = () => {
    setSelectedCode('');
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.remove(['selectedCode']);
      }
    } catch (error) {
      console.error('Error clearing selected code:', error);
    }
  };

  // Function to analyze code (placeholder for future implementation)
  const analyzeCode = async () => {
    if (!selectedCode) return;
    
    setIsLoading(true);
    setResult('');

    try {
      const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
      const content = await groqResponse(groqApiKey, 128, sysPrompt, selectedCode);
      
      console.log(">> worked fine");
            
      setResult(content);
    } catch (err) {
      console.error('Groq error', err);
      setResult('⚠️ Error contacting Groq API.');
    } finally {
      setIsLoading(false);
    }
  };


  // Add this new function to load memory analysis from storage
const loadMemoryAnalysis = () => {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['memoryAnalysis', 'analysisTimestamp', 'analyzedCode'], (result) => {
        if (chrome.runtime.lastError) {
          console.error('Chrome storage error:', chrome.runtime.lastError);
          return;
        }
        
        if (result.memoryAnalysis && result.analyzedCode === selectedCode) {
          // Store the parsed JSON as string for display
          // setShowMemoryAnalysis(JSON.stringify(result.memoryAnalysis));
          console.log('Loaded memory analysis from storage:', result.memoryAnalysis);
        }
      });
    }
  } catch (error) {
    console.error('Error loading memory analysis:', error);
  }
};

  const analyzeMemory = async () => {
  if (!selectedCode) {
    showToast(
      'Cannot show MEMORY stats when complexity is not determined.',
      'warning'
    );
    return;
  };

  // First check if we have cached memory analysis for this code
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['memoryAnalysis', 'analyzedCode'], (result) => {
        if (result.memoryAnalysis && result.analyzedCode === selectedCode) {
          // Use cached data
          // setShowMemoryAnalysis(JSON.stringify(result.memoryAnalysis));
          showToast('Loaded cached memory analysis!', 'info');
          navigateToPage('memory');
          return;
        } else {
          // Generate new analysis
          performMemoryAnalysis();
        }
      });
    } else {
      performMemoryAnalysis();
    }
  } catch (error) {
    console.error('Error checking cached memory analysis:', error);
    performMemoryAnalysis();
  }
};

const performMemoryAnalysis = async () => {
  // setShowMemoryAnalysis('');
  if(!isComplexityDetermined){
    showToast(
      'Cannot show MEMORY stats when complexity is not determined.',
      'warning'
    );
    return;
  }
  showToast('Analyzing memory usage...', 'info');
  
  try {

    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
    const answer = await groqResponse(groqApiKey, 4096, SYSTEM_PROMPT_FOR_MEM_ANALYSIS, selectedCode);
      
    console.log(">> worked fine for analyzing code too");

    
    
    // More aggressive JSON extraction
    let safeJson = answer;
    
    // Remove code blocks if present
    safeJson = safeJson.replace(/^```(?:json|javascript|js)?\s*/gm, '').replace(/```\s*$/gm, '');
    
    // Find JSON content between braces
    const jsonMatch = safeJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      safeJson = jsonMatch[0];
    }
    
    // Clean up any remaining non-JSON content
    safeJson = safeJson.trim();
    
    console.log('Original response:', answer);
    console.log('Cleaned JSON:', safeJson);
    
    let parseToJson;
    try {
      parseToJson = JSON.parse(safeJson);
      console.log('Parsed JSON:', parseToJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse:', safeJson);
      
      // Fallback: try to extract JSON more aggressively
      const lines = safeJson.split('\n');
      const jsonLines = [];
      let inJson = false;
      let braceCount = 0;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('{')) {
          inJson = true;
          braceCount = 0;
        }
        
        if (inJson) {
          jsonLines.push(line);
          for (const char of line) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
          }
          
          if (braceCount === 0 && trimmedLine.endsWith('}')) {
            break;
          }
        }
      }
      
      if (jsonLines.length > 0) {
        const fallbackJson = jsonLines.join('\n');
        console.log('Fallback JSON attempt:', fallbackJson);
        parseToJson = JSON.parse(fallbackJson);
      } else {
        throw new Error('Could not extract valid JSON from response');
      }
    }
    
    // setShowMemoryAnalysis(answer);
    
    // Store memory analysis in local storage (override previous)
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ 
          memoryAnalysis: parseToJson,
          analysisTimestamp: Date.now(),
          analyzedCode: selectedCode
        });
      }
    } catch (storageError) {
      console.error('Error storing memory analysis:', storageError);
    }
    
    console.log('Memory Analysis:', answer);
    showToast('Memory analysis completed successfully!', 'success');
    
    // Navigate to memory page after successful analysis
    navigateToPage('memory');
    
  } catch (err) {
    console.error('Groq error', err);
    
    // More specific error handling
    let errorMsg = '⚠️ Error analyzing memory usage.';
    if (err.message && err.message.includes('JSON')) {
      errorMsg = '⚠️ Error: Received invalid response format. Please try again.';
    } else if (err.message && err.message.includes('network')) {
      errorMsg = '⚠️ Network error. Please check your connection and try again.';
    }
    
    // setShowMemoryAnalysis(errorMsg);
    showToast('Failed to analyze memory usage. Please try again.', 'error');
  }
};

  // Load code when component mounts
  useEffect(() => {
    // Show loading screen for 2 seconds on initial load
    const loadingTimer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    loadSelectedCode();
    
    // Listen for storage changes (when new code is selected)
    const handleStorageChange = (changes) => {
      if (changes.selectedCode) {
        const newCode = changes.selectedCode.newValue || '';
      setSelectedCode(newCode);
      
      // Clear memory analysis when code changes
      if (newCode !== selectedCode) {
        // setShowMemoryAnalysis('');
      }
      }
      // Listen for memory analysis updates
    if (changes.memoryAnalysis) {
      // setShowMemoryAnalysis(changes.memoryAnalysis.newValue || '');
    }
    };

    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener(handleStorageChange);
        
        // Cleanup listener on unmount
        return () => {
          clearTimeout(loadingTimer);
          if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
            chrome.storage.onChanged.removeListener(handleStorageChange);
          }
        };
      }
    } catch (error) {
      console.error('Error setting up storage listener:', error);
    }

    // Cleanup timer if component unmounts
    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  useEffect(() => {
  if (selectedCode) {
    loadMemoryAnalysis();
  }
}, [selectedCode]);

  function removeResultSection() {
    setResult('');
    setShowPlot(false); // Hide plot when result is removed
    
  }

  function togglePlot(isComplexityDetermined) {
  if(!isComplexityDetermined){
    showToast('Cannot toggle plot visibility when complexity is not determined.',
      'warning'
    );
    return;
  }
  
  const newShowPlot = !showPlot;
  setShowPlot(newShowPlot); // Toggle plot visibility
  setEmoji(!emoji); // Toggle emoji visibility  
  setShowExplicitArrowOfComplexity(!showExplicitArrowOfComplexity); // Toggle explicit arrow visibility
  
  // When plot is shown, hide code section. When plot is hidden, show code section
  setShowCodeSection(!newShowPlot);
}

  function showIndividualComplexity(label , value){
    if( !label || !value) return;
    if (label.includes('Time Complexity')) {
      setShowLineComplexity(true); // Show time complexity line
    }else{
      setShowLineComplexity(false); // Hide time complexity line
    }
    console.log('showing individual complexity for:', label , value);
  }
  function toggleComplexityName(showLineComplexity) {
    return showLineComplexity ? "Time Complexity ~ " : "Space Complexity ~ ";
  }

  // Function to handle pay-me page navigation
  function handlePayMeClick() {
    setCurrentPage(currentPage === 'main' ? 'payMe' : 'main');
  }

  useEffect(() => {
  if (result.includes("Cannot determine")) {
    setIsComplexityDetermined(false);
  } else if (result.trim()) {
    setIsComplexityDetermined(true);
  }
}, [result]);

  function navigateToPage(page) {
  setCurrentPage(page);
}

  return (
    <>
      {isInitialLoading && <LoadingScreen />}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={4000}
      />
      <div className="popup-container" style={{ display: isInitialLoading ? 'none' : 'flex' }}>
        <div className="header">
          
            <h1 id="gamify-font">Big<span className="animated-o">(O)</span>wl</h1>
          {currentPage === 'main' ? (
            <button className="pay-me-if-u-r-kind" onClick={handlePayMeClick}>
              <LuHeartHandshake size={28} style={{verticalAlign:'middle', color:'#DA3E44', padding:'4px 8px'}}/>
            </button>
            
          ) : (
            <button className="pay-me-if-u-r-kind back-btn" onClick={handlePayMeClick}>
              <IoArrowBack size={28} style={{verticalAlign:'middle', color:'#4ecdc4', padding:'4px 8px'}}/>
            </button>
          )}
        </div>
        

      {currentPage === 'main' && (
        <section className="codes">
          {selectedCode ? (
            <div className="code-display">
              {/* === RESULT SECTION === */}
              {result && (
              <div className="complexity-result">
                <div className="--horizontal--">
                    <h4 style={{display:'flex',flexDirection:'row',gap:'8px'}}>
                    <p style={{margin:0,color:'#51e886',background:'#15281D',padding:'6px 9px',borderRadius:'10px',fontSize:'12px',fontWeight:'400'}}>
                      <img src={__tick__} alt="" style={{verticalAlign:'middle' , marginRight:'4px'}} className='tick' />
                      Analysis Result
                    </p>
                    <p onClick={() => togglePlot(isComplexityDetermined)} className="algoPlot" style={{margin:0, cursor:'pointer', color:'#FFA116',background:'#342a19ff',padding:'6px 9px',borderRadius:'10px',fontSize:'12px',fontWeight:'400'}}>
                      {showPlot ? 'Hide Plot' : 'Plot the complexity'}
                    </p>
                    <p onClick={analyzeMemory} style={{margin:0, cursor:'pointer', color:'#FFA116',background:'#342a19ff',padding:'6px 9px',borderRadius:'10px',fontSize:'12px',fontWeight:'400'}}>
                      Deep Analysis <BiSolidMemoryCard size={16} style={{verticalAlign:'middle',marginBottom:'1px',marginLeft:'3px'}} />
                    </p>
                    </h4>
                    <button onClick={removeResultSection} id='cancel'>
                      {
                        emoji ? '⚔️' : <span onClick={() => togglePlot(isComplexityDetermined)}>
                          👈🏻
                        </span>
                      }
                    </button>
                </div>
                <div className="result-content">
                  {!isComplexityDetermined  ? (
                    <div className="not-algorithmic">
                      <span className="icon">⚠️</span>
                      <span>Cannot determine algorithmic complexity for this snippet.</span>
                    </div>
                  ) : (
                    <div className="complexity-values">
                      {result.split('\n').map((line, index) => {
                        if (line.trim()) {
                          const [label, value] = line.split(' = ');
                          return (
                            <div key={index} className="complexity-item">
                              {
                                !showExplicitArrowOfComplexity ? <>
                                  <span className="label">{label}</span>
                                  <span className="value">{value}</span>
                                </> : <>
                                  <span className="label">{label} <BsArrowUpRightCircleFill onClick={() => showIndividualComplexity(label , value)} size={16} style={{verticalAlign:'middle', marginLeft:'4px', color:'#51e886' , cursor:'pointer'}}/></span>
                                  <span className="value">{value}</span>
                                </>
                              }
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* === PLOT SECTION (appears under result when toggled) === */}
            {showPlot && result && (
              <section className='Plot-Algo-Section'>
                {/* <Ploty highlight={getComplexityHighlight(result , showLineComplexity)} typeOfComplexity={toggleComplexityName(showLineComplexity)}/> */}
                <ComplexityVisualizer 
                      complexity={getComplexityHighlight(result, showLineComplexity)}
                      typeOfComplexity={toggleComplexityName(showLineComplexity)}
                      highlight={complexityMap[getComplexityHighlight(result, showLineComplexity)] || 'linear'}
                />
              </section>
            )}

            <div className="code-header" style={{ display: showCodeSection ? 'flex' : 'none' }}>
              <h3>
                <img src={__tick__} alt="" className='tick' />
                Selected Code
              </h3>
              <div className="code-actions">
                <button 
                  onClick={analyzeCode} 
                  disabled={isLoading}
                  className="analyze-btn"
                >
                  {isLoading ? (
                    <>
                      <img src={__loading__} alt="Loading" className='loading-gif' />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <img src={__star__} alt="" className='star' />
                      Analyze Complexity
                    </>
                  )}
                </button>
                <button 
                  onClick={clearSelectedCode}
                  className="clear-btn"
                >
                  Clear
                  <FaTrashRestoreAlt size={14} style={{marginLeft: '4px',marginBottom:'2px' , verticalAlign:'middle'}} />
                </button>
              </div>
            </div>
            <div className="code-content" style={{ display: showCodeSection ? 'block' : 'none' }}>
                <SyntaxHighlighter language="javascript" className='editor' style={vscDarkPlus} customStyle={{
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: '#1e1e1e'
                }}>
                    {selectedCode}
                </SyntaxHighlighter>
            </div>
            <div className="footer">
              {/* <button type="button" onClick={() => navigateToPage('test')}>
                test-feature section
              </button> */}
              <p>
                <span onClick={() => window.open('https://github.com/Rudrajiii/Big-O-wl', '_blank')} className="github">
                  Contribute
                </span>
                <span> <ImLeaf size={18} style={{verticalAlign:'middle',marginLeft:'4px',color:'#51e886' , marginBottom:'4px'}}/> </span>
                <span onClick={() => window.open('https://discord.gg/j7QP2AUr')} className="discord">
                  Join Our Discord
                </span>
              </p>
            </div>
          </div>
        ) : (
          
          <div className="no-code">
            <p className="instruction">Simply select or Highlight any code snippet
                or a code on webpage, and it will appear here automatically then it's ready to analyze the complexity & get insights.
            </p>
            <div>
              <FaCodeMerge size={80}/>
            </div>
            
            <p className="instruction">
               <span style={{color:'red'}}>if the code doesn't get copied on selection just reopen your browser & it will work fine.</span><br />
               Currently you donot have any code selected. please select & proceed with analysis.
            </p>
            <div className="footer">
              
              <p>
                <span onClick={() => window.open('https://github.com/Rudrajiii/Big-O-wl', '_blank')} className="github">
                  Contribute
                </span>
                <span> <ImLeaf size={18} style={{verticalAlign:'middle',marginLeft:'4px',color:'#51e886' , marginBottom:'4px'}}/> </span>
                <span onClick={() => window.open('https://discord.gg/j7QP2AUr')} className="discord">
                  Join Our Discord
                </span>
              </p>
            </div>
          </div>
          
        )}
        </section>
      )}

      {currentPage === 'memory' && (
        <DynamicTest/>
      )}
      
      {currentPage === 'payMe' && (
        <PayMePage />
      )}

    </div>
    </>
  );
}
