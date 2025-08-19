import React, { useEffect, useState } from "react";
import owlLogo from '../assets/Big(O)wl.png';
import { ImLeaf } from "react-icons/im";

const GroqKeySettings = ({ onKeySet }) => {
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["groq_api_key"], (data) => {
      if (data.groq_api_key) {
        setKey(data.groq_api_key);
        setMsg("Custom key loaded.");
        setMsgType("success");
      }
    });
  }, []);

  function isGroqKeyValid(k) {
    return /^gsk_[A-Za-z0-9]{40,}$/.test(k.trim());
  }

  const handleSave = () => {
    if (!isGroqKeyValid(key)) {
      setMsg("Please enter a valid Groq API key (starts with gsk_..)");
      setMsgType("error");
      return;
    }
    chrome.storage.local.set({ groq_api_key: key }, () => {
      setMsg("> Groq API key saved! <");
      setMsgType("success");
      if (onKeySet) onKeySet();
    });
  };

  return (
    <div
      style={{
        background: "transparent",
        minHeight: 420,
        minWidth: 320,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        marginTop: 30,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          boxShadow: "0 2px 8px #0002",
        }}
      >
        <img
          src={owlLogo}
          alt="owl logo"
          style={{ width: 150, height: 150, objectFit: "contain" }}
        />
      </div>
      <h2
        style={{
          fontFamily: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif",
          fontWeight: 700,
          fontSize: 22,
          margin: "0 0 18px 0",
          letterSpacing: 1,
        }}
      >
        SET YOUR GROQ KEY
      </h2>
      <input
        type="text"
        placeholder="Enter your groq api key"
        value={key}
        onChange={e => setKey(e.target.value)}
        style={{
          width: "100%",
          maxWidth: 360,
          padding: "12px 16px",
          borderRadius: 12,
          border: "2px solid #bbb",
          fontSize: 16,
          marginBottom: 16,
          outline: "none",
          background: "transparent",
          boxSizing: "border-box",
          color: "whitesmoke",
          fontFamily: "inherit",
        }}
      />
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          maxWidth: 360,
          padding: "12px 16px",
          borderRadius: 12,
          border: "none",
          background: "#333",
          color: "#fff",
          fontWeight: 600,
          fontSize: 16,
          marginBottom: 16,
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 1px 4px #0001",
        }}
      >
        Save Key
      </button>
      <p style={{
          background: "none",
          border: "none",
          color: "#8b99ff",
          fontSize: 16,
          textDecoration: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          marginBottom: 8,
        }}>Get your FREE API key from the <a style={{ color: "whitesmoke", textDecoration:"none" }} href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer">Groq platform</a>
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
        
      <div
        style={{
          marginTop: 10,
          fontSize: 15,
          color:
            msgType === "success"
              ? "#27ae60"
              : msgType === "error"
              ? "#e53e3e"
              : "#222",
          minHeight: 24,
        }}
      >
        {msg}
      </div>
    </div>
  );
};

export default GroqKeySettings;