import React, { useState } from 'react';
import ChatbotStart from './components/ChatbotStart';
import ChatbotApp from './components/ChatbotApp';

const App = () => {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <div>
      {started ? <ChatbotApp /> : <ChatbotStart onStart={handleStart} />}
    </div>
  );
};

export default App;
