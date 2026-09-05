package com.shop.shop.service;

import com.shop.shop.dto.request.AddressRequest;
import com.shop.shop.dto.response.AddressResponse;
import com.shop.shop.entity.Address;
import com.shop.shop.entity.User;
import com.shop.shop.repository.AddressRepository;
import com.shop.shop.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public List<AddressResponse> findAll(String username) {
        return addressRepository.findByUserIdOrderByDefaultAddressDescIdAsc(findUser(username).getId())
                .stream().map(AddressResponse::from).toList();
    }

    public AddressResponse create(String username, AddressRequest request) {
        User user = findUser(username);
        validate(request);
        Address address = new Address();
        address.setUser(user);
        apply(address, request);
        clearDefaultIfNeeded(user.getId(), address);
        return AddressResponse.from(addressRepository.save(address));
    }

    public AddressResponse update(String username, Long id, AddressRequest request) {
        User user = findUser(username);
        validate(request);
        Address address = addressRepository.findByIdAndUserId(id, user.getId()).orElseThrow(this::notFound);
        apply(address, request);
        clearDefaultIfNeeded(user.getId(), address);
        return AddressResponse.from(addressRepository.save(address));
    }

    public void delete(String username, Long id) {
        User user = findUser(username);
        Address address = addressRepository.findByIdAndUserId(id, user.getId()).orElseThrow(this::notFound);
        addressRepository.delete(address);
    }

    private void clearDefaultIfNeeded(Long userId, Address selected) {
        if (!selected.isDefaultAddress()) return;
        List<Address> addresses = addressRepository.findByUserIdOrderByDefaultAddressDescIdAsc(userId);
        addresses.forEach(address -> {
            if (!address.getId().equals(selected.getId())) address.setDefaultAddress(false);
        });
        addressRepository.saveAll(addresses);
    }

    private void apply(Address address, AddressRequest request) {
        address.setRecipientName(request.recipientName().trim());
        address.setPhone(request.phone().trim());
        address.setProvince(request.province().trim());
        address.setDistrict(request.district().trim());
        address.setWard(request.ward().trim());
        address.setAddressDetail(request.addressDetail().trim());
        address.setDefaultAddress(request.defaultAddress());
    }

    private void validate(AddressRequest request) {
        if (request == null || blank(request.recipientName()) || blank(request.phone()) || blank(request.province())
                || blank(request.district()) || blank(request.ward()) || blank(request.addressDetail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All address fields are required");
        }
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private ResponseStatusException notFound() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
    }

    private boolean blank(String value) { return value == null || value.isBlank(); }
}
