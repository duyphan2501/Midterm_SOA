import { create } from "zustand";
import axios from "axios";
import API from "../API/api.js";
import { toast } from "react-toastify";

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
      set({
        message: res.data.message,
        success: true,
        tuition: res.data.tuition[0],
      });
      return res.data.tuition[0];
    } catch (error) {
      if (error.response.status !== 401 && error.response.status !== 403) {
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
      const url = `${API_URL}/api/tuitions/get/${tuitionId}`;
      const res = await API.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return res.data.tuition;
    } catch (error) {
      if (error.response.status !== 401 && error.response.status !== 403) {
        console.error("Get tuition info error:", error);
        toast.error(error.response?.data?.message || "Get tuition info error");
      }
    }
  },
}));

export default useTuitionStore;
