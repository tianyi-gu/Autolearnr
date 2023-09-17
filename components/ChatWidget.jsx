import React, { useState } from 'react';

const ChatWidget = () => {
  const [messages, setMessages] = useState([
    { role: "system", id: 1, content: 'Answer any questions the user has based on the following document.'},
    { role: "user", id: 2, content: 'Hi there!' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMessageObj = {
      role: "user",
      content: newMessage,
      id: messages.length + 1,
    };

    setMessages([...messages, newMessageObj]);
    
    setNewMessage('');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } fixed bottom-10 right-10 z-50 transform transition-transform duration-300`}
    >
      {isOpen ? (
        <div className="bg-white border rounded-lg shadow-lg p-4">
          <div className="flex justify-between">
            <div className="text-lg font-semibold">Chat</div>
            <button
              className="text-gray-500 hover:text-gray-700 bg-slate-100 p-2 rounded-md"
              onClick={toggleChat}
            >
            X
            </button>
          </div>
          <div className="space-y-2">
            {messages.map((message) => (
              <div key={message.id} className="text-gray-700">
                <div className={(message.role === "user" ? "text-right" : "text-left") + " font-semibold"}>
                  {message.role === "user" ? "You" : "Tutor"}
                </div>
                {message.content}
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow border rounded-l-md px-2 py-1 "
              value={newMessage}
              onChange={handleInputChange}
            />
            <button
              className="bg-blue-500 text-white rounded-r-md px-4 py-1"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          className={`${
            isOpen ? 'bg-red-500' : 'bg-blue-500'
          } text-white px-4 py-2 rounded-full`}
          onClick={toggleChat}
        >
          {isOpen ? 'Minimize' : 'Chat'}
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
