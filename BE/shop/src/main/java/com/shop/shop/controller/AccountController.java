package com.shop.shop.controller;

import com.shop.shop.dto.request.AccountUpdateRequest;
import com.shop.shop.dto.request.PasswordChangeRequest;
import com.shop.shop.dto.response.UserResponse;
import com.shop.shop.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
@Tag(name = "My Account")
@SecurityRequirement(name = "bearerAuth")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) { this.accountService = accountService; }

    @GetMapping
    @Operation(summary = "View my account")
    public UserResponse getAccount(Authentication authentication) {
        return accountService.getCurrentAccount(authentication.getName());
    }

    @PutMapping
    @Operation(summary = "Update my account except phone")
    public UserResponse updateAccount(Authentication authentication, @Valid @RequestBody AccountUpdateRequest request) {
        return accountService.updateCurrentAccount(authentication.getName(), request);
    }

    @PutMapping("/password")
    @Operation(summary = "Change my password")
    public ResponseEntity<Void> changePassword(Authentication authentication,
                                                @Valid @RequestBody PasswordChangeRequest request) {
        accountService.changePassword(authentication.getName(), request);
        return ResponseEntity.noContent().build();
    }
}
