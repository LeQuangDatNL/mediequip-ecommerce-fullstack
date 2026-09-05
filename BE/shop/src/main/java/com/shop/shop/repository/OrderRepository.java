package com.shop.shop.repository;

import com.shop.shop.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"user", "address"})
    @Query("SELECT o FROM Order o " +
           "WHERE o.isDeleted = false " +
           "AND (:status IS NULL OR o.orderStatus = :status) " +
           "AND (:keyword IS NULL OR :keyword = '' " +
           "     OR LOWER(o.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR o.user.phone LIKE CONCAT('%', :keyword, '%') " +
           "     OR o.address.recipientName LIKE CONCAT('%', :keyword, '%') " +
           "     OR o.address.phone LIKE CONCAT('%', :keyword, '%'))")
    Page<Order> searchOrders(
            @Param("status") Order.OrderStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"user", "address", "items"})
    @Query("SELECT o FROM Order o WHERE o.id = :id AND o.isDeleted = false")
    Optional<Order> findActiveById(@Param("id") Long id);
}
