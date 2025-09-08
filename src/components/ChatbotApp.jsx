import React, { useState } from 'react';

const ChatbotApp = () => {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const selectChat = (id) => {
    console.log('🖱 Selecting chat:', id);
    setSelectedChatId(id);
  };

  const deleteChat = (id) => {
    console.log('🗑 Deleting chat:', id);
    setChats(prev => prev.filter(chat => chat.id !== id));
    if (selectedChatId === id) setSelectedChatId(null);
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `New Chat`,
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
      lastMessage: '',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    console.log('➕ Creating new chat:', newChat);
    setChats(prev => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat) return;

    console.log('✉️ Sending message:', input);

    const userMessage = { role: 'user', content: input };
    setChats(prev => prev.map(chat =>
      chat.id === selectedChatId
        ? { ...chat, messages: [...chat.messages, userMessage], lastMessage: input }
        : chat
    ));
    setInput('');
    setLoading(true);

    try {
      console.log('🌐 Sending request to backend...');
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...selectedChat.messages, userMessage] }),
      });

      console.log('🔄 Waiting for response...');
      const data = await res.json();

      console.log('✅ Response received:', data);

      const botMessage = { role: 'assistant', content: data.reply };
      setChats(prev => prev.map(chat =>
        chat.id === selectedChatId
          ? { ...chat, messages: [...chat.messages, botMessage], lastMessage: data.reply }
          : chat
      ));
    } catch (err) {
      console.error('❌ Failed to fetch:', err);
      setChats(prev => prev.map(chat =>
        chat.id === selectedChatId
          ? { ...chat, messages: [...chat.messages, { role: 'assistant', content: 'Oops, something went wrong.' }] }
          : chat
      ));
    } finally {
      setLoading(false);
    }
  };{chats.map(chat => (
  <div
    key={chat.id}
    className={`chat-list-item ${chat.id === selectedChatId ? 'active' : ''}`}
  >
    <div className="chat-info" onClick={() => selectChat(chat.id)}>
      <h4>{chat.title}</h4>
      <span className="chat-meta">{chat.time} | {chat.date}</span>
      <p>{chat.lastMessage}</p>
    </div>
    <button
      className="delete-btn"
      onClick={() => deleteChat(chat.id)}
      title="Delete chat"
    >
      ✕
    </button>
  </div>
))}

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-app-container">
      {/* Sidebar */}
      <div className="chat-list">
        <h3>Your Chats</h3>
        <button onClick={createNewChat}>+ New Chat</button>
        {chats.length === 0 && <p>No chats yet. Start a new chat!</p>}
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-list-item ${chat.id === selectedChatId ? 'active' : ''}`}
          >
            <div className="chat-info" onClick={() => selectChat(chat.id)}>
              <h4>{chat.title}</h4>
              <span className="chat-meta">{chat.time} | {chat.date}</span>
              <p>{chat.lastMessage}</p>
            </div>
            <button
              className="delete-btn"
              onClick={() => deleteChat(chat.id)}
              title="Delete chat"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {selectedChat ? (
          <>
            <div className="chat-header">{selectedChat.title}</div>
            <div className="chat-messages">
              {selectedChat.messages
                .filter(msg => msg.role !== 'system')
                .map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    {msg.content}
                  </div>
                ))}
              {loading && <div className="message bot">Typing...</div>}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={sendMessage} disabled={loading}>Send</button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">Select a chat or start a new chat</div>
        )}
      </div>
    </div>
  );
};

export default ChatbotApp;