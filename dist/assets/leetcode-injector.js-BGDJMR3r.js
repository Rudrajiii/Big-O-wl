(function(){const D=()=>{if(document.querySelector('link[href*="leetcode-overlay.css"]')){console.log("🦉 Styles already loaded");return}const i=document.createElement("link");i.rel="stylesheet",i.type="text/css",i.href=chrome.runtime.getURL("src/content/leetcode-overlay.css"),document.head.appendChild(i),console.log("🦉 Styles loaded:",i.href)},P=()=>{console.log("🦉 Extracting code from submission page...");const i=document.querySelectorAll("pre code");for(const s of i)if(s.textContent.trim().length>50){const r=s.textContent.trim();return console.log("🦉 Found code block:",r.substring(0,100)+"..."),r}const c=document.querySelectorAll("pre");for(const s of c){const r=s.textContent.trim();if(r.length>50&&(r.includes("class")||r.includes("def")||r.includes("function")||r.includes("public")||r.includes("private")||r.includes("int")||r.includes("return")))return console.log("🦉 Found pre element with code:",r.substring(0,100)+"..."),r}return console.log("🦉 No code found in submission page"),null},B=(i,c)=>{let s=!1,r=0,d=0,p=0,f=0;const u=e=>{if(!c.contains(e.target)||e.target.classList.contains("bigowl-control-btn"))return;s=!0,c.style.cursor="grabbing";const x=i.getBoundingClientRect();r=e.clientX,d=e.clientY,p=r-x.left,f=d-x.top,e.preventDefault(),e.stopPropagation()},a=e=>{if(!s)return;e.preventDefault(),e.stopPropagation();const x=e.clientX-p,y=e.clientY-f,b=i.offsetWidth,v=i.offsetHeight,w=window.innerWidth,h=window.innerHeight,g=Math.max(0,Math.min(x,w-b)),m=Math.max(0,Math.min(y,h-v));i.style.left=`${g}px`,i.style.top=`${m}px`,i.style.transform="none"},t=e=>{s&&(s=!1,c.style.cursor="move",e.preventDefault(),e.stopPropagation())};c.addEventListener("mousedown",u,{passive:!1}),document.addEventListener("mousemove",a,{passive:!1}),document.addEventListener("mouseup",t,{passive:!1}),c.addEventListener("touchstart",e=>{const x=e.touches[0];u({...e,clientX:x.clientX,clientY:x.clientY,target:e.target,preventDefault:()=>e.preventDefault(),stopPropagation:()=>e.stopPropagation()})},{passive:!1}),document.addEventListener("touchmove",e=>{if(!s)return;const x=e.touches[0];a({...e,clientX:x.clientX,clientY:x.clientY,preventDefault:()=>e.preventDefault(),stopPropagation:()=>e.stopPropagation()})},{passive:!1}),document.addEventListener("touchend",t,{passive:!1});const n=window.innerWidth,o=520,l=20;i.style.position="fixed",i.style.left=`${n-o-l}px`,i.style.top="20px",i.style.transform="none"},$=`
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
  `,N=async i=>{try{console.log("🦉 Analyzing complexity with Groq...");const c=await new Promise(p=>{chrome.storage.local.get(["groq_api_key"],f=>{p(f.groq_api_key)})});if(!c)throw new Error("Groq API key not found");const s=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${c}`,"Content-Type":"application/json"},body:JSON.stringify({model:"meta-llama/llama-4-scout-17b-16e-instruct",temperature:0,max_completion_tokens:128,messages:[{role:"system",content:$.trim()},{role:"user",content:i}]})});if(!s.ok)throw new Error(`Groq API error: ${s.status}`);const d=(await s.json()).choices[0].message.content.trim();return console.log("🦉 Groq response:",d),d}catch(c){return console.error("🦉 Error analyzing complexity:",c),"Cannot determine complexity: "+c.message}},z=(i,c=!0)=>{var u,a;if(!i||i.includes("Cannot determine"))return"";const s=i.split(`
`),r=s.find(t=>t.includes("Time Complexity")),d=s.find(t=>t.includes("Space Complexity"));if(!r||!d)return"";const p=(u=r.split("=")[1])==null?void 0:u.trim(),f=(a=d.split("=")[1])==null?void 0:a.trim();return c?p:f},j=(i="linear",c="Time Complexity",s="O(n)")=>{const r=document.createElement("div");r.style.cssText=`
      width: 400px;
      height: 340px;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;const d=[{key:"const",name:"O(1)",color:"#27ae60"},{key:"log",name:"O(log n)",color:"#3498db"},{key:"sqrt",name:"O(√n)",color:"#f39c12"},{key:"linear",name:"O(n)",color:"#e74c3c"},{key:"nlogn",name:"O(n log n)",color:"#9b59b6"},{key:"quad",name:"O(n²)",color:"#e67e22"},{key:"exp",name:"O(2^n)",color:"#34495e"}],p=d.find(m=>m.key===i);if(!p)return r.innerHTML=`
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          gap: 15px;
          margin: 0 15px;
        ">
          <div style="
            font-size: 22px; 
            font-weight: 300;
            color: #fff;
            font-style: italic;
            font-family: 'Times New Roman', serif;
            margin-bottom: 10px;
          ">
           
            ${c} ~ ${s}
          </div>
          <div style="font-size: 18px; color: rgba(255, 255, 255, 0.7);">
            This complexity is not in our standard chart
          </div>
          <div style="
            
            font-weight:500
            font-size: 16px;
            color: #2CB744;
          ">
            Refer to BigOwl to get its Plot
          </div>
        </div>
      `,r;const f=document.createElement("div");f.style.cssText=`
      margin-bottom: 15px;
      text-align: center;
      font-size: 22px;
      font-weight: 400;
      font-style: italic;
      font-family: 'Times New Roman', serif;
      color: #fff;
    `,f.textContent=`${c} ~ ${p.name}`;const u=document.createElementNS("http://www.w3.org/2000/svg","svg");u.setAttribute("width","450"),u.setAttribute("height","300"),u.style.cssText=`
      border-radius: 8px;
    `;const t=((m=60)=>{const k=[];for(let C=1;C<=m;C++)k.push({n:C,const:8,log:Math.log2(C)*5,sqrt:Math.sqrt(C)*7,linear:C,nlogn:C*Math.log2(C)/8,quad:C*C/90,exp:Math.min(Math.pow(2,C/15),60)});return k})(60),n={top:20,right:20,bottom:35,left:35},o=450-n.left-n.right,l=300-n.top-n.bottom,e=m=>m/60*o,x=m=>l-m/60*l,y=document.createElementNS("http://www.w3.org/2000/svg","g");y.setAttribute("transform",`translate(${n.left}, ${n.top})`),d.forEach(({key:m,name:k,color:C})=>{const A=m===i;let T="";t.forEach((O,q)=>{const S=e(O.n),L=x(O[m]);q===0?m==="const"?T+=`M ${S} ${L}`:T+=`M ${e(1)} ${x(t[0][m])}`:T+=` L ${S} ${L}`});const E=document.createElementNS("http://www.w3.org/2000/svg","path");E.setAttribute("d",T),E.setAttribute("stroke",A?C:"#bbb"),E.setAttribute("stroke-width",A?"3":"1.5"),E.setAttribute("fill","none"),E.setAttribute("opacity",A?"1":"0.4"),A&&E.setAttribute("filter",`drop-shadow(0 0 4px ${C}66)`),y.appendChild(E)});const b=document.createElementNS("http://www.w3.org/2000/svg","line");b.setAttribute("x1",0),b.setAttribute("y1",l),b.setAttribute("x2",o),b.setAttribute("y2",l),b.setAttribute("stroke","rgba(255, 255, 255, 0.4)"),b.setAttribute("stroke-width","2"),y.appendChild(b);const v=document.createElementNS("http://www.w3.org/2000/svg","line");v.setAttribute("x1",0),v.setAttribute("y1",0),v.setAttribute("x2",0),v.setAttribute("y2",l),v.setAttribute("stroke","rgba(255, 255, 255, 0.4)"),v.setAttribute("stroke-width","2"),y.appendChild(v);const w=document.createElementNS("http://www.w3.org/2000/svg","text");w.setAttribute("x",o/2),w.setAttribute("y",l+25),w.setAttribute("text-anchor","middle"),w.setAttribute("fill","rgba(255, 255, 255, 0.6)"),w.setAttribute("font-size","12"),y.appendChild(w);const h=document.createElementNS("http://www.w3.org/2000/svg","text");h.setAttribute("x",-l/2),h.setAttribute("y",-20),h.setAttribute("text-anchor","middle"),h.setAttribute("fill","rgba(255, 255, 255, 0.6)"),h.setAttribute("font-size","12"),h.setAttribute("transform",`rotate(-90, ${-l/2}, -20)`),h.textContent="Operations",y.appendChild(h);const g=document.createElementNS("http://www.w3.org/2000/svg","circle");return g.setAttribute("cx",0),g.setAttribute("cy",l),g.setAttribute("r",2),g.setAttribute("fill","rgba(255, 255, 255, 0.8)"),y.appendChild(g),u.appendChild(y),r.appendChild(f),r.appendChild(u),r},I=i=>({"O(1)":"const","O(log n)":"log","O(log N)":"log","O(logn)":"log","O(log(n))":"log","O(Log n)":"log","O(Log N)":"log","O(√n)":"sqrt","O(√N)":"sqrt","O(n)":"linear","O(N)":"linear","O(n log n)":"nlogn","O(N log N)":"nlogn","O(n*log n)":"nlogn","O(nlogn)":"nlogn","O(n²)":"quad","O(N²)":"quad","O(n^2)":"quad","O(N^2)":"quad","O(2^n)":"exp","O(2^N)":"exp"})[i]||null,M=(i,c)=>{const s=document.createElement("div");s.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 20px;
      
      color: #e8e8e8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
    `;const r=I(c),d=j(r,i,c);return s.appendChild(d),s},R=(i,c)=>{const s=document.createElement("div");s.style.cssText=`
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    `;const r=M("Time Complexity",i),d=M("Space Complexity",c),p=document.createElement("div");p.style.cssText=`
      display: flex;
      width: 200%;
      height: 100%;
      transition: transform 0.3s ease-in-out;
      transform: translateX(0%);
    `,r.style.cssText+=`
      width: 50%;
      flex-shrink: 0;
    `,d.style.cssText+=`
      width: 50%;
      flex-shrink: 0;
    `,p.appendChild(r),p.appendChild(d);const f=document.createElement("div");f.style.cssText=`
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 10;
    `;let u=0;const a=["Time","Space"];a.forEach((o,l)=>{const e=document.createElement("button");e.style.cssText=`
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        background: ${l===0?"rgba(255, 255, 255, 0.8)":"rgba(255, 255, 255, 0.3)"};
      `,e.addEventListener("click",()=>{u=l,f.querySelectorAll("button").forEach((x,y)=>{x.style.background=y===l?"rgba(255, 255, 255, 0.8)":"rgba(255, 255, 255, 0.3)"}),p.style.transform=`translateX(-${l*50}%)`}),f.appendChild(e)});let t=0,n=!1;return p.addEventListener("mousedown",o=>{t=o.clientX,n=!0}),p.addEventListener("mousemove",o=>{n&&o.preventDefault()}),p.addEventListener("mouseup",o=>{if(!n)return;n=!1;const l=o.clientX,e=t-l;Math.abs(e)>50&&(e>0&&u<a.length-1?u++:e<0&&u>0&&u--,f.children[u].click())}),setTimeout(()=>{u===0&&f.children[1].click()},3e3),s.appendChild(p),s.appendChild(f),s},X=async()=>{const i=P(),c=document.querySelector(".bigowl-overlay");c&&c.remove(),D();const s=document.createElement("div");s.className="bigowl-overlay",s.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000000;
    `;const r=document.createElement("div");r.className="bigowl-window",r.style.cssText=`
      pointer-events: all;
      position: fixed;
      height: 480px;
      width: 520px;
      background: transparent;
      backdrop-filter: blur(20px);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 1000001;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
    `;const d=document.createElement("div");d.className="bigowl-titlebar",d.style.cssText=`
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: transparent;
      cursor: move;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      user-select: none;
      height: 44px;
    `;const p=document.createElement("div");p.style.cssText=`
      display: flex;
      gap: 8px;
    `,["#ff5f56","#ffbd2e","#27c93f"].forEach((t,n)=>{const o=document.createElement("button");o.className=`bigowl-control-btn ${n===0?"close":""}`,o.style.cssText=`
        width: 12px; 
        height: 12px; 
        border: none; 
        border-radius: 50%;
        cursor: ${n===0?"pointer":"default"};
        padding: 0;
        background: ${t};
        transition: opacity 0.2s;
      `,n===0&&(o.addEventListener("click",l=>{l.stopPropagation(),s.classList.remove("visible"),setTimeout(()=>s.remove(),300)}),o.addEventListener("mouseenter",()=>o.style.opacity="0.8"),o.addEventListener("mouseleave",()=>o.style.opacity="1")),p.appendChild(o)}),d.appendChild(p);const u=document.createElement("div");u.className="bigowl-content",u.style.cssText=`
      flex: 1;
      overflow: hidden;
      
      padding: 0;
    `;const a=document.createElement("div");if(a.className="bigowl-code-area",a.style.cssText=`
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `,i){const t=document.createElement("div");if(t.style.cssText=`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18px;
        gap: 20px;
      `,t.innerHTML=`
        <div style="
          width: 24px; height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        Analyzing complexity...
      `,!document.querySelector("#bigowl-spin-style")){const n=document.createElement("style");n.id="bigowl-spin-style",n.textContent=`
          @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
        `,document.head.appendChild(n)}a.appendChild(t)}else{const t=document.createElement("div");t.textContent="No code found to analyze",t.style.cssText=`
        color: rgba(255, 255, 255, 0.6);
        font-size: 18px;
        text-align: center;
      `,a.appendChild(t)}if(u.appendChild(a),r.appendChild(d),r.appendChild(u),s.appendChild(r),document.body.appendChild(s),console.log("🦉 Window created, setting up draggable functionality..."),setTimeout(()=>{B(r,d),console.log("🦉 Draggable functionality initialized")},100),setTimeout(()=>{s.classList.add("visible"),r.classList.add("visible")},150),i)try{let t=await N(i);a.innerHTML="";let n=!t.includes("Cannot determine");if(!n){console.log("Primary analysis failed, trying backup code...");const o=await new Promise(l=>{typeof chrome<"u"&&chrome.storage&&chrome.storage.local?chrome.storage.local.get(["selectedCode"],e=>{l(e.selectedCode||null)}):l(null)});console.log("Backup code:",o),o&&o.trim().length>0&&(console.log("Analyzing backup code..."),t=await N(o),n=!t.includes("Cannot determine"),console.log("Backup analysis result:",n))}if(n){console.log("Analysis successful, creating visualizer...");const o=z(t,!0),l=z(t,!1),e=R(o,l);a.appendChild(e)}else console.log("Both analyses failed, showing fallback message..."),a.innerHTML=`
        <div style="
          text-align: center; 
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        ">
          <div>
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="#FFA116"/>
            </svg>
          </div>
          <div style="font-size: 25px; font-weight: 600;">Oops!! auto extraction failed</div>
          <div style="font-size: 18px; color: rgba(255, 255, 255, 0.6);">Please select your code and try again</div>
          <div style="
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            max-width: 400px;
            text-align: center;
          ">
            💡Tip: You Can Also Move To The Extension For Analysis.
          </div>
        </div>
      `}catch(t){console.error("🦉 Analysis error:",t),a.innerHTML=`
      <div style="
        text-align: center; 
        color: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      ">
        <div>
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill="#ff4444"/>
          </svg>
        </div>
        <div style="font-size: 25px; font-weight: 600;">Analysis Failed</div>
        <div style="font-size: 16px; color: rgba(255, 255, 255, 0.6);">${t.message}</div>
      </div>
    `}if(i)try{typeof chrome<"u"&&chrome.storage&&chrome.storage.local&&(chrome.storage.local.set({selectedCode:i}),console.log("stored extracted code ://"))}catch(t){console.error("erorr := ",t)}s.addEventListener("click",t=>{t.target===s&&(s.classList.remove("visible"),setTimeout(()=>s.remove(),300))}),setTimeout(()=>{s.parentNode&&(s.classList.remove("visible"),setTimeout(()=>s.remove(),300))},12e4)};(()=>{console.log("🦉 BigOwl LeetCode Injector loaded");let i=!1,c=window.location.href;const s=()=>{if(i)return;const a=document.querySelectorAll("span");let t=null;for(const o of a)if(o.textContent.trim()==="Analyze Complexity"){t=o;break}if(!t||t.parentNode.querySelector(".bigowl-text"))return;const n=document.createElement("span");n.className="bigowl-text",n.textContent="🦉 Analyze with BigOwl",n.style.cssText=`
      color: #4ecdc4; 
      font-weight: 500; 
      cursor: pointer;
      margin-left: 8px; 
      transition: all 0.2s ease;
    `,n.addEventListener("mouseenter",()=>{n.style.color="#3db8af"}),n.addEventListener("mouseleave",()=>{n.textContent.includes("Analyze with BigOwl")&&(n.style.color="#4ecdc4",n.style.textDecoration="none")}),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),console.log("🦉 BigOwl text clicked!"),n.textContent=" 🔄 Processing...",n.style.color="#02B128",setTimeout(()=>{X(),setTimeout(()=>{n.textContent="🦉 Analyze with BigOwl",n.style.color="#4ecdc4"},500)},800)}),t.parentNode.insertBefore(n,t.nextSibling),i=!0,console.log('🦉 Successfully added "Analyze with BigOwl" text')},r=()=>{const a=window.location.href;a!==c&&(console.log("🦉 URL changed:",a),c=a,i=!1,setTimeout(s,2e3))},d=()=>{console.log("🦉 Starting monitoring..."),setTimeout(s,1e3),setInterval(()=>!i&&s(),2e3),new MutationObserver(t=>{let n=!1;t.forEach(o=>{o.addedNodes.forEach(l=>{var e;l.nodeType===Node.ELEMENT_NODE&&((e=l.textContent)!=null&&e.includes("Analyze Complexity"))&&(n=!0)})}),n&&setTimeout(s,500),r()}).observe(document.body,{childList:!0,subtree:!0}),setInterval(r,1e3)};["pushState","replaceState"].forEach(a=>{const t=history[a];history[a]=function(...n){t.apply(this,n),i=!1,setTimeout(s,1500)}}),window.addEventListener("popstate",()=>{i=!1,setTimeout(s,1500)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d(),console.log("🦉 BigOwl injector script initialized with SPA support");function p(){const a=document.querySelectorAll(".flex.h-full.flex-nowrap.items-center");if(a.length===0){console.log("🎯 No elements found with classes: flex h-full flex-nowrap items-center");return}a.forEach((t,n)=>{if(console.log(`🎯 Processing element ${n+1}:`,t),t.querySelector(".bigowl-inject-span")){console.log("🎯 Text already injected in element:",t);return}const o=document.createElement("div");o.className="bigowl-restriction-container",o.style.position="relative",o.style.display="inline-block",o.style.marginLeft="8px";const l=document.createElement("span");l.className="bigowl-inject-span",l.textContent="🦉 Auto Restriction",l.style.cssText=`
          color: #667eea; 
          font-weight: 500; 
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
      `;const e=document.createElement("div");e.className="bigowl-restriction-dropdown",e.style.cssText=`
        display: none;
        position: absolute;
        background: rgba(40, 40, 40, 0.55); /* Semi-transparent */
        min-width: 200px;
        color: #BDBFC2;
        box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.4);
        z-index: 1;
        border-radius: 12px;
        padding: 8px 0;
        top: 100%;
        left: 0;
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.15);
        transition: all 0.3s ease;
    `;const x=[{name:"ChatGPT",url:"chatgpt.com"},{name:"Gemini (Bard)",url:"gemini.google.com"},{name:"Claude",url:"claude.ai"},{name:"YouTube",url:"www.youtube.com"},{name:"Perplexity",url:"www.perplexity.ai"},{name:"Phind",url:"www.phind.com"},{name:"Stack Overflow",url:"stackoverflow.com"}],y=document.createElement("div");y.textContent="Block these sites ~",y.style.padding="8px 16px",y.style.fontWeight="bold",y.style.borderBottom="1px solid #ddd",e.appendChild(y),x.forEach(h=>{const g=document.createElement("div");g.style.padding="8px 16px",g.style.display="flex",g.style.alignItems="center",g.addEventListener("mouseenter",()=>{g.style.width="100%",g.style.padding="8px 16px",g.style.cursor="pointer",g.style.background="rgba(255, 255, 255, 0.05)"}),g.addEventListener("mouseleave",()=>{g.style.background="transparent"});const m=document.createElement("input");m.type="checkbox",m.id=`block-${h.url.replace(/\./g,"-")}`,m.value=h.url,m.style.marginRight="8px";const k=document.createElement("label");k.htmlFor=m.id,k.textContent=h.name,k.style.cursor="pointer",g.appendChild(m),g.appendChild(k),e.appendChild(g)});const b=document.createElement("button");b.textContent="Enable Restriction",b.classList="confirm-btn",b.style.cssText=`
          background-color: #283A2E;
          color: #2CBB5D;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin: 8px 16px;
          width: calc(100% - 32px);
      `,e.appendChild(b),o.appendChild(l),o.appendChild(e),t.appendChild(o);let v=!1,w=[];chrome.storage.sync.get(["blockedSites"],h=>{const g=h.blockedSites||[];g.length>0&&(v=!0,l.textContent="🦉 Auto Restriction ON",l.style.color="#27ae60",l.style.backgroundColor="rgba(39, 174, 96, 0.15)"),g.forEach(m=>{const k=e.querySelector(`input[value="${m}"]`);k&&(k.checked=!0)})}),l.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),v?(l.textContent="🦉 Auto Restriction",l.style.color="#667eea",l.style.backgroundColor="transparent",v=!1,chrome.storage.sync.set({blockedSites:[]},()=>{console.log("🎯 Auto Restriction disabled. All sites unblocked.")}),e.style.display="none"):e.style.display=e.style.display==="block"?"none":"block"}),b.addEventListener("click",h=>{h.stopPropagation(),w=[],e.querySelectorAll('input[type="checkbox"]:checked').forEach(m=>{w.push(m.value)}),w.length>0?(v=!0,l.textContent="🦉 Auto Restriction ON",l.style.color="#27ae60",l.style.backgroundColor="rgba(39, 174, 96, 0.15)",e.style.display="none",chrome.storage.sync.set({blockedSites:w},()=>{console.log("🎯 Blocked sites saved:",w)})):alert("Please select at least one site to block")}),document.addEventListener("click",h=>{o.contains(h.target)||(e.style.display="none")}),console.log('🎯 Successfully injected "Auto Restriction" feature into element:',t)})}function f(){console.log("🎯 Starting Code Injection Feature attempts..."),p()}new MutationObserver(a=>{let t=!1;a.forEach(n=>{n.addedNodes.forEach(o=>{if(o.nodeType===Node.ELEMENT_NODE){o.classList&&o.classList.contains("flex")&&o.classList.contains("h-full")&&o.classList.contains("flex-nowrap")&&o.classList.contains("items-center")&&(console.log("🎯 New target element detected, running code injection..."),t=!0);const l=o.querySelectorAll&&o.querySelectorAll(".flex.h-full.flex-nowrap.items-center");l&&l.length>0&&(console.log("🎯 New child target elements detected, running code injection..."),t=!0)}})}),t&&setTimeout(p,500)}).observe(document.body,{childList:!0,subtree:!0}),f()})();
})()
