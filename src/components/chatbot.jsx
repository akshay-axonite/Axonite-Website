import React, { useState, useRef, useEffect } from 'react';

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();

      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: '⚠️ Unable to connect to the assistant server. Please check your backend.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Compact Chat Popup */}
      {isOpen && (
        <div className="mb-3 flex flex-col h-[380px] w-72 sm:w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all">
          
          {/* Header */}
          <header className="flex items-center justify-between px-3.5 py-2.5 bg-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-indigo-800 flex items-center justify-center font-bold text-[10px]">
                  AI
                </div>
                <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-400 border border-indigo-600 rounded-full"></span>
              </div>
              <h2 className="font-medium text-xs">Assistant</h2>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-indigo-200 hover:text-white p-0.5 rounded transition-colors focus:outline-none"
              aria-label="Close Chat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          {/* Message List */}
          <main className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gray-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-1.5 rounded-xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Dots */}
            {isTyping && (
              <div className="flex items-center gap-1 bg-white border border-gray-200 w-fit px-2.5 py-1.5 rounded-xl rounded-bl-none">
                <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </main>

          {/* Input Area */}
          <footer className="p-2 bg-white border-t border-gray-100">
            <form onSubmit={handleSendMessage} className="flex items-center gap-1.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-1.5 text-xs bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-indigo-500 transition-all text-gray-800 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors focus:outline-none"
                aria-label="Send"
              >
                <svg className="w-3.5 h-3.5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </footer>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-11 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md hover:shadow-lg transition-all focus:outline-none"
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}