import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [isOpen, setIsOpen] = useState(false); // Toggle chatbot visibility
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [showPopup, setShowPopup] = useState(true); // Show popup message
  const [popupVisible, setPopupVisible] = useState(true); // Control popup visibility with animation

  // Handle message send
  const handleSend = () => {
    if (input.trim() === "") return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "I'm here to help!", sender: "bot" },
      ]);
    }, 1000);
  };

  // Toggle chatbot visibility and notify parent window
  const toggleChatbot = () => {
    const isOpening = !isOpen;
    setIsOpen(isOpening);

    if (isOpening) {
      window.parent.postMessage("open-chatbot", "*");
      sendIframeSize(); // Send iframe size when chatbot is opened
    } else {
      window.parent.postMessage("close-chatbot", "*");
      sendIframeSize(); // Send iframe size when chatbot is closed
    }
  };

  // Function to send iframe size to parent
  const sendIframeSize = () => {
    const iframe = document.getElementById("chatbot-iframe");
    if (iframe) {
      const iframeSize = isOpen
        ? { width: "320px", height: "450px" }
        : { width: "80px", height: "80px" };
      window.parent.postMessage({ iframeSize }, "*");
    }
  };

  // Hide popup after 15 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setPopupVisible(false); // Hide popup after 15 seconds
      }, 15000);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [showPopup]);

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <>
          {popupVisible && (
            <div className="chat-popup fade-in">Chat with Me</div>
          )}
          <button
            className="chatbot-icon"
            onClick={toggleChatbot}
            title="Chat with us"
          >
            💬
          </button>
        </>
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chat-header">
            <span>Chatbot</span>
            <button className="close-btn" onClick={toggleChatbot} title="Close">
              ✖
            </button>
          </div>
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
