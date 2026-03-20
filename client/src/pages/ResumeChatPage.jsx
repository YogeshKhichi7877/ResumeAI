import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../pages/Navbar';
import { resumeAPI, historyAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Send, Loader2, MessageSquare, FileText, Bot,
  User, Trash2, ChevronDown, Sparkles, Brain,
  RotateCcw, Lock, Crown, Upload, Target
} from 'lucide-react';
import FeaturePageGuard, { LockedActionButton } from '../components/FeaturePageGuard';

const SUGGESTED_QUESTIONS = [
  "What are the strongest skills on my resume?",
  "How can I improve my resume summary?",
  "What keywords am I missing for my target role?",
  "What weaknesses should I address first?",
  "How does my experience match the domain I selected?",
  "Give me 3 quick wins to improve my resume score.",
  "What projects should I add or highlight more?",
  "Am I ready to apply for senior-level positions?",
];

const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-2 h-2 bg-gray-400 rounded-full inline-block animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      {/* Avatar */}
      <div className={`w-9 h-9 border-3 border-black flex-shrink-0 flex items-center justify-center font-bold
        ${isUser ? 'bg-neo-blue text-white' : 'bg-neo-yellow text-black'}`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      {/* Bubble */}
      <div className={`max-w-[75%] border-3 border-black px-4 py-3 text-sm font-medium leading-relaxed
        ${isUser
          ? 'bg-neo-blue text-white shadow-[3px_3px_0_#000]'
          : 'bg-white text-black shadow-[3px_3px_0_#000]'
        }`}
        style={{ wordBreak: 'break-word' }}
      >
        {msg.content}
        <div className={`text-xs mt-1 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
          {msg.timestamp}
        </div>
      </div>
    </div>
  );
};

export const ResumeChatPage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // ── Fetch user's resume history on mount ──────────────────────────
  useEffect(() => {
    fetchHistory();
  }, []);

  // ── Scroll to bottom on new message ───────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const fetchHistory = async () => {
    try {
      const res = await historyAPI.getHistory();
      setHistory(res.data || []);
    } catch {
      toast.error('Failed to load your resumes');
    } finally {
      setLoadingHistory(false);
    }
  };

  const selectResume = (item) => {
    setSelectedAnalysis(item);
    setShowDropdown(false);
    setMessages([
      {
        role: 'assistant',
        content: `👋 Hi! I've loaded your resume **"${item.fileName}"** (${item.targetDomain?.replace('-', ' ')} — Score: ${item.score}/100).\n\nI've read through every line of your resume. Ask me anything — strengths, weaknesses, missing keywords, how to improve specific sections, or whether you're ready to apply for a specific role. I'm here to help!`,
        timestamp: now(),
      }
    ]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || sending) return;
    if (!selectedAnalysis) {
      toast.error('Please select a resume first');
      return;
    }

    const userMsg = { role: 'user', content: msg, timestamp: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      // Build conversation history for context (last 10 messages)
      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Fetch the full analysis to get resumeText
      const analysisRes = await resumeAPI.getAnalysis(
        selectedAnalysis.analysisId?._id || selectedAnalysis.analysisId
      );
      const resumeText = analysisRes.data?.resumeText || '';

      const res = await resumeAPI.chatWithAssistant({
        message: msg,
        resumeContext: resumeText,
        targetDomain: selectedAnalysis.targetDomain,
        conversationHistory,
      });

      const assistantMsg = {
        role: 'assistant',
        content: res.data.response,
        timestamp: now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      toast.error('Failed to get response. Please try again.');
      // Remove the user message if request failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    if (messages.length === 0) return;
    setMessages(selectedAnalysis ? [messages[0]] : []);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-neo-offwhite flex flex-col">
       <FeaturePageGuard action="chat" />
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-neo-yellow border-3 border-black flex items-center justify-center shadow-[4px_4px_0_#000]">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-space text-3xl font-extrabold uppercase tracking-tight">
                Resume AI Chat
              </h1>
              <p className="text-gray-500 font-medium text-sm">
                Ask anything about your resume — powered by Groq AI
              </p>
            </div>
          </div>
          {/* Premium badge */}
          <div className="hidden md:flex items-center gap-2 bg-black text-neo-yellow border-3 border-black px-3 py-2 shadow-[3px_3px_0_#FFE566]">
            <Crown className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-widest">Basic Plan Feature</span>
          </div>
        </div>

        {/* ── Resume Selector ──────────────────────────────────────── */}
        <div className="bg-white border-3 border-black shadow-[5px_5px_0_#000] p-5">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5" />
            <h2 className="font-space font-extrabold uppercase text-sm tracking-wide">
              Select Your Resume to Chat About
            </h2>
          </div>

          {loadingHistory ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-medium text-sm">Loading your resumes...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="border-3 border-dashed border-black p-6 text-center">
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="font-bold mb-1">No resumes analysed yet</p>
              <p className="text-gray-500 text-sm mb-4">Upload and analyse a resume first to chat about it.</p>
              <Link to="/dashboard" className="neo-button-yellow text-sm px-5 py-2 inline-flex items-center gap-2">
                <Target className="w-4 h-4" /> Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(v => !v)}
                className="w-full flex items-center justify-between border-3 border-black bg-neo-offwhite px-4 py-3 font-bold hover:bg-neo-yellow transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  {selectedAnalysis
                    ? `${selectedAnalysis.fileName} — ${selectedAnalysis.targetDomain?.replace('-', ' ')} (${selectedAnalysis.score}/100)`
                    : 'Choose a resume...'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 z-30 bg-white border-3 border-black shadow-[5px_5px_0_#000] max-h-60 overflow-y-auto">
                  {history.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => selectResume(item)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left border-b border-black/10 last:border-b-0 hover:bg-neo-yellow transition-colors"
                    >
                      <div>
                        <div className="font-bold text-sm">{item.fileName}</div>
                        <div className="text-xs text-gray-500">
                          {item.targetDomain?.replace('-', ' ')} &bull; {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`px-2 py-1 border-2 border-black text-xs font-extrabold
                        ${item.score >= 80 ? 'bg-neo-green' : item.score >= 60 ? 'bg-neo-yellow' : 'bg-neo-red'}`}>
                        {item.score}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Chat Area ────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-white border-3 border-black shadow-[5px_5px_0_#000]" style={{ minHeight: 480 }}>

          {/* Chat header bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b-3 border-black bg-neo-offwhite">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-space font-extrabold text-sm uppercase tracking-wide">
                {selectedAnalysis ? `Chatting about: ${selectedAnalysis.fileName}` : 'Resume Assistant'}
              </span>
            </div>
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              title="Clear chat"
              className="flex items-center gap-1.5 text-xs font-bold border-2 border-black px-3 py-1.5 hover:bg-neo-red hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4" style={{ maxHeight: 420 }}>
            {messages.length === 0 && !selectedAnalysis && (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400">
                <Brain className="w-16 h-16 mb-4 opacity-30" />
                <p className="font-bold text-lg">Select a resume above to start chatting</p>
                <p className="text-sm mt-1">I'll have full context of your resume and can answer any question</p>
              </div>
            )}

            {messages.length === 0 && selectedAnalysis && (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 text-gray-400">
                <Sparkles className="w-12 h-12 mb-3 opacity-40" />
                <p className="font-bold">Ready to chat!</p>
                <p className="text-sm mt-1">Try one of the suggested questions below</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}

            {sending && (
              <div className="flex gap-3 mb-4">
                <div className="w-9 h-9 border-3 border-black flex-shrink-0 flex items-center justify-center bg-neo-yellow">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="border-3 border-black bg-white shadow-[3px_3px_0_#000]">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {selectedAnalysis && messages.length <= 1 && (
            <div className="px-4 pb-3 border-t border-black/10">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 mt-3">Suggested Questions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    disabled={sending}
                    className="text-xs font-bold border-2 border-black px-3 py-1.5 bg-neo-offwhite hover:bg-neo-yellow transition-colors disabled:opacity-40"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="border-t-3 border-black p-3 flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedAnalysis ? 'Ask anything about your resume...' : 'Select a resume first...'}
              disabled={!selectedAnalysis || sending}
              rows={2}
              className="flex-1 border-3 border-black px-3 py-2 text-sm font-medium resize-none focus:outline-none focus:bg-neo-yellow/10 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
              style={{ minHeight: 56 }}
            />
           <LockedActionButton
              action="chat"
              onClick={() => sendMessage()}
              disabled={!input.trim() || !selectedAnalysis || sending}
              className="border-3 border-black px-4 bg-neo-yellow hover:bg-neo-blue hover:text-white transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-[3px_3px_0_#000] hover:shadow-[1px_1px_0_#000] active:translate-x-[2px] active:translate-y-[2px]"
            >
              {sending
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <Send className="w-5 h-5" />
              }
            </LockedActionButton>
          </div>
        </div>

        {/* ── All Suggested Questions ──────────────────────────────── */}
        {selectedAnalysis && (
          <div className="bg-white border-3 border-black shadow-[5px_5px_0_#000] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-space font-extrabold uppercase text-sm tracking-wide">More Things You Can Ask</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={sending}
                  className="text-left text-sm font-bold border-2 border-black px-4 py-2.5 bg-neo-offwhite hover:bg-neo-yellow transition-colors disabled:opacity-40 flex items-center gap-2"
                >
                  <span className="text-gray-400 font-extrabold">→</span> {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Upgrade CTA ──────────────────────────────────────────── */}
        <div className="bg-black text-white border-3 border-black shadow-[5px_5px_0_#FFE566] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Crown className="w-8 h-8 text-neo-yellow flex-shrink-0" />
            <div>
              <p className="font-space font-extrabold text-lg">Unlock AI Chat with the Basic Plan</p>
              <p className="text-gray-400 text-sm">Get unlimited conversations, deeper insights, and priority AI responses.</p>
            </div>
          </div>
          <Link
            to="/"
            className="neo-button-yellow whitespace-nowrap flex-shrink-0 text-sm px-5 py-2"
          >
            View Plans →
          </Link>
        </div>

      </div>
    </div>
  );
};