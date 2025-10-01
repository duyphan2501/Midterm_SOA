import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";
import API from "../API/api.js";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_GATEWAY_API_URL || "http://localhost:3000";

const useUserStore = create((set) => ({
  user: null,
  isLogin: false,
  setUser: (newUser) => set({ user: newUser}),
  clearUser: () => set({ user: null}),
  login: async (username, password) => {
    set({ isLogin: true });
    try {
      const url = `${API_URL}/api/users/login`;
      const res = await axios.post(url, { username, password });
      set({ user: res.data.user });
      localStorage.setItem("accessToken", res.data.accessToken);
      toast.success(res.data.message || "Login successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      set({ isLogin: false });
    }
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem("accessToken");
    toast.info("Đã đăng xuất");
  },
  refreshUser: async () => {
    try {
      const url = `${API_URL}/api/users/refresh`;
      const res = await API.get(url, {
        headers: {  
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      set({ user: res.data.user });
    } catch (error) {
      localStorage.removeItem("accessToken");
    }
  },
}));

export default useUserStore;
