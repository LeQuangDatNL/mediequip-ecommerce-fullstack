/**
 * Dịch vụ Trợ lý AI và Hỏi đáp (FAQ) Thiết Bị Y Tế Kim Liên
 * Kết nối Google Gemini API với cơ chế tự động chuyển đổi mô hình (Fallback: gemini-2.5-flash -> gemini-flash-lite-latest -> gemini-3.5-flash-lite)
 * Tích hợp sẵn 5 câu hỏi mẫu chuẩn và bộ tri thức y khoa dự phòng offline.
 */

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY || "";
const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
];

// 5 Câu hỏi & Trả lời mẫu (FAQ chuẩn theo yêu cầu)
export const FAQ_QUESTIONS = [
  {
    id: 1,
    question: "Tại sao một số sản phẩm trên website không để giá cố định?",
    shortLabel: "Tại sao không để giá cố định?",
    answer:
      "Do đặc thù thiết bị y tế có mức giá linh hoạt tùy theo số lượng mua, địa điểm giao nhận và chính sách chiết khấu riêng cho khách quen / phòng khám. Trao đổi trực tiếp giúp chúng tôi báo mức giá ưu đãi và tốt nhất cho quý khách.",
  },
  {
    id: 2,
    question: "Có những hình thức nào để liên hệ và đặt hàng tại shop?",
    shortLabel: "Hình thức liên hệ & đặt hàng?",
    answer:
      "Quý khách có thể lựa chọn các hình thức thuận tiện:\n- (1) **Đặt trực tiếp trên Website 24/7**.\n- (2) **Nhắn Zalo** gửi danh sách hoặc file Excel (Kênh phản hồi nhanh nhất & phổ biến nhất qua Hotline **0914 066 662**).\n- (3) **Gọi Hotline** tư vấn trực tiếp.\n- (4) **Nhắn tin qua Facebook Messenger**.",
  },
  {
    id: 3,
    question: "Sau khi đặt hàng, khi nào tôi nhận được thông báo xác nhận đơn?",
    shortLabel: "Khi nào nhận được xác nhận đơn?",
    answer:
      "Đơn hàng của bạn sẽ được bộ phận chăm sóc khách hàng tiếp nhận, kiểm tra kho và liên hệ xác nhận trong vòng **1 – 2 ngày làm việc** (thường sớm hơn trong giờ hành chính từ 15 - 30 phút).",
  },
  {
    id: 4,
    question: "Không tìm thấy mặt hàng cần mua trên website thì phải làm sao?",
    shortLabel: "Không tìm thấy sản phẩm cần mua?",
    answer:
      "Quý khách có thể gửi trực tiếp hình ảnh, tên sản phẩm hoặc file danh sách Excel thiết bị cần tìm qua **Zalo 0914 066 662** hoặc form \"**Gửi Yêu Cầu Báo Giá**\" trên thanh menu. Chúng tôi sẽ liên hệ tìm nguồn hàng chính hãng và báo giá ưu đãi cho bạn.",
  },
  {
    id: 5,
    question: "Nếu gặp sự cố về website hoặc chất lượng sản phẩm thì phản ánh ở đâu?",
    shortLabel: "Phản ánh sự cố / Đổi trả ở đâu?",
    answer:
      "Quý khách vui lòng chuyển sang trang **Liên Hệ & Góp Ý**. Hệ thống tiếp nhận 4 nhóm yêu cầu:\n- (1) Báo lỗi kỹ thuật / Website\n- (2) Tìm kiếm sản phẩm chưa có trên web\n- (3) Phản ánh chất lượng sản phẩm / Đổi trả\n- (4) Góp ý & thắc mắc khác.",
    actionLink: "/contact",
    actionText: "Chuyển đến trang Liên hệ & Góp ý →",
  },
];

