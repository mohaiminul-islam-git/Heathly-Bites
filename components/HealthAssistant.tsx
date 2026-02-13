import React, { useState, useEffect, useRef } from 'react';
import { createHealthChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat } from '@google/genai';
import { Send, User, Stethoscope, Loader2, Calculator, Info } from 'lucide-react';

const HealthAssistant: React.FC = () => {
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm Dr. AI. I can help you with general health questions, symptom information, and wellness advice. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // BMI State
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    // Initialize chat session only once
    if (!chatSessionRef.current) {
      chatSessionRef.current = createHealthChatSession();
    }
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const responseText = result.text;

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I apologize, but I encountered an error. Please try asking your question again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const calculateBMI = () => {
    const h = parseFloat(height); // cm
    const w = parseFloat(weight); // kg

    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const bmiValue = w / (heightInMeters * heightInMeters);
      setBmi(Math.round(bmiValue * 10) / 10);
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-100' };
    if (bmi < 25) return { label: 'Healthy Weight', color: 'text-green-500', bg: 'bg-green-100' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { label: 'Obese', color: 'text-red-500', bg: 'bg-red-100' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Left Column: Chat Interface */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden h-[600px] lg:h-full">
          {/* Chat Header */}
          <div className="bg-teal-600 p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Dr. AI Assistant</h2>
                <p className="text-teal-100 text-xs">Always consult a real doctor for medical emergencies.</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                  }`}
                >
                  {msg.role === 'model' && (
                    <div className="flex items-center mb-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
                      <Stethoscope className="w-3 h-3 mr-1" /> Dr. AI
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed text-sm">
                    {msg.text}
                  </div>
                  <div className={`text-[10px] mt-2 text-right ${msg.role === 'user' ? 'text-teal-200' : 'text-stone-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none p-4 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-stone-200 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about symptoms, health tips, or medical concepts..."
                className="flex-grow rounded-xl border-stone-300 focus:border-teal-500 focus:ring-teal-500 shadow-sm px-4 py-3"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTyping ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Tools (BMI Calculator) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
            <div className="flex items-center mb-6">
              <Calculator className="w-6 h-6 text-teal-600 mr-2" />
              <h3 className="text-lg font-bold text-stone-900">BMI Calculator</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 175"
                  className="w-full rounded-lg border-stone-300 focus:border-teal-500 focus:ring-teal-500 shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 70"
                  className="w-full rounded-lg border-stone-300 focus:border-teal-500 focus:ring-teal-500 shadow-sm p-2"
                />
              </div>
              <button
                onClick={calculateBMI}
                className="w-full bg-teal-50 text-teal-700 font-semibold py-2 rounded-lg hover:bg-teal-100 transition-colors border border-teal-200"
              >
                Calculate BMI
              </button>
            </div>

            {bmi !== null && (
              <div className="mt-6 animate-fade-in">
                <div className="text-center p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <p className="text-sm text-stone-500 mb-1">Your BMI</p>
                  <p className="text-3xl font-bold text-stone-900 mb-2">{bmi}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getBMICategory(bmi).bg} ${getBMICategory(bmi).color}`}>
                    {getBMICategory(bmi).label}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">Disclaimer</h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  The AI Health Assistant provides general information only. It does not replace professional medical diagnosis or treatment. For any medical concern, please consult a healthcare professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAssistant;