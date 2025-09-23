import React, { useState } from "react";
import { User, Building2, Lock, Eye, EyeOff, Loader } from "lucide-react";
import useUserStore from "../stores/userStore.js";

const LoginPage = ({ setCurrentPage }) => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const login = useUserStore((state) => state.login);
  const isLogin = useUserStore((state) => state.isLogin);

  const handleSubmit = async () => {
    if (isLogin) return;
    await login(loginData.username.trim(), loginData.password);
    if (useUserStore.getState().user)
      setCurrentPage("payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              iBanking TDTU
            </h1>
            <p className="text-gray-600">
              Hệ thống thanh toán học phí trực tuyến
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!loginData.username || !loginData.password}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLogin ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" />
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
