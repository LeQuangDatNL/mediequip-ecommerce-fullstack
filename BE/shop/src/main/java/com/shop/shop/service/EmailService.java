package com.shop.shop.service;

import com.shop.shop.entity.Consultation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${app.admin.notification-email:kimlienmedical@gmail.com}")
    private String adminNotificationEmail;

    /**
     * Gửi mã xác thực OTP qua Gmail khi đăng ký tài khoản
     */
    public boolean sendRegistrationOtp(String toEmail, String otpCode) {
        if (mailSender == null || fromEmail == null || fromEmail.trim().isEmpty()) {
            logger.info("Chưa cấu hình thông số SMTP Gmail (spring.mail.username). Mã OTP đăng ký của {} là: [{}]", toEmail, otpCode);
            return false;
        }

        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(toEmail);
            msg.setSubject("[Thiết Bị Y Tế Kim Liên] Mã xác thực đăng ký tài khoản");
            msg.setText(
                "Xin chào,\n\n" +
                "Cảm ơn bạn đã đăng ký tài khoản tại Hệ Thống Thiết Bị Y Tế Kim Liên.\n\n" +
                "Mã xác thực (OTP) của bạn là: " + otpCode + "\n\n" +
                "Mã này có hiệu lực trong vòng 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai để bảo mật tài khoản.\n\n" +
                "Trân trọng,\n" +
                "Trung Tâm Phân Phối Thiết Bị Y Tế Kim Liên\n" +
                "Hotline: 0914 066 662\n" +
                "Địa chỉ: 7/54 Dương Thiệu Tước, Phường Tân Quý, Quận Tân Phú, TP.HCM"
            );
            mailSender.send(msg);
            logger.info("Đã gửi mã OTP đăng ký thành công tới email: {}", toEmail);
            return true;
        } catch (Exception e) {
            logger.warn("Không thể gửi email OTP qua SMTP: {}. Mã OTP test là: [{}]", e.getMessage(), otpCode);
            return false;
        }
    }

    /**
     * Gửi email xác nhận tiếp nhận yêu cầu cho khách hàng và thông báo cho Admin
     */
    public void sendConsultationNotification(Consultation consultation) {
        if (mailSender == null || fromEmail == null || fromEmail.trim().isEmpty()) {
            logger.info("Chưa cấu hình thông số SMTP Gmail (spring.mail.username). Bỏ qua gửi email tự động.");
            return;
        }

        try {
            // 1. Gửi email cảm ơn & xác nhận cho Khách hàng
            if (consultation.getEmail() != null && !consultation.getEmail().trim().isEmpty()) {
                SimpleMailMessage customerMsg = new SimpleMailMessage();
                customerMsg.setFrom(fromEmail);
                customerMsg.setTo(consultation.getEmail());
                customerMsg.setSubject("[Thiết Bị Y Tế Kim Liên] Xác nhận tiếp nhận yêu cầu báo giá / tư vấn: " + consultation.getTitle());
                customerMsg.setText(
                    "Xin chào " + consultation.getFullName() + ",\n\n" +
                    "Hệ thống Thiết Bị Y Tế Kim Liên đã nhận được yêu cầu tư vấn / báo giá của bạn:\n" +
                    "- Mã yêu cầu: #" + consultation.getId() + "\n" +
                    "- Tiêu đề: " + consultation.getTitle() + "\n" +
                    "- Nội dung: " + consultation.getContent() + "\n" +
                    (consultation.getAttachmentName() != null ? "- File đính kèm: " + consultation.getAttachmentName() + "\n" : "") +
                    "- Thời gian gửi: " + java.time.LocalDateTime.now() + "\n\n" +
                    "Đội ngũ Dược sĩ & Chuyên viên y tế sẽ liên hệ lại bạn qua số điện thoại " + consultation.getPhone() + " trong vòng 15-30 phút.\n\n" +
                    "Trân trọng,\n" +
                    "Trung Tâm Phân Phối Thiết Bị Y Tế Kim Liên\n" +
                    "Hotline: 0914 066 662\n" +
                    "Địa chỉ: 7/54 Dương Thiệu Tước, Phường Tân Quý, Quận Tân Phú, TP.HCM"
                );
                mailSender.send(customerMsg);
                logger.info("Đã gửi email xác nhận thành công tới khách hàng: {}", consultation.getEmail());
            }

            // 2. Gửi email thông báo cho Admin
            if (adminNotificationEmail != null && !adminNotificationEmail.trim().isEmpty()) {
                SimpleMailMessage adminMsg = new SimpleMailMessage();
                adminMsg.setFrom(fromEmail);
                adminMsg.setTo(adminNotificationEmail);
                adminMsg.setSubject("🔔 [Yêu Cầu Mới #" + consultation.getId() + "] " + consultation.getTitle());
                adminMsg.setText(
                    "Có một yêu cầu tư vấn / gửi file báo giá mới từ khách hàng:\n\n" +
                    "- Họ tên: " + consultation.getFullName() + "\n" +
                    "- Số điện thoại: " + consultation.getPhone() + "\n" +
                    "- Email: " + consultation.getEmail() + "\n" +
                    "- Tiêu đề: " + consultation.getTitle() + "\n" +
                    "- Nội dung: " + consultation.getContent() + "\n" +
                    (consultation.getAttachmentUrl() != null ? "- Đường dẫn file: " + consultation.getAttachmentUrl() + "\n" : "") +
                    "\nVui lòng đăng nhập trang Quản trị Admin để xem chi tiết và phản hồi khách hàng."
                );
                mailSender.send(adminMsg);
                logger.info("Đã gửi email thông báo tới Admin: {}", adminNotificationEmail);
            }
        } catch (Exception e) {
            logger.warn("Không thể gửi email thông báo: {}", e.getMessage());
        }
    }
}
