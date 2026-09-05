package com.shop.shop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ConsultationRequest {
    private Long userId;

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(min = 2, max = 100, message = "Họ và tên phải từ 2 đến 100 ký tự")
    private String fullName;

    @Pattern(regexp = "^$|^[A-Za-z0-9+_.-]+@(.+)$", message = "Email không đúng định dạng (VD: name@domain.com)")
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Số điện thoại không hợp lệ (Phải là số di động VN 10 chữ số, VD: 0901234567)")
    private String phone;

    @NotBlank(message = "Tiêu đề yêu cầu không được để trống")
    @Size(min = 5, max = 200, message = "Tiêu đề phải từ 5 đến 200 ký tự")
    private String title;

    @NotBlank(message = "Nội dung yêu cầu không được để trống")
    @Size(min = 10, max = 2000, message = "Nội dung yêu cầu phải từ 10 đến 2000 ký tự")
    private String content;

    public ConsultationRequest() {}

    public Long getUserId() { return userId; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getTitle() { return title; }
    public String getContent() { return content; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
}

