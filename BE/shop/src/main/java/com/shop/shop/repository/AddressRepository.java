package com.shop.shop.repository;

import com.shop.shop.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserIdOrderByDefaultAddressDescIdAsc(Long userId);
    Optional<Address> findByIdAndUserId(Long id, Long userId);
}
