package com.shop.shop.service;

import com.shop.shop.dto.request.OrderStatusUpdateRequest;
import com.shop.shop.dto.response.OrderResponse;
import com.shop.shop.entity.Order;
import com.shop.shop.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Phân trang, tìm kiếm và lọc trạng thái đơn hàng (chỉ lấy is_deleted = false)
    @Transactional(readOnly = true)
    public Page<OrderResponse> findAll(int page, String keyword, String statusStr) {
        if (page < 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Page must not be negative");
        PageRequest request = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "id"));

        Order.OrderStatus status = null;
        if (statusStr != null && !statusStr.isBlank() && !statusStr.equalsIgnoreCase("ALL")) {
            try {
                status = Order.OrderStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        String search = keyword == null ? "" : keyword.trim();
        return orderRepository.searchOrders(status, search, request).map(OrderResponse::from);
    }

    // Xem chi tiết đơn hàng theo ID
    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        return OrderResponse.from(findOrder(id));
    }

    // Cập nhật trạng thái đơn hàng và thanh toán
    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = findOrder(id);
        if (request.orderStatus() != null) {
            order.setOrderStatus(request.orderStatus());
        }
        if (request.paymentStatus() != null) {
            order.setPaymentStatus(request.paymentStatus());
        }
        if (request.note() != null) {
            order.setNote(request.note());
        }
        return OrderResponse.from(orderRepository.save(order));
    }

    // Xóa mềm / Hủy đơn hàng: is_deleted = true và order_status = CANCELLED
    @Transactional
    public void cancelOrder(Long id) {
        Order order = findOrder(id);
        order.setIsDeleted(true);
        order.setOrderStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    private Order findOrder(Long id) {
        return orderRepository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng #" + id));
    }
}
