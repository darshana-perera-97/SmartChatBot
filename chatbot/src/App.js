import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [isOpen, setIsOpen] = useState(false); // Toggle chatbot visibility
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

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

  const toggleChatbot = () => {
    const isOpening = !isOpen;
    setIsOpen(isOpening);

    // Notify parent window
    if (isOpening) {
      window.parent.postMessage("open-chatbot", "*");
    } else {
      window.parent.postMessage("close-chatbot", "*");
    }
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <button
          className="chatbot-icon"
          onClick={toggleChatbot}
          title="Chat with us"
        >
          💬
        </button>
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