const SYSTEM_INSTRUCTION = `
Bạn là "Trợ lý Y tế Kim Liên AI" - chuyên viên tư vấn kỹ thuật y khoa & dược phẩm của Cửa hàng Thiết Bị Y Tế Kim Liên (MediEquip Vietnam).
Thông tin chính thức của cửa hàng:
- Địa chỉ Showroom: 7/54 Dương Thiệu Tước
- Hotline / Zalo đặt hàng & nhận file Excel báo giá: 0914 066 662
- Email liên hệ: lienkehoach@gmail.com
- Phụ trách chuyên môn: Kỹ sư Ngô Kim Liên

Quy tắc trả lời:
1. Luôn giữ thái độ ân cần, chuyên nghiệp, chuẩn mực y khoa, thân thiện và trung thực.
2. Với các câu hỏi tư vấn thiết bị (máy đo huyết áp Omron, nhiệt kế Microlife, máy đo đường huyết Accu-Chek, máy tạo oxy Yuwell, máy hút sữa Medela, xe lăn Lucass, máy tăm nước, đai cột sống Disk Dr...):
   - Nêu rõ công dụng, tiêu chuẩn, cách sử dụng đúng chuẩn y tế.
   - Luôn hướng dẫn khách hàng gửi yêu cầu báo giá trên website hoặc nhắn Zalo 0914 066 662 để nhận mức chiết khấu và báo giá dự án ưu đãi nhất.
3. Với các câu hỏi về chính sách, địa chỉ, hình thức đặt hàng: Trả lời ngắn gọn, chuẩn xác theo thông tin của cửa hàng tại 7/54 Dương Thiệu Tước.
4. Trả lời bằng tiếng Việt, định dạng danh sách gạch đầu dòng rõ ràng, dễ đọc.
`;

/**
 * Phản hồi dự phòng cục bộ thông minh theo từ khóa (khi offline hoặc lỗi API)
 */
function getLocalSmartAnswer(query) {
  const q = query.toLowerCase();

  if (q.includes("địa chỉ") || q.includes("ở đâu") || q.includes("showroom") || q.includes("chi nhánh")) {
    return {
      text: "Dạ, Showroom Cửa hàng Thiết Bị Y Tế Kim Liên tọa lạc tại địa chỉ:\n- 📍 **7/54 Dương Thiệu Tước**\n- ⏰ Giờ mở cửa: **8:00 - 21:00** (Tất cả các ngày trong tuần)\n- 📞 Hotline / Zalo: **0914 066 662**\n\nQuý khách có thể ghé trực tiếp để trải nghiệm và kiểm tra thiết bị y tế chính hãng ạ!",
      source: "local_kb",
    };
  }

  if (q.includes("hotline") || q.includes("số điện thoại") || q.includes("sđt") || q.includes("zalo") || q.includes("liên hệ")) {
    return {
      text: "Dạ, quý khách có thể liên hệ nhanh qua các kênh sau:\n- 📞 **Hotline / Zalo:** 0914 066 662 (Tiếp nhận danh sách & File Excel báo giá nhanh nhất)\n- ✉️ **Email:** lienkehoach@gmail.com\n- 🏢 **Địa chỉ:** 7/54 Dương Thiệu Tước\n\nĐội ngũ kỹ sư y tế luôn sẵn sàng hỗ trợ 24/7!",
      source: "local_kb",
    };
  }

  if (q.includes("huyết áp") || q.includes("omron") || q.includes("đo huyết áp")) {
    return {
      text: "Dạ, shop cung cấp đầy đủ các dòng **máy đo huyết áp bắp tay và cổ tay chính hãng (Omron, Microlife, Beurer)** với công nghệ Intellisense tự động bơm khí êm ái, cảnh báo nhịp tim không đều và bộ nhớ lưu kết quả.\n\n👉 Quý khách có thể thêm sản phẩm vào danh sách yêu cầu báo giá trên website hoặc nhắn Zalo **0914 066 662** để nhận giá chiết khấu ưu đãi cho gia đình và phòng khám ạ!",
      source: "local_kb",
    };
  }

  if (q.includes("đường huyết") || q.includes("tiểu đường") || q.includes("accu-chek") || q.includes("que thử")) {
    return {
      text: "Dạ, shop có sẵn các dòng **máy đo đường huyết Accu-Chek Guide, Instant, OneTouch, Sinocare** kèm que thử và kim lấy máu chính hãng, độ chính xác chuẩn ISO 15197:2013.\n\n👉 Vui lòng liên hệ Hotline/Zalo **0914 066 662** để nhận báo giá trọn bộ máy + que thử giá tốt nhất ạ!",
      source: "local_kb",
    };
  }

  if (q.includes("oxy") || q.includes("máy tạo oxy") || q.includes("bình oxy") || q.includes("yuwell")) {
    return {
      text: "Dạ, shop cung cấp **máy tạo oxy y tế 3 lít, 5 lít, 10 lít chính hãng Yuwell, Owgels, Konsung** đạt độ tinh khiết oxy > 93%, có chức năng xông khí dung và vận hành êm ái 24/24.\n\n👉 Để được tư vấn dung tích phù hợp với tình trạng sức khỏe bệnh nhân và báo giá giao nhanh, quý khách gọi ngay Hotline **0914 066 662** nhé!",
      source: "local_kb",
    };
  }

  if (q.includes("báo giá") || q.includes("excel") || q.includes("chiết khấu") || q.includes("hóa đơn") || q.includes("vat")) {
    return {
      text: "Dạ, shop hỗ trợ **xuất hóa đơn đỏ VAT đầy đủ** và cung cấp chính sách chiết khấu linh hoạt theo số lượng cho cá nhân, phòng khám, bệnh viện.\n\nQuý khách có thể gửi file Excel danh mục qua Zalo **0914 066 662** hoặc nhấn vào mục **\"Gửi File Báo Giá\"** trên thanh menu website để nhận phản hồi trong vòng 15-30 phút ạ!",
      source: "local_kb",
    };
  }

  return null;
}

