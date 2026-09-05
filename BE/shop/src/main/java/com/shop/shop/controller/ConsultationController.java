package com.shop.shop.controller;

import com.shop.shop.dto.request.ConsultationRequest;
import com.shop.shop.dto.request.ConsultationStatusUpdateRequest;
import com.shop.shop.dto.response.ConsultationResponse;
import com.shop.shop.entity.Consultation;
import com.shop.shop.security.RateLimitService;
import com.shop.shop.service.ConsultationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Tag(name = "Consultations", description = "API Tư vấn và Gửi file yêu cầu báo giá y tế")
@RestController
@RequestMapping("/api")
public class ConsultationController {

    private final ConsultationService consultationService;
    private final RateLimitService rateLimitService;

    public ConsultationController(ConsultationService consultationService, RateLimitService rateLimitService) {
        this.consultationService = consultationService;
        this.rateLimitService = rateLimitService;
    }

    @Operation(summary = "Khách hàng gửi yêu cầu tư vấn / báo giá kèm file đính kèm (Public)")
    @PostMapping(value = "/consultations", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ConsultationResponse> createConsultation(
            @RequestParam("fullName") String fullName,
            @RequestParam("phone") String phone,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest httpRequest
    ) {
        String clientIp = getClientIp(httpRequest);
        // Chống spam: Tối đa 5 yêu cầu / 10 phút, giãn cách 10s giữa 2 lần gửi
        if (!rateLimitService.allowRequest("consultation_" + clientIp, 5, 600, 10)) {
            long remainingCooldown = rateLimitService.getRemainingCooldownSeconds("consultation_" + clientIp, 10);
            String waitMsg = remainingCooldown > 0
                    ? "Vui lòng đợi " + remainingCooldown + " giây trước khi gửi tiếp."
                    : "Bạn đã vượt quá giới hạn gửi yêu cầu (5 lần/10 phút). Vui lòng thử lại sau.";
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, waitMsg);
        }

        ConsultationRequest request = new ConsultationRequest();
        request.setFullName(fullName);
        request.setPhone(phone);
        request.setEmail(email);
        request.setTitle(title);
        request.setContent(content);
        request.setUserId(userId);

        ConsultationResponse response = consultationService.createConsultation(request, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private String getClientIp(HttpServletRequest request) {
        if (request == null) return "127.0.0.1";
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        String xReal = request.getHeader("X-Real-IP");
        if (xReal != null && !xReal.isBlank()) {
            return xReal.trim();
        }
        return request.getRemoteAddr();
    }

    @Operation(summary = "Admin xem danh sách yêu cầu tư vấn / báo giá (Phân trang & Lọc)")
    @GetMapping("/admin/consultations")
    public ResponseEntity<Page<ConsultationResponse>> getAllConsultations(
            @RequestParam(value = "status", required = false) Consultation.ConsultationStatus status,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<ConsultationResponse> result = consultationService.getAllConsultations(status, keyword, page, size);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Admin xem chi tiết một yêu cầu tư vấn")
    @GetMapping("/admin/consultations/{id}")
    public ResponseEntity<ConsultationResponse> getConsultationById(@PathVariable Long id) {
        ConsultationResponse response = consultationService.getConsultationById(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Admin cập nhật trạng thái & ghi chú xử lý yêu cầu")
    @PutMapping("/admin/consultations/{id}/status")
    public ResponseEntity<ConsultationResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody ConsultationStatusUpdateRequest request
    ) {
        ConsultationResponse response = consultationService.updateStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Admin xóa mềm yêu cầu tư vấn")
    @DeleteMapping("/admin/consultations/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.noContent().build();
    }
}

