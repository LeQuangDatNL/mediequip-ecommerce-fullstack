package com.shop.shop.dto.response;

import com.shop.shop.entity.Consultation;
import java.time.LocalDateTime;

public class ConsultationResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String fullName;
    private String email;
    private String phone;
    private String title;
    private String content;
    private String attachmentUrl;
    private String attachmentName;
    private String fileType;
    private Long fileSize;
    private Consultation.ConsultationStatus status;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ConsultationResponse() {}

    public static ConsultationResponse fromEntity(Consultation consultation) {
        ConsultationResponse res = new ConsultationResponse();
        res.setId(consultation.getId());
        if (consultation.getUser() != null) {
            res.setUserId(consultation.getUser().getId());
            res.setUserName(consultation.getUser().getFullName() != null ? consultation.getUser().getFullName() : consultation.getUser().getUsername());
        }
        res.setFullName(consultation.getFullName());
        res.setEmail(consultation.getEmail());
        res.setPhone(consultation.getPhone());
        res.setTitle(consultation.getTitle());
        res.setContent(consultation.getContent());
        res.setAttachmentUrl(consultation.getAttachmentUrl());
        res.setAttachmentName(consultation.getAttachmentName());
        res.setFileType(consultation.getFileType());
        res.setFileSize(consultation.getFileSize());
        res.setStatus(consultation.getStatus());
        res.setAdminNotes(consultation.getAdminNotes());
        res.setCreatedAt(consultation.getCreatedAt());
        res.setUpdatedAt(consultation.getUpdatedAt());
        return res;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getAttachmentUrl() { return attachmentUrl; }
    public String getAttachmentName() { return attachmentName; }
    public String getFileType() { return fileType; }
    public Long getFileSize() { return fileSize; }
    public Consultation.ConsultationStatus getStatus() { return status; }
    public String getAdminNotes() { return adminNotes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setUserName(String userName) { this.userName = userName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
    public void setAttachmentName(String attachmentName) { this.attachmentName = attachmentName; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public void setStatus(Consultation.ConsultationStatus status) { this.status = status; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

