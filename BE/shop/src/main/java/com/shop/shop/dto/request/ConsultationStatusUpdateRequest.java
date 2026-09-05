package com.shop.shop.dto.request;

import com.shop.shop.entity.Consultation;

public class ConsultationStatusUpdateRequest {
    private Consultation.ConsultationStatus status;
    private String adminNotes;

    public ConsultationStatusUpdateRequest() {}

    public Consultation.ConsultationStatus getStatus() { return status; }
    public String getAdminNotes() { return adminNotes; }

    public void setStatus(Consultation.ConsultationStatus status) { this.status = status; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}

