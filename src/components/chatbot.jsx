import React, { useState, useRef, useEffect } from 'react';

const API_BASE_URL = "http://localhost:5000/api";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I'm Axonite's AI assistant. Ask me anything about our services, tech stacks, or company solutions."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
      setHasInteracted(true);
    }
  }, [messages, isTyping, isOpen]);

  const handleClearHistory = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: 'Conversation reset. How can I help you today?'
      }
    ]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();

      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply || "I didn't receive a response from the assistant.",
        sources: data.sources || []
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Unable to reach the assistant server. Please reach out to info@axonite.net.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      {/* Proactive Help Tooltip (Hidden once opened) */}
      {!isOpen && !hasInteracted && (
        <div className="mb-2 mr-1 flex items-center gap-2 bg-white text-gray-900 border border-blue-200 px-3 py-1.5 rounded-full shadow-lg text-xs font-semibold animate-bounce">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
          Need help? Ask our AI
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3.5 flex flex-col h-[500px] w-80 sm:w-96 bg-white border-2 border-blue-500/20 rounded-2xl shadow-2xl overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header - Vivid Electric Blue */}
          <header className="flex items-center justify-between px-4 py-3.5 bg-blue-600 text-white shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-white text-blue-600 flex items-center justify-center font-bold text-xs shadow-xs">
                  AI
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-600 rounded-full"></span>
              </div>
              <div>
                <h2 className="font-semibold text-sm text-white leading-tight">Axonite Assistant</h2>
                <p className="text-[11px] text-blue-100 font-medium">Online • Instant Answers</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Reset Conversation"
                className="text-blue-200 hover:text-white hover:bg-blue-700/50 p-1.5 rounded-lg transition-colors text-xs"
              >
                ↻
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-blue-200 hover:text-white hover:bg-blue-700/50 p-1.5 rounded-lg transition-colors"
                aria-label="Close Chat"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          {/* Messages Body */}
          <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Grounded PDF Document Badges */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1 items-center pl-1">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Ref:</span>
                    {msg.sources.map((src, i) => (
                      <span
                        key={i}
                        className="inline-block text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-medium truncate max-w-[150px]"
                        title={src}
                      >
                        📄 {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 w-fit px-3.5 py-2 rounded-2xl rounded-bl-none shadow-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </main>

          {/* Input Box */}
          <footer className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, tech, services..."
                className="flex-1 px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-600 transition-all text-slate-800 placeholder-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors focus:outline-none shadow-sm cursor-pointer"
                aria-label="Send message"
              >
                <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </footer>
        </div>
      )}

      {/* Floating Launcher Button with Pulsing Wave */}
      <div className="relative">
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-blue-500 opacity-60 animate-ping pointer-events-none"></span>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-xl hover:shadow-blue-500/30 transition-all focus:outline-none cursor-pointer transform hover:scale-105 active:scale-95"
          aria-label="Toggle Chat"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}