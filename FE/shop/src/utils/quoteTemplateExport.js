/**
 * Tiện ích tải file mẫu Excel/CSV Báo Giá Thiết Bị Y Tế
 */
export const downloadQuoteExcelTemplate = () => {
  const headers = [
    "STT",
    "Tên Thiết Bị / Model Cần Báo Giá (*)",
    "Chuyên Khoa / Nhóm Thiết Bị",
    "Hãng Sản Xuất / Xuất Xứ Mong Muốn",
    "Số Lượng (*)",
    "Đơn Vị Tính",
    "Yêu Cầu Kỹ Thuật & Ghi Chú Chi Tiết"
  ];

  const sampleRows = [
    [
      "1",
      "Máy đo huyết áp bắp tay tự động Omron HEM-7120",
      "Chẩn đoán hình ảnh & Thăm dò",
      "Omron / Nhật Bản",
      "10",
      "Chiếc",
      "Kèm bộ đổi nguồn Adapter chính hãng, bảo hành 5 năm"
    ],
    [
      "2",
      "Máy tạo oxy y tế 5 lít/phút Yuwell 7F-5D",
      "Hồi sức cấp cứu & Thở oxy",
      "Yuwell / Liên doanh Đức",
      "3",
      "Máy",
      "Độ tinh khiết oxy >= 93%, có chức năng xông khí dung"
    ],
    [
      "3",
      "Máy theo dõi bệnh nhân 5 thông số (Patient Monitor)",
      "Phòng mổ & Hồi sức tích cực",
      "Mindray / Philips / GE",
      "2",
      "Bộ",
      "Đo ECG, SpO2, NIBP, Nhịp thở, Nhiệt độ; màn hình >= 12 inch"
    ],
    [
      "4",
      "Ống nghe y tế chuyên khoa tim mạch Classic III",
      "Khám chẩn đoán tổng quát",
      "Littmann / 3M Mỹ",
      "5",
      "Cái",
      "Màu đen hoặc xanh navy, bảo hành chính hãng"
    ],
    [
      "5",
      "Găng tay y tế không bột Nitrile (Hộp 100 chiếc)",
      "Vật tư tiêu hao phòng dịch",
      "VGlove / VinaGlove",
      "50",
      "Hộp",
      "Size M (30 hộp), Size L (20 hộp)"
    ]
  ];

  // Tạo nội dung CSV kèm UTF-8 BOM để mở tiếng Việt trên Microsoft Excel không bị lỗi font
  const bom = "\uFEFF";
  
  let csvContent = "";
  csvContent += "=== BẢNG DANH MỤC YÊU CẦU BÁO GIÁ THIẾT BỊ Y TẾ - MEDIEQUIP STORE ===\n";
  csvContent += "Cửa hàng: Thiết Bị Y Tế Kim Liên | Hotline/Zalo: 0914 066 662 | Email: lienkehoach@gmail.com\n";
  csvContent += "----------------------------------------------------------------------------------------------------------------\n";
  csvContent += "THÔNG TIN KHÁCH HÀNG (Quý khách vui lòng điền thông tin):\n";
  csvContent += "Họ và tên người liên hệ: ........................................................\n";
  csvContent += "Số điện thoại nhận báo giá (*): ................................................\n";
  csvContent += "Tên Cơ sở y tế / Bệnh viện / Phòng khám: .......................................\n";
  csvContent += "Email nhận file báo giá: .......................................................\n";
  csvContent += "Địa chỉ giao hàng dự kiến: .....................................................\n";
  csvContent += "----------------------------------------------------------------------------------------------------------------\n\n";

  // Thêm Header bảng
  csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";

  // Thêm Dòng mẫu
  sampleRows.forEach(row => {
    csvContent += row.map(col => `"${col.replace(/"/g, '""')}"`).join(",") + "\n";
  });

  // Thêm 5 dòng trống cho khách tự điền
  for (let i = 6; i <= 10; i++) {
    csvContent += `"${i}","","","","","",""\n`;
  }

  csvContent += "\n* Hướng dẫn: Quý khách điền danh sách thiết bị cần mua vào file này, sau đó tải lên tại website hoặc gửi qua Zalo shop để nhận bảng báo giá chiết khấu trong 30 phút.";

  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "Mau_Yeu_Cau_Bao_Gia_Thiet_Bi_Y_Te_MediEquip.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default downloadQuoteExcelTemplate;