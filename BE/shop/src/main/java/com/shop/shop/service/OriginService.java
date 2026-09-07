package com.shop.shop.service;

import com.shop.shop.dto.request.OriginRequest;
import com.shop.shop.dto.response.OriginResponse;
import com.shop.shop.entity.Origin;
import com.shop.shop.repository.OriginRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class OriginService {
    private final OriginRepository originRepository;

    public OriginService(OriginRepository originRepository) {
        this.originRepository = originRepository;
    }

    @Transactional(readOnly = true)
    public List<OriginResponse> findAllActive() {
        return originRepository.findAllActive(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(OriginResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OriginResponse findById(Long id) {
        return OriginResponse.from(findOrigin(id));
    }

    @Transactional
    public OriginResponse create(OriginRequest request) {
        validate(request, null);
        Origin origin = new Origin();
        origin.setName(request.name().trim());
        origin.setCode(request.code() != null ? request.code().trim().toUpperCase() : null);
        origin.setDescription(request.description() != null ? request.description().trim() : null);
        origin.setStatus(request.status() != null ? request.status() : Origin.Status.ACTIVE);
        origin.setIsDeleted(false);
        return OriginResponse.from(originRepository.save(origin));
    }

    @Transactional
    public OriginResponse update(Long id, OriginRequest request) {
        Origin origin = findOrigin(id);
        validate(request, id);
        origin.setName(request.name().trim());
        origin.setCode(request.code() != null ? request.code().trim().toUpperCase() : null);
        origin.setDescription(request.description() != null ? request.description().trim() : null);
        if (request.status() != null) {
            origin.setStatus(request.status());
        }
        return OriginResponse.from(originRepository.save(origin));
    }

    @Transactional
    public void delete(Long id) {
        Origin origin = findOrigin(id);
        origin.setIsDeleted(true);
        origin.setStatus(Origin.Status.INACTIVE);
        originRepository.save(origin);
    }

    private Origin findOrigin(Long id) {
        return originRepository.findActiveById(id).orElseThrow(this::notFound);
    }

    private void validate(OriginRequest request, Long id) {
        if (request == null || request.name() == null || request.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên xuất xứ/quốc gia không được để trống");
        }
        String name = request.name().trim();
        if ((id == null && originRepository.existsByNameAndIsDeletedFalse(name))
                || (id != null && originRepository.existsByNameAndIdNotAndIsDeletedFalse(name, id))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tên xuất xứ/quốc gia này đã tồn tại");
        }
    }

    private ResponseStatusException notFound() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy xuất xứ/quốc gia yêu cầu");
    }
}

