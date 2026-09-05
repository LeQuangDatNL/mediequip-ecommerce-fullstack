package com.shop.shop.service;

import com.shop.shop.dto.request.ConsultationRequest;
import com.shop.shop.dto.request.ConsultationStatusUpdateRequest;
import com.shop.shop.dto.response.ConsultationResponse;
import com.shop.shop.entity.Consultation;
import com.shop.shop.entity.User;
import com.shop.shop.repository.ConsultationRepository;
import com.shop.shop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public ConsultationService(
            ConsultationRepository consultationRepository,
            UserRepository userRepository,
            EmailService emailService
    ) {
        this.consultationRepository = consultationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    private static final java.util.Set<String> ALLOWED_EXTENSIONS = java.util.Set.of(
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".png", ".jpg", ".jpeg", ".webp"
    );

    @Transactional
    public ConsultationResponse createConsultation(ConsultationRequest request, MultipartFile file) {
        if (request.getFullName() == null || request.getFullName().trim().length() < 2 || request.getFullName().trim().length() > 100) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Họ và tên phải từ 2 đến 100 ký tự");
        }
        if (request.getPhone() == null || !request.getPhone().trim().matches("^(0[3|5|7|8|9])+([0-9]{8})$")) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Số điện thoại không hợp lệ (Phải là số di động VN 10 số, VD: 0901234567)");
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && !request.getEmail().trim().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Email không đúng định dạng");
        }
        if (request.getTitle() == null || request.getTitle().trim().length() < 5 || request.getTitle().trim().length() > 200) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Tiêu đề yêu cầu phải từ 5 đến 200 ký tự");
        }
        if (request.getContent() == null || request.getContent().trim().length() < 10 || request.getContent().trim().length() > 2000) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Nội dung yêu cầu phải từ 10 đến 2000 ký tự");
        }

        Consultation consultation = new Consultation();
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            consultation.setUser(user);
        }

        consultation.setFullName(request.getFullName().trim());
        consultation.setEmail(request.getEmail() != null ? request.getEmail().trim() : "");
        consultation.setPhone(request.getPhone().trim());
        consultation.setTitle(request.getTitle().trim());
        consultation.setContent(request.getContent().trim());
        consultation.setStatus(Consultation.ConsultationStatus.PENDING);
        consultation.setIsDeleted(false);

        // Lưu file đính kèm nếu có
        if (file != null && !file.isEmpty()) {
            if (file.getSize() > 25 * 1024 * 1024) {
                throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.PAYLOAD_TOO_LARGE, "Dung lượng file vượt quá giới hạn tối đa (25MB)!");
            }

            String originalFilename = file.getOriginalFilename();
            String ext = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                ext = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            }

            if (!ALLOWED_EXTENSIONS.contains(ext)) {
                throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.BAD_REQUEST,
                        "Định dạng file không được hỗ trợ! Chỉ chấp nhận: PDF, Word (.doc, .docx), Excel (.xls, .xlsx, .csv) hoặc Ảnh (.png, .jpg, .webp)");
            }

            try {
                String subFolder = "consultations";
                Path uploadPath = Paths.get(uploadDir, subFolder);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String uniqueFilename = UUID.randomUUID().toString() + ext;
                Path destination = uploadPath.resolve(uniqueFilename);
                file.transferTo(destination.toFile());

                consultation.setAttachmentUrl("/uploads/" + subFolder + "/" + uniqueFilename);
                consultation.setAttachmentName(originalFilename != null ? originalFilename : uniqueFilename);
                consultation.setFileType(file.getContentType());
                consultation.setFileSize(file.getSize());
            } catch (IOException e) {
                throw new RuntimeException("Không thể lưu file đính kèm: " + e.getMessage(), e);
            }
        }

        Consultation saved = consultationRepository.save(consultation);

        // Gửi email thông báo
        try {
            emailService.sendConsultationNotification(saved);
        } catch (Exception ignored) {}

        return ConsultationResponse.fromEntity(saved);
    }

    public Page<ConsultationResponse> getAllConsultations(
            Consultation.ConsultationStatus status,
            String keyword,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return consultationRepository.searchConsultations(status, keyword, pageable)
                .map(ConsultationResponse::fromEntity);
    }

    public ConsultationResponse getConsultationById(Long id) {
        Consultation consultation = consultationRepository.findActiveById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn với ID: " + id));
        return ConsultationResponse.fromEntity(consultation);
    }

    @Transactional
    public ConsultationResponse updateStatus(Long id, ConsultationStatusUpdateRequest request) {
        Consultation consultation = consultationRepository.findActiveById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn với ID: " + id));

        if (request.getStatus() != null) {
            consultation.setStatus(request.getStatus());
        }
        if (request.getAdminNotes() != null) {
            consultation.setAdminNotes(request.getAdminNotes());
        }

        Consultation updated = consultationRepository.save(consultation);
        return ConsultationResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteConsultation(Long id) {
        Consultation consultation = consultationRepository.findActiveById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn với ID: " + id));
        consultation.setIsDeleted(true);
        consultationRepository.save(consultation);
    }
}

