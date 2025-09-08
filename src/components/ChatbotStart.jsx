import React from 'react';

const ChatbotStart = ({ onStart }) => {
  return (
    <div className="chatbot-start-container">
      <div className="start-page">
        <h2>Welcome to the Chatbot</h2>
        <p>How can I assist you today?</p>
        <button onClick={onStart}>Start Chat</button>
      </div>
    </div>
  );
};

export default ChatbotStart;
