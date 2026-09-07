import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { FAQ_QUESTIONS } from '../services/aiChatService';

export const StoreFAQNotice = () => {
  const [openId, setOpenId] = useState(1); // Mặc định mở câu hỏi số 1

  const toggleFAQ = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6 select-none animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-bold border border-teal-200">
            <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
            <span>Lưu Ý & Hướng Dẫn Mua Hàng</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Giải Đáp Thắc Mắc & Quy Trình Báo Giá Thiết Bị Y Tế
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Các câu hỏi thường gặp về chính sách báo giá, phương thức đặt hàng, tra cứu tiến độ và hỗ trợ kỹ thuật tại <strong>Thiết Bị Y Tế Kim Liên</strong> (7/54 Dương Thiệu Tước).
          </p>
        </div>

        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl text-xs transition shadow-md shrink-0 self-start sm:self-center cursor-pointer group"
        >
          <span>Chuyển đến trang Liên hệ & Góp ý</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Accordion 5 Câu Hỏi Mẫu */}
      <div className="space-y-3">
        {FAQ_QUESTIONS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-teal-300 bg-teal-50/40 shadow-xs'
                  : 'border-gray-200/80 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {faq.id}
                  </span>
                  <h3
                    className={`text-xs sm:text-sm font-bold transition-colors ${
                      isOpen ? 'text-teal-950' : 'text-gray-800'
                    }`}
                  >
                    {faq.question}
                  </h3>
                </div>

                <div
                  className={`p-1 rounded-lg text-gray-500 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-teal-700 bg-teal-100/60' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 pt-0 pl-14 sm:pl-16 text-xs sm:text-[13px] text-gray-700 leading-relaxed border-t border-teal-100/60 pt-3 animate-fade-in space-y-3">
                  <p>{faq.answer}</p>

                  {faq.actionLink && (
                    <div className="pt-1">
                      <Link
                        to={faq.actionLink}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition shadow-xs group"
                      >
                        <span>{faq.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Banner nhỏ hỗ trợ nhanh */}
      <div className="p-4 bg-gradient-to-r from-teal-900 to-emerald-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-200 shrink-0">
            <Phone className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <strong className="block text-xs font-bold">Cần tư vấn thiết bị phòng khám hoặc nhận báo giá dự án?</strong>
            <span className="text-[11px] text-teal-200/90">
              Hotline & Zalo: <strong>0914 066 662</strong> | Showroom: <strong>7/54 Dương Thiệu Tước</strong>
            </span>
          </div>
        </div>

        <a
          href="https://zalo.me/0914066662"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition shadow-xs shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Nhắn Zalo Nhận Báo Giá</span>
        </a>
      </div>
    </section>
  );
};

export default StoreFAQNotice;

