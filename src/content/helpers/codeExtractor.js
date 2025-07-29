export const extractSubmissionCode = () => {
    console.log('🦉 Extracting code from submission page...');
    const codeBlocks = document.querySelectorAll('pre code');
    for (const codeBlock of codeBlocks) {
      if (codeBlock.textContent.trim().length > 50) {
        const extractedCode = codeBlock.textContent.trim();
        console.log('🦉 Found code block:', extractedCode.substring(0, 100) + '...');
        return extractedCode;
      }
    }

    const preElements = document.querySelectorAll('pre');
    for (const pre of preElements) {
      const text = pre.textContent.trim();
      if (text.length > 50 && (
        text.includes('class') || 
        text.includes('def') || 
        text.includes('function') ||
        text.includes('public') ||
        text.includes('private') ||
        text.includes('int') ||
        text.includes('return')
      )) {
        console.log('🦉 Found pre element with code:', text.substring(0, 100) + '...');
        return text;
      }
    }
    console.log('🦉 No code found in submission page');
    return null;
  };