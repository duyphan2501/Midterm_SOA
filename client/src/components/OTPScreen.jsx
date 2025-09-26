import { X, Lock, Loader } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import OtpBox from "./OtpBox";
import usePaymentStore from "../stores/paymentStore";
import useUserStore from "../stores/userStore";

const OTPScreen = ({ isOpen, onClose, clearPaymentData }) => {
  const [otpCode, setOtpCode] = useState("");
  const isProcessing = usePaymentStore((state) => state.isProcessing);
  const processPayment = usePaymentStore((state) => state.processPayment);
  const payment = usePaymentStore((state) => state.payment);
  const setUser = useUserStore((state) => state.setUser);

  const sendOtp = usePaymentStore((state) => state.sendOtp);
  const isSending = usePaymentStore((state) => state.isSending);
  const user = useUserStore((state) => state.user);
  const handleClose = () => {
    setOtpCode("");
    onClose();
  };

  const sendOtpAgain = async () => {
    if (isSending) return;
    await sendOtp(user, payment.payment_id);
  };

  const handleSubmit = async () => {
    const user = await processPayment(otpCode, payment);
    if (user) {
      handleClose();
      clearPaymentData();
      setUser(user);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="rounded-lg overflow-hidden shadow-2xl border border-gray-200">
        <div className="bg-white p-6 pb-2 w-96">
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

          <p className="text-gray-600 mb-4 text-sm text-center">
            Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và
            nhập mã để hoàn tất giao dịch.
          </p>

          <div className="mb-4">
            <OtpBox
              length={6}
              onChangeOtp={setOtpCode}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="flex space-x-3">
            <button
              disabled={isProcessing}
              onClick={handleClose}
              className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="cursor-pointer flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isProcessing ? "Đang xác thực..." : "Xác nhận"}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-3">
            Mã OTP có hiệu lực trong 1 phút
          </p>
        </div>
        <div className="text-white py-2 bg-black w-96 flex gap-2 items-center justify-center text-sm">
          <p>Không nhận được mã? </p>
          {isSending ? (
            <Loader className="animate-spin" size={17}/>
          ) : (
            <button className="underline cursor-pointer" onClick={sendOtpAgain}>
              Gửi lại mã OTP
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OTPScreen;
