import { X, Lock } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

const OTPScreen = ({ isOpen, onClose, onVerify, isProcessing = false }) => {
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleSubmit = async () => {
    if (!otpCode.trim()) {
      setOtpError("Vui lòng nhập mã OTP");
      return;
    }

    setOtpError("");
    await onVerify(otpCode);
  };

  const handleClose = () => {
    setOtpCode("");
    setOtpError("");
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Lock className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">Xác thực OTP</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và
          nhập mã để hoàn tất giao dịch.
        </p>

        <div className="mb-4">
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="Nhập mã OTP 6 số"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
            maxLength="6"
            autoFocus
          />
          {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isProcessing ? "Đang xác thực..." : "Xác nhận"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-3">
          Mã OTP có hiệu lực trong 5 phút
        </p>
      </div>
    </div>,
    document.body
  );
};

export default OTPScreen;
