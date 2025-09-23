import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore.js";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// interceptor response
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // xoá token
      localStorage.removeItem("accessToken");
      const { clearUser } = useUserStore.getState();
      clearUser();

      // thông báo
      toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");

      // reload hoặc redirect
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default API;
