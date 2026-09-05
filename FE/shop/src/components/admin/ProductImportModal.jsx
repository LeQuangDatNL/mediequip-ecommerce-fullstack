import React, { useState, useRef } from 'react';
import productService from '../../services/productService';
import {
  FileSpreadsheet,
  Download,
  UploadCloud,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
  Info,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Tải file mẫu
  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      await productService.downloadExcelTemplate();
      toast.success('Đã tải file mẫu Excel thành công!');
    } catch (error) {
      console.error('Lỗi khi tải file mẫu:', error);
      toast.error('Không thể tải file mẫu. Vui lòng thử lại!');
    } finally {
      setDownloading(false);
    }
  };

  // Kéo thả file
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      toast.error('Vui lòng chọn file Excel định dạng .xlsx hoặc .xls!');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 25MB!');
      return;
    }

    setSelectedFile(file);
    setResult(null);
  };

  // Tiến hành upload & import
  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file Excel trước khi tiến hành!');
      return;
    }

    setLoading(true);
    try {
      const data = await productService.importProductsExcel(selectedFile);
      setResult(data);
      if (data.successCount > 0) {
        toast.success(`Đã thêm thành công ${data.successCount} sản phẩm!`);
        if (onSuccess) onSuccess();
      } else if (data.errorCount > 0) {
        toast.error(`Không thể nhập dữ liệu: ${data.errorCount} lỗi phát hiện.`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi nhập file Excel!';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Thêm Sản Phẩm Hàng Loạt (Excel Import)</h2>
              <p className="text-xs text-gray-500">Tải file mẫu, điền dữ liệu và tải lên để thêm nhiều sản phẩm cùng lúc.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Bước 1: Tải File Mẫu */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Bước 1: Tải file mẫu Excel chuẩn</span>
                </div>
                <p className="text-[11px] text-indigo-700/80 leading-relaxed">
                  File mẫu gồm <strong>Sheet 1</strong> (Mẫu nhập sản phẩm) và <strong>Sheet 2</strong> (Danh mục tham khảo sẵn có). Vui lòng điền đúng cấu trúc cột để hệ thống nhận diện.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0 disabled:opacity-50"
              >
                {downloading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Tải File Mẫu (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Bước 2: Chọn File Tải Lên */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">
              Bước 2: Tải lên file Excel đã điền dữ liệu
            </label>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                  : selectedFile
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-emerald-200 shadow-xs">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-800 truncate max-w-xs sm:max-w-md">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Sẵn sàng nhập
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-700">
                      Kéo thả file Excel vào đây hoặc <span className="text-indigo-600 underline">duyệt từ máy</span>
                    </p>
                    <p className="text-[11px] text-gray-400">Hỗ trợ định dạng .xlsx, .xls (Tối đa 25MB)</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Báo cáo kết quả Import */}
          {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <span className="text-[10px] text-gray-500 uppercase font-medium">Tổng số dòng</span>
                  <p className="text-lg font-bold text-gray-800">{result.totalRows}</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <span className="text-[10px] text-emerald-700 uppercase font-medium">Thành công</span>
                  <p className="text-lg font-bold text-emerald-600">{result.successCount}</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-center">
                  <span className="text-[10px] text-red-700 uppercase font-medium">Lỗi / Bỏ qua</span>
                  <p className="text-lg font-bold text-red-600">{result.errorCount}</p>
                </div>
              </div>

              {/* Chi tiết lỗi */}
              {result.errors && result.errors.length > 0 && (
                <div className="p-4 bg-red-50/70 border border-red-100 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Chi tiết các dòng bị lỗi ({result.errors.length}):</span>
                  </div>
                  <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                    {result.errors.map((err, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white rounded-xl border border-red-100 text-xs flex items-start gap-2 shadow-2xs"
                      >
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold shrink-0">
                          Dòng {err.rowNumber}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{err.productName}</p>
                          <p className="text-[11px] text-red-600">{err.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-slate-50/70">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            {result ? 'Đóng' : 'Hủy bỏ'}
          </button>

          {!result ? (
            <button
              type="button"
              onClick={handleImport}
              disabled={loading || !selectedFile}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý Excel...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Bắt đầu nhập dữ liệu</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Hoàn tất</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImportModal;

