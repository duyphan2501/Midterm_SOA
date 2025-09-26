import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "../stores/userStore.js";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

let isLoggingOut = false;

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || "";
      console.log(message);
      console.log(message.toLowerCase().includes("token"));
      if (
        (status === 401 || status === 403) &&
        message.toLowerCase().includes("token") &&
        !isLoggingOut
      ) {
        isLoggingOut = true;

        localStorage.removeItem("accessToken");
        const { clearUser } = useUserStore.getState();
        clearUser();

        toast.info("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
      }
    }

    return Promise.reject(error);
  }
);

export default API;
