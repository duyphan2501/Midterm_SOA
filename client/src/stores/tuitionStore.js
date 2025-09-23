import { create } from "zustand";
import axios from "axios";
import API from "../API/api.js";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_GATEWAY_API_URL || "http://localhost:3000";

const useTuitionStore = create((set) => ({
  message: null,
  isLoading: false,
  success: false,
  tuition: null,
  fetchTuition: async (studentId) => {
    set({ isLoading: true, message: null, success: false });
    try {
      const url = `${API_URL}/api/tuitions/get/unpaid/${studentId}`;
      const res = await API.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      set({ message: res.data.message, success: true, tuition: res.data.tuition[0] });
      return res.data.tuition[0];
    } catch (error) {
      console.error("Fetch tuition error:", error);
      set({ message: error.response?.data?.message || "Fetch tuition failed" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTuitionStore;
