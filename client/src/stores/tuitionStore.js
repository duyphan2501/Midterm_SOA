import { create } from "zustand";
import API from "../API/api.js";
import { toast } from "react-toastify";

const useTuitionStore = create((set) => ({
  message: null,
  isLoading: false,
  success: false,
  tuition: null,

  fetchTuition: async (studentId) => {
    set({ isLoading: true, message: null, success: false });
    try {
      const res = await API.get(`/tuitions/get/unpaid/${studentId}`);
      set({
        message: res.data.message,
        success: true,
        tuition: res.data.tuition[0],
      });
      return res.data.tuition[0];
    } catch (error) {
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        set({
          message: error.response?.data?.message || "Fetch tuition failed",
        });
        console.error("Fetch tuition error:", error);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  getTuitionInfo: async (tuitionId) => {
    try {
      const res = await API.get(`/tuitions/get/${tuitionId}`);
      return res.data.tuition;
    } catch (error) {
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        console.error("Get tuition info error:", error);
        toast.error(error.response?.data?.message || "Get tuition info error");
      }
    }
  },
}));

export default useTuitionStore;
