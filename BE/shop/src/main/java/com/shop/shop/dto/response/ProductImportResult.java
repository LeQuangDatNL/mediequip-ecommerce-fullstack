package com.shop.shop.dto.response;

import java.util.List;

public record ProductImportResult(
        int totalRows,
        int successCount,
        int errorCount,
        List<RowError> errors,
        List<ProductResponse> importedProducts
) {
    public record RowError(
            int rowNumber,
            String productName,
            String reason
    ) {}
}

