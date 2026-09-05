package com.shop.shop.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String subtitle;

    @Column(name = "badge_text", length = 100)
    private String badgeText;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "button_text", length = 100)
    private String buttonText = "Mua Ngay";

    @Column(name = "button_link", length = 255)
    private String buttonLink = "/products";

    @Column(name = "secondary_button_text", length = 100)
    private String secondaryButtonText = "Gửi File Báo Giá";

    @Column(name = "secondary_button_link", length = 255)
    private String secondaryButtonLink = "/consultation";

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BannerStatus status = BannerStatus.ACTIVE;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public Banner() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getSubtitle() { return subtitle; }
    public String getBadgeText() { return badgeText; }
    public String getImageUrl() { return imageUrl; }
    public String getButtonText() { return buttonText; }
    public String getButtonLink() { return buttonLink; }
    public String getSecondaryButtonText() { return secondaryButtonText; }
    public String getSecondaryButtonLink() { return secondaryButtonLink; }
    public Integer getDisplayOrder() { return displayOrder; }
    public BannerStatus getStatus() { return status; }
    public Boolean getIsDeleted() { return isDeleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public void setBadgeText(String badgeText) { this.badgeText = badgeText; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setButtonText(String buttonText) { this.buttonText = buttonText; }
    public void setButtonLink(String buttonLink) { this.buttonLink = buttonLink; }
    public void setSecondaryButtonText(String secondaryButtonText) { this.secondaryButtonText = secondaryButtonText; }
    public void setSecondaryButtonLink(String secondaryButtonLink) { this.secondaryButtonLink = secondaryButtonLink; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public void setStatus(BannerStatus status) { this.status = status; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }
}

