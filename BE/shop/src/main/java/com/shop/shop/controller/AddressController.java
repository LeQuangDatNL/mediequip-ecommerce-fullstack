package com.shop.shop.controller;

import com.shop.shop.dto.request.AddressRequest;
import com.shop.shop.dto.response.AddressResponse;
import com.shop.shop.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/me/addresses")
@Tag(name = "My Addresses")
@SecurityRequirement(name = "bearerAuth")
public class AddressController {
    private final AddressService addressService;

    public AddressController(AddressService addressService) { this.addressService = addressService; }

    @GetMapping
    @Operation(summary = "View my addresses")
    public List<AddressResponse> findAll(Authentication authentication) {
        return addressService.findAll(authentication.getName());
    }

    @PostMapping
    @Operation(summary = "Add an address")
    public AddressResponse create(Authentication authentication, @Valid @RequestBody AddressRequest request) {
        return addressService.create(authentication.getName(), request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update my address")
    public AddressResponse update(Authentication authentication, @PathVariable Long id,
                                  @Valid @RequestBody AddressRequest request) {
        return addressService.update(authentication.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete my address")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        addressService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
