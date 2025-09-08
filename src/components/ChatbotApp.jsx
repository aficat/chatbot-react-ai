import React, { useState } from 'react';

const initialChats = [
  {
    id: 1,
    title: 'Daily Planning',
    lastMessage: 'You have a meeting at 10 AM, a lunch break at 12 PM, and a gym session at 6 PM.',
    date: '2025-09-08',
    time: '08:00 AM',
    messages: [
      'Good morning! Can you tell me my schedule for today?',
      'You have a meeting at 10 AM, a lunch break at 12 PM, and a gym session at 6 PM.',
      'Thanks! Any reminders for deadlines?',
      'Yes, your project report is due by 5 PM today.',
    ],
  },
  {
    id: 2,
    title: 'Travel Queries',
    lastMessage: 'The fastest route to the airport is via Route 5, it will take 45 minutes.',
    date: '2025-09-07',
    time: '02:30 PM',
    messages: [
      'Hi, how long will it take to get to the airport from my place?',
      'The fastest route to the airport is via Route 5, it will take 45 minutes.',
      'Can you suggest a good place for lunch near the airport?',
      'You could try Sky Bistro, it has excellent reviews and is 10 minutes away.',
    ],
  },
  {
    id: 3,
    title: 'Weather Check',
    lastMessage: 'Tomorrow will be partly cloudy with a high of 28°C and a low of 22°C.',
    date: '2025-09-06',
    time: '07:00 AM',
    messages: [
      'Hello, what’s the weather like tomorrow?',
      'Tomorrow will be partly cloudy with a high of 28°C and a low of 22°C.',
      'Do I need an umbrella?',
      'No, there is only a 10% chance of rain.',
    ],
  },
  {
    id: 4,
    title: 'Cooking Help',
    lastMessage: 'You can make a simple garlic butter pasta in 15 minutes.',
    date: '2025-09-05',
    time: '05:20 PM',
    messages: [
      'Hey, I want to cook something quick for dinner.',
      'You can make a simple garlic butter pasta in 15 minutes.',
      'Great! What ingredients do I need?',
      'You need pasta, garlic, butter, olive oil, and parmesan cheese.',
    ],
  },
  {
    id: 5,
    title: 'Fun Facts',
    lastMessage: 'Did you know honey never spoils? Archaeologists have found edible honey in ancient Egyptian tombs.',
    date: '2025-09-04',
    time: '03:45 PM',
    messages: [
      'Tell me something interesting!',
      'Did you know honey never spoils? Archaeologists have found edible honey in ancient Egyptian tombs.',
      'Wow! Any other fun fact?',
      'Bananas are berries, but strawberries are not.',
    ],
  },
  {
    id: 6,
    title: 'Fitness Advice',
    lastMessage: 'Try a 20-minute home workout with squats, lunges, and push-ups.',
    date: '2025-09-03',
    time: '06:10 PM',
    messages: [
      'I want to exercise at home, any suggestions?',
      'Try a 20-minute home workout with squats, lunges, and push-ups.',
      'Should I warm up first?',
      'Yes, a 5-minute warm-up of jumping jacks or jogging in place is recommended.',
    ],
  },
];

const ChatApp = () => {
  const [chats, setChats] = useState(initialChats);
  const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id);

  const selectChat = (id) => {
    setSelectedChatId(id);
  };

  const deleteChat = (id) => {
    setChats(chats.filter(chat => chat.id !== id));
    if (selectedChatId === id && chats.length > 1) {
      setSelectedChatId(chats[0].id);
    } else if (chats.length === 1) {
      setSelectedChatId(null);
    }
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  return (
    <div className="chat-app-container">
      <div className="chat-list">
        <h3>Your Chats</h3>
        {chats.length === 0 && <p>No chats available</p>}
        {chats.map(chat => (
          <div key={chat.id} className={`chat-list-item ${chat.id === selectedChatId ? 'active' : ''}`}>
            <div className="chat-info" onClick={() => selectChat(chat.id)}>
              <h4>{chat.title}</h4>
              <span className="chat-meta">{chat.time} | {chat.date}</span>
              <p>{chat.lastMessage}</p>
            </div>
            <button className="delete-btn" onClick={() => deleteChat(chat.id)}>✕</button>
          </div>
        ))}
      </div>

      <div className="chat-window">
        {selectedChat ? (
          <>
            <div className="chat-header">{selectedChat.title}</div>
            <div className="chat-messages">
              {selectedChat.messages.map((msg, idx) => (
                <div key={idx} className="message bot">{msg}</div>
              ))}
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Type a message..." />
              <button>Send</button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
