package com.shop.shop.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "recipient_name", nullable = false, length = 100)
    private String recipientName;
    @Column(nullable = false, length = 20)
    private String phone;
    @Column(nullable = false, length = 100)
    private String province;
    @Column(nullable = false, length = 100)
    private String district;
    @Column(nullable = false, length = 100)
    private String ward;
    @Column(name = "address_detail", nullable = false, length = 255)
    private String addressDetail;
    @Column(name = "is_default", nullable = false)
    private boolean defaultAddress;
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Address() {}
    public Long getId() { return id; }
    public String getRecipientName() { return recipientName; }
    public String getPhone() { return phone; }
    public String getProvince() { return province; }
    public String getDistrict() { return district; }
    public String getWard() { return ward; }
    public String getAddressDetail() { return addressDetail; }
    public boolean isDefaultAddress() { return defaultAddress; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setUser(User user) { this.user = user; }
    public void setRecipientName(String value) { recipientName = value; }
    public void setPhone(String value) { phone = value; }
    public void setProvince(String value) { province = value; }
    public void setDistrict(String value) { district = value; }
    public void setWard(String value) { ward = value; }
    public void setAddressDetail(String value) { addressDetail = value; }
    public void setDefaultAddress(boolean value) { defaultAddress = value; }
}