/**
 * Gửi câu hỏi đến Google Gemini API với Fallback và Auto-Recovery
 */
export async function sendChatMessage(userMessage, conversationHistory = []) {
  const trimmed = userMessage ? userMessage.trim() : "";
  if (!trimmed) {
    return { text: "Dạ, quý khách vui lòng nhập câu hỏi để em hỗ trợ nhé!", source: "empty" };
  }

  // 1. Kiểm tra nếu câu hỏi trùng khớp với 1 trong 5 câu hỏi FAQ mẫu
  const matchedFAQ = FAQ_QUESTIONS.find(
    (faq) =>
      faq.question.toLowerCase().includes(trimmed.toLowerCase()) ||
      trimmed.toLowerCase().includes(faq.shortLabel.toLowerCase()) ||
      trimmed.toLowerCase() === faq.question.toLowerCase()
  );

  if (matchedFAQ) {
    return {
      text: matchedFAQ.answer,
      actionLink: matchedFAQ.actionLink,
      actionText: matchedFAQ.actionText,
      source: "faq",
    };
  }

  // 2. Chuẩn bị nội dung lịch sử hội thoại chuẩn định dạng Gemini
  const formattedContents = [];

  // Lọc lấy các tin nhắn trò chuyện thực tế (bỏ tin nhắn chào ban đầu nếu có)
  const validHistory = conversationHistory
    .filter((msg) => msg.id !== "welcome-1" && msg.text && msg.text.trim())
    .slice(-6);

  validHistory.forEach((msg) => {
    formattedContents.push({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    });
  });

  // Thêm tin nhắn hiện tại của người dùng
  formattedContents.push({
    role: "user",
    parts: [{ text: trimmed }],
  });

  // Đảm bảo không có 2 turn cùng role liên tiếp
  const sanitizedContents = [];
  formattedContents.forEach((curr) => {
    if (sanitizedContents.length > 0) {
      const prev = sanitizedContents[sanitizedContents.length - 1];
      if (prev.role === curr.role) {
        // Gộp nội dung nếu trùng role
        prev.parts[0].text += `\n${curr.parts[0].text}`;
        return;
      }
    }
    sanitizedContents.push(curr);
  });

  // 3. Thử gọi lần lượt các mô hình Gemini
  for (const model of CANDIDATE_MODELS) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: sanitizedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn(`Model ${model} returned status ${response.status}. Trying fallback...`);
        continue;
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const generatedText = candidate?.content?.parts?.[0]?.text;

      if (generatedText && generatedText.trim()) {
        return {
          text: generatedText.trim(),
          source: "gemini_ai",
          model: model,
        };
      }
    } catch (err) {
      console.warn(`Lỗi khi gọi model ${model}:`, err);
    }
  }

  // 4. Nếu toàn bộ API mạng đều lỗi, sử dụng Bộ tri thức cục bộ (Smart Local Knowledge Base)
  const localAnswer = getLocalSmartAnswer(trimmed);
  if (localAnswer) {
    return localAnswer;
  }

  // 5. Phản hồi chung thân thiện nếu không tìm thấy
  return {
    text: `Dạ chào quý khách! Cửa hàng **Thiết Bị Y Tế Kim Liên** tại địa chỉ **7/54 Dương Thiệu Tước** sẵn sàng hỗ trợ quý khách.

Quý khách có thể gửi yêu cầu báo giá trên website hoặc liên hệ trực tiếp:
- 📞 **Hotline / Zalo:** 0914 066 662 (Tư vấn nhanh & gửi báo giá chiết khấu)
- ✉️ **Email:** lienkehoach@gmail.com
- 🕒 **Giờ làm việc:** 8:00 - 21:00 hàng ngày`,
    source: "fallback",
  };
}

export default {
  FAQ_QUESTIONS,
  sendChatMessage,
};

