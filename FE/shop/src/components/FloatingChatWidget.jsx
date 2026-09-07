import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Bot,
  User,
  Send,
  X,
  Sparkles,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  HelpCircle,
  ShieldCheck,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';
import { FAQ_QUESTIONS, sendChatMessage } from '../services/aiChatService';

export const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Xin chào quý khách! Em là **Trợ lý Y tế Kim Liên AI** 🩺\n\nEm có thể giúp quý khách tìm hiểu thiết bị y tế, hướng dẫn sử dụng máy đo hoặc giải đáp các thắc mắc nhanh bên dưới:',
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isTyping]);

  // Xử lý gửi tin nhắn
  const handleSend = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage(text, messages);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        actionLink: response.actionLink,
        actionText: response.actionText,
        source: response.source,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn chat:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Dạ, hệ thống đang bận. Quý khách vui lòng gọi Hotline **0914 066 662** hoặc nhắn Zalo để được hỗ trợ nhanh nhất ạ!',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Click vào câu hỏi mẫu (FAQ)
  const handleSelectFAQ = (faq) => {
    handleSend(faq.question);
  };

  // Làm mới cuộc trò chuyện
  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-1',
        sender: 'bot',
        text: 'Xin chào quý khách! Em là **Trợ lý Y tế Kim Liên AI** 🩺\n\nEm có thể giúp quý khách tìm hiểu thiết bị y tế, hướng dẫn sử dụng máy đo hoặc giải đáp các thắc mắc nhanh bên dưới:',
        timestamp: new Date(),
      },
    ]);
  };

  // Hàm render Markdown cơ bản (Bold, Link, List)
  const renderMessageContent = (text, actionLink, actionText) => {
    if (!text) return null;

    // Tách dòng
    const lines = text.split('\n');

    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed select-text">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;

          // Gạch đầu dòng
          if (line.trim().startsWith('- ') || line.trim().startsWith('• ') || line.trim().startsWith('* ')) {
            const content = line.trim().replace(/^[-•*]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-teal-600 font-bold shrink-0 mt-0.5">•</span>
                <span>{renderFormattedText(content)}</span>
              </div>
            );
          }

          return <p key={idx}>{renderFormattedText(line)}</p>;
        })}

        {/* Nút điều hướng nếu có */}
        {actionLink && actionText && (
          <div className="pt-2">
            <Link
              to={actionLink}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition shadow-xs group"
            >
              <span>{actionText}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        )}
      </div>
    );
  };

  // Render text có in đậm **...**
  const renderFormattedText = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-teal-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* 1. NÚT CHAT BONG BÓNG NỔI (FLOATING BUTTON) */}
      <div className="fixed bottom-6 right-6 z-50 select-none">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-teal-800 via-teal-700 to-emerald-600 hover:from-teal-900 hover:to-emerald-700 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/90 cursor-pointer group"
          title="Bot chat - Hỏi đáp & Tư vấn y tế 24/7"
        >
          {/* Vòng sáng nhịp rung */}
          <span className="absolute -inset-1 rounded-full bg-teal-400 opacity-40 blur-xs group-hover:opacity-75 transition"></span>

          {isOpen ? (
            <X className="w-6 h-6 relative z-10 transition-transform duration-300 rotate-0 group-hover:rotate-90" />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center">
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="text-[9px] font-extrabold tracking-tighter uppercase leading-none mt-0.5">
                Bot chat
              </span>
            </div>
          )}

          {/* Chấm xanh trạng thái Online */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
        </button>
      </div>

      {/* 2. CỬA SỔ CHATBOX CHI TIẾT */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] max-w-[420px] h-[560px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-gray-200/80 flex flex-col overflow-hidden animate-fade-in select-none">
          {/* Header Chatbox */}
          <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-200">
                <Bot className="w-6 h-6 text-emerald-300" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-teal-900 rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">Bot Chat Kim Liên</h3>
                  <span className="px-1.5 py-0.5 bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded text-[9px] font-semibold">
                    Gemini 2.5
                  </span>
                </div>
                <p className="text-[11px] text-teal-200/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                  <span>Trực tuyến • 7/54 Dương Thiệu Tước</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                title="Làm mới đoạn chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                title="Thu nhỏ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/60">
            {/* Thông tin địa chỉ & hotline ghim đầu */}
            <div className="p-2.5 bg-teal-50/80 border border-teal-200 rounded-2xl flex items-center justify-between text-[11px] text-teal-900">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span>7/54 Dương Thiệu Tước</span>
              </div>
              <a
                href="https://zalo.me/0914066662"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>Zalo: 0914 066 662</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Danh sách tin nhắn */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-tr-xs'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-xs'
                  }`}
                >
                  {renderMessageContent(msg.text, msg.actionLink, msg.actionText)}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-white text-gray-500 border border-gray-100 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-xs">
                  <span className="text-xs text-gray-500">AI đang soạn phản hồi</span>
                  <div className="flex gap-1 items-center pl-1">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}

            {/* KHU VỰC 5 CÂU HỎI MẪU (FAQ CHIPS) */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 mb-2 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
                <span>Câu hỏi thường gặp (Click để xem ngay):</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {FAQ_QUESTIONS.map((faq) => (
                  <button
                    key={faq.id}
                    type="button"
                    onClick={() => handleSelectFAQ(faq)}
                    disabled={isTyping}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-teal-50/80 border border-teal-100/80 text-gray-800 hover:text-teal-900 transition flex items-center justify-between gap-2 shadow-2xs group cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {faq.id}
                      </span>
                      <span className="text-xs font-semibold line-clamp-1">{faq.question}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-teal-600 group-hover:translate-x-0.5 transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Khung nhập tin nhắn */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Hỏi về sản phẩm, công dụng, báo giá..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
                className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-gray-300 text-white rounded-xl transition shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
                title="Gửi tin nhắn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-gray-600 mt-2 px-1">
              <span>Hỗ trợ y tế chuẩn xác</span>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="text-teal-700 hover:underline font-bold"
              >
                Gửi góp ý & Sự cố →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatWidget;

