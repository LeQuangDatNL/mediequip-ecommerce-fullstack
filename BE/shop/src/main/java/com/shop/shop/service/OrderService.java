package com.shop.shop.service;

import com.shop.shop.dto.request.OrderCreateRequest;
import com.shop.shop.dto.request.OrderItemRequest;
import com.shop.shop.dto.request.OrderStatusUpdateRequest;
import com.shop.shop.dto.response.OrderResponse;
import com.shop.shop.entity.*;
import com.shop.shop.repository.AddressRepository;
import com.shop.shop.repository.OrderRepository;
import com.shop.shop.repository.ProductRepository;
import com.shop.shop.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final OrderExcelService orderExcelService;

    public OrderService(
            OrderRepository orderRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            ProductRepository productRepository,
            OrderExcelService orderExcelService
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.productRepository = productRepository;
        this.orderExcelService = orderExcelService;
    }

    // 1. Phân trang, tìm kiếm và lọc trạng thái đơn hàng (Dành cho Admin)
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

    // 2. Xem chi tiết đơn hàng theo ID
    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        return OrderResponse.from(findOrder(id));
    }

    // 3. Khách hàng tạo đơn hàng / gửi yêu cầu báo giá dự án (Logged in hoặc Khách vãng lai)
    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request, String currentUsername) {
        User customerUser;
        if (currentUsername != null && !currentUsername.isBlank()) {
            customerUser = userRepository.findActiveByUsername(currentUsername)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Người dùng không tồn tại"));
        } else {
            // Tìm hoặc tạo tài khoản vãng lai mặc định
            customerUser = userRepository.findByUsername("guest").orElseGet(() -> {
                User guest = new User();
                guest.setUsername("guest");
                guest.setEmail("guest@mediequip.vn");
                guest.setPasswordHash("$2a$10$eO0V4h90mP0Bv/8xR9WpG.4m6K2G279dY4F/hN.a3a2h3y5V7");
                guest.setFullName("Khách Hàng Vãng Lai");
                guest.setPhone(request.phone());
                guest.setRole(User.Role.CUSTOMER);
                guest.setStatus(User.Status.ACTIVE);
                guest.setIsDeleted(false);
                return userRepository.save(guest);
            });
        }

        // Xử lý địa chỉ giao hàng
        Address orderAddress = null;
        if (request.addressId() != null) {
            orderAddress = addressRepository.findById(request.addressId()).orElse(null);
        }

        if (orderAddress == null) {
            orderAddress = new Address();
            orderAddress.setUser(customerUser);
            orderAddress.setRecipientName(request.recipientName());
            orderAddress.setPhone(request.phone());
            orderAddress.setProvince(request.province() != null && !request.province().isBlank() ? request.province() : "TP. Hồ Chí Minh");
            orderAddress.setDistrict(request.district() != null ? request.district() : "");
            orderAddress.setWard(request.ward() != null ? request.ward() : "");
            orderAddress.setAddressDetail(
                    request.addressDetail() != null && !request.addressDetail().isBlank()
                            ? request.addressDetail()
                            : (request.address() != null && !request.address().isBlank() ? request.address() : "Giao tận nơi theo thỏa thuận")
            );
            orderAddress.setDefaultAddress(false);
            orderAddress = addressRepository.save(orderAddress);
        }

        // Tạo Entity Order
        Order order = new Order();
        order.setUser(customerUser);
        order.setAddress(orderAddress);

        // Xử lý phương thức thanh toán
        if ("QR".equalsIgnoreCase(request.paymentMethod()) || "VNPAY".equalsIgnoreCase(request.paymentMethod())) {
            order.setPaymentMethod(Order.PaymentMethod.VNPAY);
        } else {
            order.setPaymentMethod(Order.PaymentMethod.COD);
        }
        order.setPaymentStatus(Order.PaymentStatus.UNPAID);
        order.setOrderStatus(Order.OrderStatus.PENDING);
        order.setNote(request.note());
        order.setIsDeleted(false);

        // Tạo danh sách OrderItems và tính tổng tiền
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        if (request.items() == null || request.items().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng phải chứa ít nhất 1 sản phẩm");
        }

        for (OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findActiveById(itemReq.productId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm #" + itemReq.productId()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setPrice(product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO);
            item.setQuantity(itemReq.quantity() != null && itemReq.quantity() > 0 ? itemReq.quantity() : 1);

            BigDecimal lineTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(lineTotal);
            items.add(item);
        }

        order.setItems(items);
        order.setSubtotal(subtotal);
        order.setShippingFee(BigDecimal.ZERO);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setTotalAmount(subtotal);

        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    // 4. Lấy danh sách đơn hàng của khách hàng đang đăng nhập
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String username) {
        User user = userRepository.findActiveByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Người dùng không tồn tại"));
        return orderRepository.findByUserIdAndIsDeletedFalseOrderByIdDesc(user.getId())
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    // 5. Tra cứu đơn hàng công khai theo Mã đơn và Số điện thoại
    @Transactional(readOnly = true)
    public OrderResponse trackOrder(Long orderId, String phone) {
        String cleanPhone = phone == null ? "" : phone.trim().replaceAll("[^0-9]", "");
        Order order = orderRepository.findActiveById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng #" + orderId));

        String orderPhone = order.getAddress() != null ? order.getAddress().getPhone() : "";
        String userPhone = order.getUser() != null ? order.getUser().getPhone() : "";

        if (cleanPhone.isEmpty() || (!orderPhone.contains(cleanPhone) && !userPhone.contains(cleanPhone))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Số điện thoại không khớp với thông tin đặt đơn #" + orderId);
        }

        return OrderResponse.from(order);
    }

    // 6. Xuất bảng báo giá Excel (.xlsx) cho đơn hàng
    @Transactional(readOnly = true)
    public byte[] exportQuotationExcel(Long orderId) {
        Order order = findOrder(orderId);
        return orderExcelService.generateQuotationExcel(order);
    }

    // 7. Cập nhật trạng thái đơn hàng và thanh toán (Admin)
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
        if (request.shippingFee() != null) {
            order.setShippingFee(request.shippingFee());
        }
        if (request.discountAmount() != null) {
            order.setDiscountAmount(request.discountAmount());
        }
        if (request.totalAmount() != null) {
            order.setTotalAmount(request.totalAmount());
        } else if (request.shippingFee() != null || request.discountAmount() != null) {
            BigDecimal sub = order.getSubtotal() != null ? order.getSubtotal() : BigDecimal.ZERO;
            BigDecimal ship = order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO;
            BigDecimal disc = order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO;
            order.setTotalAmount(sub.add(ship).subtract(disc));
        }
        return OrderResponse.from(orderRepository.save(order));
    }

    // 8. Xóa mềm / Hủy đơn hàng
    @Transactional
    public void cancelOrder(Long id) {
        Order order = findOrder(id);
        order.setIsDeleted(true);
        order.setOrderStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    public Order findOrder(Long id) {
        return orderRepository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng #" + id));
    }
}
