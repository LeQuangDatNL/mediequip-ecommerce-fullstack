package com.shop.shop.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public ProductImage() {}

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public String getImageUrl() { return imageUrl; }
    public Boolean getIsPrimary() { return isPrimary; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setProduct(Product product) { this.product = product; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }
}

