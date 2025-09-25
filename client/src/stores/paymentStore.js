import { create } from "zustand";
import API from "../API/api.js";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_GATEWAY_API_URL || "http://localhost:3000";

const usePaymentStore = create((set) => ({
  isProcessing: false,
  payment: null,
  createPayment: async (tuition, payer) => {
    set({ isProcessing: true });
    try {
      const url = `${API_URL}/api/payments/create`;
      const res = await API.post(
        url,
        { tuition, payer },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      set({ payment: res.data.payment });
    } catch (error) {
      if (error.response.status !== 401 && error.response.status !== 403) {
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
      const url = `${API_URL}/api/payments/process`;
      const res = await API.put(
        url,
        { otpCode, payment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success(res.data.message && "Payment successful");
      set({ payment: null });
      return res.data.payer;
    } catch (error) {
      if (error.response.status !== 401 || error.response.status !== 403) {
        toast.error(error.response?.data?.message || "Payment failed");
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
      const url = `${API_URL}/api/payments/history/${payerId}`;
      const res = await API.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return res.data.payments;
    } catch (error) {
      if (error.response.status !== 401 && error.response.status !== 403) {
        toast.error(error.response?.data?.message || "Payment failed");
        console.error("Load payment history error", error);
      }
    } finally {
      set({ isProcessing: false });
    }
  },
}));

export default usePaymentStore;
