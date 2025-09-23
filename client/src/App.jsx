import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar, { MobileHeader } from "./layouts/Sidebar";
import PaymentHistory from "./pages/PaymentHistory.jsx";
import PaymentPage from "./pages/PaymentForm.jsx";
import Login from "./pages/Login.jsx";
import { ToastContainer, Bounce } from "react-toastify";
import useUserStore from "./stores/userStore.js";
import { useEffect, useState } from "react";
import Loading from "./components/Loading.jsx";
import OTPScreen from "./components/OTPScreen.jsx";

function App() {
  const user = useUserStore((state) => state.user);
  const refreshUser = useUserStore((state) => state.refreshUser);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("payment");

  useEffect(() => {
    const initUser = async () => {
      await refreshUser();
      setLoading(false);
    };
    initUser();
  }, []);

  if (loading) return <Loading />;

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            user ? (
              <div
                className={`flex h-screen bg-gray-100 transition-all duration-300 ${
                  otpDialogOpen ? "blur-sm pointer-events-none" : ""
                }`}
              >
                <Sidebar
                  user={user}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  open={sidebarOpen}
                  onToggle={() => setSidebarOpen(false)}
                />

                <div className="flex-1 overflow-auto">
                  <MobileHeader onToggle={() => setSidebarOpen(true)} />

                  <div
                    className="min-h-screen"
                    style={{ backgroundColor: "#F3F2EC" }}
                  >
                    <div className="max-w-6xl mx-auto px-6 py-8">
                      {currentPage === "payment" ? (
                        <PaymentPage
                          user={user}
                          onOtpDialogChange={setOtpDialogOpen}
                        />
                      ) : currentPage === "history" ? (
                        <PaymentHistory />
                      ) : (
                        <Loading />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
