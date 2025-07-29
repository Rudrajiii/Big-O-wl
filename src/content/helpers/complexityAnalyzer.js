const sysPrompt = `
        You are an expert algorithm complexity analyzer. Your ONLY job is to analyze algorithmic code snippets.
        STRICT RULES:
        1. ONLY analyze code that contains actual algorithms, data structures, or computational logic
        2. DO NOT analyze: plain text, problem descriptions, configuration files, server setup code, HTML/CSS, or non-algorithmic code
        3. If the input is NOT an algorithm implementation, respond EXACTLY with: "Cannot determine algorithmic complexity for this snippet."
        4. If it IS algorithmic code, respond with ONLY these two lines (no explanations, no additional text):
           Time Complexity = O(your_answer)
           Space Complexity = O(your_answer)
        WHAT COUNTS AS ALGORITHMIC CODE:
        - Sorting algorithms (bubble sort, merge sort, etc.)
        - Search algorithms (binary search, linear search, etc.)
        - Data structure operations (tree traversal, graph algorithms, etc.)
        - Dynamic programming solutions
        - Mathematical algorithms
        - Array/string manipulation with loops and conditions
        WHAT DOES NOT COUNT:
        - Problem descriptions or statements
        - Server configuration (Flask, Express, etc.)
        - Database queries
        - HTML/CSS/markup
        - Import statements only
        - Variable declarations only
        - Plain text explanations
        - API endpoints without algorithmic logic
        Be extremely strict. When in doubt, return "Cannot determine algorithmic complexity for this snippet."
  `;

// Analyze code complexity using Groq API
export const analyzeComplexity = async (code) => {
    try {
      console.log('🦉 Analyzing complexity with Groq...');
      const groqApiKey = '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';
      if (!groqApiKey) {
        throw new Error('Groq API key not found');
      }
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          temperature: 0,
          max_completion_tokens: 128,
          messages: [
            { role: 'system', content: sysPrompt.trim() },
            { role: 'user', content: code }
          ]
        })
      });

      if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      console.log('🦉 Groq response:', content);
      return content;
    } catch (error) {
      console.error('🦉 Error analyzing complexity:', error);
      return 'Cannot determine complexity: ' + error.message;
    }
  };

// Extract complexity values
export const getComplexityHighlight = (result, showTime = true) => {
    if (!result || result.includes("Cannot determine")) return 'O(n)';
    const lines = result.split('\n');
    const timeLine = lines.find(line => line.includes('Time Complexity'));
    const spaceLine = lines.find(line => line.includes('Space Complexity'));
    if (!timeLine || !spaceLine) return 'O(n)';
    const timeComplexity = timeLine.split('=')[1]?.trim();
    const spaceComplexity = spaceLine.split('=')[1]?.trim();
    return showTime ? timeComplexity : spaceComplexity;
  };