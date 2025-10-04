import { create } from "zustand";
import { toast } from "react-toastify";
import API from "../API/api.js";

const useUserStore = create((set) => ({
  user: null,
  isLogin: false,

  setUser: (newUser) => set({ user: newUser }),
  clearUser: () => set({ user: null }),

  login: async (username, password) => {
    set({ isLogin: true });
    try {
      const res = await API.post("/users/login", { username, password });
      set({ user: res.data.user }); 
      toast.success(res.data.message || "Đăng nhập thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại");
      console.error("Login error:", error);
    } finally {
      set({ isLogin: false });
    }
  },

  logout: async () => {
    try {
      await API.delete("/users/logout"); 
    } catch (err) {
      console.error(err);
    }
    set({ user: null });
    toast.info("Đã đăng xuất");
  },

  refreshUser: async () => {
    try {
      const res = await API.get("/users/refresh"); 
      set({ user: res.data.user });
    } catch (error) {
      set({ user: null });
      console.error(error);
    }
  },
}));

export default useUserStore;
