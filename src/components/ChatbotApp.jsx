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
    const updatedChats = chats.map(chat =>
      chat.id === selectedChatId
        ? { ...chat, messages: [...chat.messages, userMessage], lastMessage: input }
        : chat
    );

    setChats(updatedChats);
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

      console.log('✅ Response received from backend:', data);

      const botMessage = { role: 'assistant', content: data.reply };
      setChats(prev =>
        prev.map(chat =>
          chat.id === selectedChatId
            ? { ...chat, messages: [...chat.messages, botMessage], lastMessage: data.reply }
            : chat
        )
      );
    } catch (err) {
      console.error('❌ Failed to fetch:', err);
      setChats(prev =>
        prev.map(chat =>
          chat.id === selectedChatId
            ? { ...chat, messages: [...chat.messages, { role: 'assistant', content: 'Oops, something went wrong.' }] }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-app-container" style={{ display: 'flex', gap: '16px' }}>
      {/* Sidebar */}
      <div className="chat-list" style={{ width: '300px', borderRight: '1px solid #ccc', padding: '8px' }}>
        <h3>Your Chats</h3>
        <button onClick={createNewChat} style={{ marginBottom: '12px' }}>+ New Chat</button>
        {chats.length === 0 && <p>No chats yet. Start a new chat!</p>}
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-list-item ${chat.id === selectedChatId ? 'active' : ''}`}
            style={{ borderBottom: '1px solid #eee', padding: '8px', cursor: 'pointer' }}
          >
            <div onClick={() => selectChat(chat.id)}>
              <h4>{chat.title}</h4>
              <span className="chat-meta">{chat.time} | {chat.date}</span>
              <p>{chat.lastMessage}</p>
            </div>
            <button onClick={() => deleteChat(chat.id)}>✕</button>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="chat-window" style={{ flex: 1, padding: '8px' }}>
        {selectedChat ? (
          <>
            <div className="chat-header"><h3>{selectedChat.title}</h3></div>
            <div className="chat-messages" style={{ minHeight: '300px', marginBottom: '12px' }}>
              {selectedChat.messages
                .filter(m => m.role !== 'system')
                .map((msg, idx) => (
                  <div key={idx} style={{ margin: '4px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    <b>{msg.role === 'user' ? 'You: ' : 'Bot: '}</b>{msg.content}
                  </div>
                ))
              }
              {loading && <div>Typing...</div>}
            </div>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ width: '80%', marginRight: '8px' }}
            />
            <button onClick={sendMessage} disabled={loading}>Send</button>
          </>
        ) : (
          <div>Select a chat or start a new chat</div>
        )}
      </div>
    </div>
  );
};

export default ChatbotApp;
