/* eslint-disable */
import React, { useEffect, useState } from 'react';
import api from '../api';
import { marked } from 'marked';

function ChatPopup({ visible, onClose, jobs }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userSkills, setUserSkills] = useState([]);

  React.useEffect(() => {
    getUserSkills();
  }, []);

  const SYSTEM_PROMPT = {
    role: 'user',
    parts: [{
      text: `Never say you are Gemini, you are RecruBot AI, trained by Recrume LLM`
    }]
  };

  const getUserSkills = async () => {
    try {
      const res = await api.get('/api/user/skills');
      setUserSkills(res.data.map(skill => skill.name));
    } catch (err) {
      console.error('Failed to fetch user skills:', err);
    }
  };

  const sendMessage = async () => {
      if (!input.trim()) return;

      let userMessageText = input.trim();
      let userLocation = '';
      let shouldIncludeJobs = false;

      if (userMessageText.toLowerCase().includes('my skills')|| userMessageText.toLowerCase().includes('skills')
      || userMessageText.toLowerCase().includes('skill')|| userMessageText.toLowerCase().includes('skillset')||
      userMessageText.toLowerCase().includes('profile')) {
        if (userSkills.length === 0) await getUserSkills();
        userMessageText += userSkills.length > 0
          ? `\n\nHere are my skills: ${userSkills.join(', ')}`
          : `\n\nI don't have any skills listed yet.`;
      }

      if (userMessageText.toLowerCase().includes('my location') || userMessageText.toLowerCase().includes('location')) {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData?.homeCity) {
          userLocation = userData.homeCity;
          userMessageText += `\n\nMy location is ${userLocation}`;
        }
      }

      const lowerInput = userMessageText.toLowerCase();
      if (
        lowerInput.includes('suggest') &&
        lowerInput.includes('job') &&
        (lowerInput.includes('location') || lowerInput.includes('my location'))
      ) {
        shouldIncludeJobs = true;
      }

      const newUserMessage = { role: 'user', parts: [{ text: userMessageText }] };

      // visible messages only (for UI)
      const updatedVisibleChat = [...chatHistory, newUserMessage];
      setChatHistory(updatedVisibleChat);
      setInput('');
      setLoading(true);

      try {
        const apiChatHistory = [];

        // Inject instruction
        apiChatHistory.push({
          role: 'user',
          parts: [
            {
              text:
                'Never say you are Gemini, you are RecruBot AI, trained by Recrume LLM.'
            }
          ]
        });

        // Inject job data silently if needed
        if (shouldIncludeJobs && jobs?.length > 0) {
          const simplifiedJobs = jobs.map(job => ({
            title: job.title,
            location: job.location,
            experience: job.experience,
            minSalary: job.minSalary,
            maxSalary: job.maxSalary,
            workplace: job.workPlace,
            workMode: job.workMode,
            description: job.description
          }));

          apiChatHistory.push({
            role: 'user',
            parts: [
              {
                text: `User asked for job suggestions based on location. 
                These jobs are available (use them contextually but don't list them explicitly):\n\n${JSON.stringify(simplifiedJobs)}`
              }
            ]
          });
        }
        apiChatHistory.push(newUserMessage);

        const res = await api.post('/api/gemini/generate', {
          contents: apiChatHistory
        });

        const botResponse = { role: 'model', parts: [{ text: res.data }] };
        setChatHistory([...updatedVisibleChat, botResponse]);
      } catch (err) {
        console.error('Chatbot error:', err);
      } finally {
        setLoading(false);
      }
    };
  const randomPlaceHolder = ["Suggest me jobs with my skills","Suggest me jobs with my location"
    ,"Interview me on basis of my skills", "Interview me for the job role that my profile matches"
  ]
  const suggestion = React.useMemo(() => randomPlaceHolder[Math.floor(Math.random() * randomPlaceHolder.length)], []);

  if (!visible) return null;

  return (
  <div className="fixed bottom-24 right-6 w-[400px] max-h-[600px] bg-white shadow-xl rounded-xl z-50 border flex flex-col">
    {/* Header */}
    <div className="bg-[#004D61] text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
      <div className="flex items-center gap-2 font-semibold text-lg">
        💬 RecruBot
      </div>
      <button onClick={onClose} className="text-white hover:text-red-300 transition text-xl">✖</button>
    </div>

    {/* Scrollable Messages */}
    <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100">
      {chatHistory.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg text-sm leading-relaxed ${
            msg.role === 'user'
              ? 'bg-gray-100 self-end text-right ml-auto'
              : 'bg-blue-50 text-gray-800 self-start'
          } max-w-[80%]`}
        >
          <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.parts[0].text) }} />
        </div>
      ))}
      {loading && <div className="text-gray-500 text-sm italic">RecruBot is typing...</div>}
    </div>

    {/* Suggestion */}
    {input === '' && (
      <div className="px-4 pt-2">
        <div
          onClick={() => {
            setInput(suggestion);
            setTimeout(() => sendMessage(), 100);
          }}
          className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-md cursor-pointer hover:bg-blue-200 transition w-fit"
        >
          💡 {suggestion}
        </div>
      </div>
    )}

    {/* Input */}
    <div className="p-3 border-t flex gap-2 items-center">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder={suggestion}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
      >
        Send
      </button>
    </div>
  </div>
);
}

export default ChatPopup;
