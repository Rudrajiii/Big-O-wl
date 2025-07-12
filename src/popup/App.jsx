import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/popup.scss';
import __star__ from '../assets/stars.svg';
import __tick__ from '../assets/tick.svg';
import __loading__ from '../assets/3dx-rotate.gif';
import { FaTrashRestoreAlt } from "react-icons/fa";
import Groq from 'groq-sdk';
import Ploty from '../components/Ploty.jsx'; 
import LoadingScreen from '../components/LoadingScreen.jsx';
import PayMePage from '../components/PayMePage.jsx';
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { sysPrompt } from '../utils/SYSTEM_PROMPT.jsx';
import { complexityMap } from '../utils/COMPLEXITY_MAP.jsx';
import { LuHeartHandshake } from "react-icons/lu";
import { IoArrowBack } from "react-icons/io5";




/* ---------- groq client ---------- */
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

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
  const [currentPage, setCurrentPage] = useState('main'); // Add page state

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
    
    return showLineComplexity ? complexityMap[timeComplexityValue] || 'linear' : complexityMap[spaceComplexityValue] || 'linear';
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
    setResult(''); // Reset previous result
    
    try {
      const chat = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0,
        max_completion_tokens: 128,
        messages: [
          { role: 'system',    content: sysPrompt.trim() },
          { role: 'user',      content: selectedCode }
        ]
      });

      const answer = chat.choices[0]?.message?.content?.trim() || '';
      setResult(answer);
    } catch (err) {
      console.error('Groq error', err);
      setResult('⚠️ Error contacting Groq API.');
    } finally {
      setIsLoading(false);
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
        setSelectedCode(changes.selectedCode.newValue || '');
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

  function removeResultSection() {
    setResult('');
    setShowPlot(false); // Hide plot when result is removed
    
  }

  
  function togglePlot() {
    setShowPlot(!showPlot); // Toggle plot visibility
    setEmoji(!emoji); // Toggle emoji visibility  
    setShowExplicitArrowOfComplexity(!showExplicitArrowOfComplexity); // Toggle explicit arrow visibility
    if (showCodeSection) {
      console.log('hiding code section');
      document.querySelector('.code-header').style.display = 'none';
      document.querySelector('.code-content').style.display = 'none';
      setShowCodeSection(false); 
      
    }else {
      console.log('showing code section');
      document.querySelector('.code-header').style.display = 'flex';
      document.querySelector('.code-content').style.display = 'block';
      setShowCodeSection(true); 
    }
    // Hide header and code when plot is shown
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

  return (
    <>
      {isInitialLoading && <LoadingScreen />}
      <div className="popup-container" style={{ display: isInitialLoading ? 'none' : 'flex' }}>
        <div className="header">
          <h1>Big<span className="animated-o">(O)</span>wl</h1>
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
      
      {currentPage === 'main' ? (
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
                    <p onClick={togglePlot} className="algoPlot" style={{margin:0, cursor:'pointer', color:'#FFA116',background:'#342a19ff',padding:'6px 9px',borderRadius:'10px',fontSize:'12px',fontWeight:'400'}}>
                      {showPlot ? 'Hide Plot' : 'Plot'}
                    </p>
                    </h4>
                    <button onClick={removeResultSection} id='cancel'>
                      {
                        emoji ? '⚔️' : <span onClick={() => togglePlot()}>
                           👈🏻
                        </span>
                      }
                    </button>
                </div>
                <div className="result-content">
                  {result.includes("Cannot determine") ? (
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
                <Ploty highlight={getComplexityHighlight(result , showLineComplexity)} typeOfComplexity={toggleComplexityName(showLineComplexity)}/>
              </section>
            )}

            <div className="code-header">
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
            <div className="code-content">
                <SyntaxHighlighter language="javascript" className='editor' style={vscDarkPlus} customStyle={{
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: '#1e1e1e'
                }}>
                    {selectedCode}
                </SyntaxHighlighter>
            </div>
          </div>
        ) : (
          <div className="no-code">
            <p>📝 Highlight code on any page to analyze time/space complexity.</p>
            <p className="instruction">
              Simply select any code snippet on a webpage, and it will appear here automatically!
            </p>
          </div>
        )}
        </section>
      ) : (
        <PayMePage />
      )}
    </div>
    </>
  );
}
