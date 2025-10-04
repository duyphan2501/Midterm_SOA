import { create } from "zustand";
import API from "../API/api.js";
import { toast } from "react-toastify";

const usePaymentStore = create((set) => ({
  isProcessing: false,
  isSending: false,
  payment: null,

  createPayment: async (tuition, payer) => {
    set({ isProcessing: true });
    try {
      const res = await API.post("/payments/create", { tuition, payer });
      set({ payment: res.data.payment });
      toast.info(res.data.message);
    } catch (error) {
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error(error.response?.data?.message || "Create payment failed");
        console.error("Create payment error:", error);
      }
    } finally {
      set({ isProcessing: false });
    }
  },

  processPayment: async (otpCode, payment) => {
    set({ isProcessing: true });
    try {
      const res = await API.put("/payments/process", { otpCode, payment });
      toast.success(res.data.message || "Payment successful");
      set({ payment: null });
      return res.data.payer;
    } catch (error) {
      const message = error.response?.data?.message || "";
      if (!message.toLowerCase().includes("token")) {
        toast.error(message);
        console.error("Process payment error:", error);
      }
      return false;
    } finally {
      set({ isProcessing: false });
    }
  },

  getPaymentHistory: async (payerId) => {
    set({ isProcessing: true });
    try {
      const res = await API.get(`/payments/history/${payerId}`);
      return res.data.payments;
    } catch (error) {
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error(error.response?.data?.message || "Payment failed");
        console.error("Load payment history error", error);
      }
    } finally {
      set({ isProcessing: false });
    }
  },

  sendOtp: async (payer, paymentId) => {
    set({ isSending: true });
    try {
      const res = await API.put("/payments/otp/send", { payer, paymentId });
      toast.success(res.data.message || "Gửi OTP thành công");
    } catch (error) {
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error(error.response?.data?.message || "Send otp failed");
        console.error("Send otp error", error);
      }
    } finally {
      set({ isSending: false });
    }
  },
}));

export default usePaymentStore;
