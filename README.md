<p align="center">
<!--   <img src="src/assets/Big(O)wl.png" alt="Big(O)wl Logo" width="150" /> -->
<img width="960" height="318" alt="image" src="https://github.com/user-attachments/assets/9b29b3cf-14f3-426a-85aa-b6aebe2cf909" />

</p>

<div align="center">
<!--   <h1 align="center">Big(O)wl 🦉</h1> -->
  <em>Know the Big O before your code says Uh-oh!</em><br/>
  <strong>A Chrome Extension to instantly analyze your code's Time & Space Complexity</strong>
</div>

## ⚡ What is Big(O)wl?
> [!NOTE]  
> **Big(O)wl** is a Gen-Z-coded Chrome Extension that lets you select/highlight any code on a webpage and instantly tells you the **Time Complexity** and **Space Complexity** along with the Plot for Visualization — powered by AI.  
Whether you're reviewing someone's GitHub, reading articles, or prepping for interviews in damn LEET CODE, this extension has your back.

<div align="center">
  <img width="300" height="400" alt="image" src="https://github.com/user-attachments/assets/c82d442e-0be2-4019-898d-cc3b7c18dad1" />
<img width="300" height="400" alt="image" src="https://github.com/user-attachments/assets/8be59259-bd54-4788-a30d-62045b6c82ad" />
</div>

## 🤔 Why Big(O)wl ?
> [!IMPORTANT] 
> Got this idea from Leetcode's Analyze Complexity feature which gives you the complexity analysis of your code along with the Plot, But **for the non-premium users this feature is available only for once at a day**. So In the other hand **Big(O)wl** provides it for free as much as you want with more analytical features.  

## ➕ Additional Feature
1> Look, I have added an **Auto Restriction 🦉** button to prevent cheating, whether intentional or unintentional, while coding 😭.

<img width="552" height="199" alt="image" src="https://github.com/user-attachments/assets/75a5bda4-c975-4443-8faa-760a59934576" />


2> next added a cool glassy dropdown section for selecting the sites to block while coding & sites after being blocked by BIG(O)WL 🦉

<div align="center">
<img width="300" height="400" alt="image" src="https://github.com/user-attachments/assets/38464145-fb52-48b7-8821-43ec5080cdc3" />
<img width="400" height="1000" alt="image" src="https://github.com/user-attachments/assets/071d71f4-299d-4ccf-8a69-1e929f338978" />
</div>




## 🧠 Features

- 🔍 **Highlight-to-Analyze**  
  Just select code like you’re copying it — and boom, it appears in the extension popup.

- 🚀 **One-Click Complexity Detection**  
  Uses the Groq LLM API to give instant insights into Big-O time & space complexity.

- 📈 **Visual Complexity Graphs**  
  Dynamic plots of common complexity curves with your selected one highlighted in style.

- 📦 **Minimal, Clean, Fast**  
  Built with React 18, Vite, and SCSS for a blazing fast UX.

- 🧠 **Smart Filtering**  
  Ignores non-code or unrelated code (like API/server/infra), keeping the output relevant to DSA problems only.



## 🧰 Tech Stack

| Frontend | Analysis | Graph |
|----------|----------|-------|
| React 18 | Groq LLM | Recharts |
| SCSS     | MathJax  | SVG Magic |



## 🛠️ Setup (Dev Mode)

```bash
GROQ_API_KEY = "Enter Your Groq Api Key Here"
```
```bash
git clone https://github.com/Rudrajiii/Big-O-wl.git
cd Big-O-wl
npm install
npm run dev
```


