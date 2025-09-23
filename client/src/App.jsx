import { useState } from "react";
import Sidebar, { MobileHeader } from "./layouts/Sidebar";
import PaymentHistory from "./pages/PaymentHistory.jsx";
import PaymentPage from "./pages/PaymentForm.jsx";
import Login from "./pages/Login.jsx";
import { ToastContainer, Bounce } from "react-toastify";
import useUserStore from "./stores/userStore.js";
import { useEffect } from "react";
import Loading from "./components/Loading.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const user = useUserStore((state) => state.user);
  const refreshUser = useUserStore((state) => state.refreshUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      await refreshUser();
      setLoading(false);
    };
    initUser();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setCurrentPage("login");
      setUserData(null);
    } else {
      if (userData !== user) setUserData(user); 
      setCurrentPage((prev) => prev || "payment"); 
    } 
  }, [loading, user]);

  return (
    <>
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
      {currentPage === "login" ? (
        <Login setCurrentPage={setCurrentPage} />
      ) : (
        <div
          className={`flex h-screen bg-gray-100 transition-all duration-300 ${
            otpDialogOpen ? "blur-sm pointer-events-none" : ""
          }`}
        >
          <Sidebar
            user={userData}
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
                    user={userData}
                    onOtpDialogChange={setOtpDialogOpen}
                  />
                ) : currentPage === "history" ?(
                  <PaymentHistory />
                ) : (<Loading />)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
