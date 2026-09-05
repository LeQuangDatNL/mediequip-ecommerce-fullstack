package com.shop.shop.controller;

import com.shop.shop.dto.request.OrderStatusUpdateRequest;
import com.shop.shop.dto.response.OrderResponse;
import com.shop.shop.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@Tag(name = "Admin Orders", description = "Quản lý đơn hàng dành cho Admin")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách đơn hàng có phân trang, tìm kiếm và lọc trạng thái")
    public Page<OrderResponse> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") String status
    ) {
        return orderService.findAll(page, keyword, status);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đơn hàng")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return orderService.findById(id);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái đơn hàng và thanh toán")
    public OrderResponse updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        return orderService.updateStatus(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa mềm / Hủy đơn hàng")
    public void cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
    }
}

