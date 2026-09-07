package com.shop.shop.controller;

import com.shop.shop.dto.request.OrderCreateRequest;
import com.shop.shop.dto.response.OrderResponse;
import com.shop.shop.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Customer Orders", description = "API Đặt hàng, theo dõi tiến độ và xuất bảng báo giá cho Khách hàng")
public class CustomerOrderController {

    private final OrderService orderService;

    public CustomerOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Đặt hàng hoặc gửi yêu cầu báo giá dự án (Hỗ trợ cả khách đăng nhập & khách vãng lai)")
    public OrderResponse createOrder(
            @Valid @RequestBody OrderCreateRequest request,
            Authentication authentication
    ) {
        String username = authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")
                ? authentication.getName()
                : null;
        return orderService.createOrder(request, username);
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Lấy lịch sử danh sách đơn hàng của tài khoản đang đăng nhập")
    public List<OrderResponse> getMyOrders(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            return List.of();
        }
        return orderService.getMyOrders(authentication.getName());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đơn hàng")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return orderService.findById(id);
    }

    @GetMapping("/track")
    @Operation(summary = "Tra cứu nhanh tiến độ đơn hàng theo Mã đơn và Số điện thoại")
    public OrderResponse trackOrder(
            @RequestParam Long orderId,
            @RequestParam String phone
    ) {
        return orderService.trackOrder(orderId, phone);
    }

    @GetMapping("/{id}/quotation")
    @Operation(summary = "Tải bảng báo giá thiết bị y tế định dạng Excel (.xlsx) cho đơn hàng")
    public ResponseEntity<byte[]> downloadQuotation(@PathVariable Long id) {
        byte[] excelBytes = orderService.exportQuotationExcel(id);
        String filename = "Bao_Gia_Thiet_Bi_Y_Te_Kim_Lien_Don_" + id + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }
}
