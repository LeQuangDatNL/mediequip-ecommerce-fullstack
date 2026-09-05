package com.shop.shop.service;

import com.shop.shop.dto.request.BatchImageRequest;
import com.shop.shop.dto.response.ImageMediaResponse;
import com.shop.shop.entity.ImageMedia;
import com.shop.shop.repository.ImageMediaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImageMediaService {

    private final ImageMediaRepository imageMediaRepository;
    private final FileStorageService fileStorageService;

    public ImageMediaService(ImageMediaRepository imageMediaRepository, FileStorageService fileStorageService) {
        this.imageMediaRepository = imageMediaRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public Page<ImageMediaResponse> findAll(int page, int size, String keyword) {
        if (page < 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Page must not be negative");
        PageRequest pageRequest = PageRequest.of(page, size > 0 ? size : 12, Sort.by(Sort.Direction.DESC, "id"));
        String search = keyword == null ? "" : keyword.trim();
        return imageMediaRepository.findActiveImages(search, pageRequest).map(ImageMediaResponse::from);
    }

    @Transactional(readOnly = true)
    public ImageMediaResponse findById(Long id) {
        ImageMedia image = imageMediaRepository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy ảnh"));
        return ImageMediaResponse.from(image);
    }

    @Transactional
    public List<ImageMediaResponse> uploadMultipleFiles(MultipartFile[] files) {
        if (files == null || files.length == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh sách file tải lên không được rỗng");
        }

        List<ImageMedia> savedEntities = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                try {
                    FileStorageService.StoredFile stored = fileStorageService.storeFile(file);
                    ImageMedia imageMedia = new ImageMedia(
                            stored.name(),
                            stored.url(),
                            stored.fileType(),
                            stored.size()
                    );
                    savedEntities.add(imageMediaRepository.save(imageMedia));
                } catch (IOException e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lưu file: " + file.getOriginalFilename());
                }
            }
        }

        return savedEntities.stream().map(ImageMediaResponse::from).toList();
    }

    @Transactional
    public List<ImageMediaResponse> addBatchUrls(BatchImageRequest request) {
        if (request == null || request.images() == null || request.images().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh sách URL ảnh không được rỗng");
        }

        List<ImageMedia> savedEntities = new ArrayList<>();
        for (BatchImageRequest.ImageItemRequest item : request.images()) {
            if (item.url() != null && !item.url().isBlank()) {
                String name = (item.name() != null && !item.name().isBlank()) ? item.name().trim() : "Image-" + System.currentTimeMillis();
                ImageMedia imageMedia = new ImageMedia(
                        name,
                        item.url().trim(),
                        item.fileType() != null ? item.fileType().trim() : "image/jpeg",
                        item.fileSize() != null ? item.fileSize() : 0L
                );
                savedEntities.add(imageMediaRepository.save(imageMedia));
            }
        }

        return savedEntities.stream().map(ImageMediaResponse::from).toList();
    }

    @Transactional
    public void delete(Long id) {
        ImageMedia image = imageMediaRepository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy ảnh cần xóa"));
        image.setIsDeleted(true);
        imageMediaRepository.save(image);
    }
}

