import React, { useState } from "react";
import Sidebar, { MobileHeader } from "./layouts/Sidebar";
import PaymentHistory from "./pages/PaymentHistory.jsx";
import PaymentPage from "./pages/PaymentForm.jsx";
import Login from "./pages/Login.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("payment");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);

  const userData = {
    fullName: "Nguyễn Văn A",
    phone: "0123456789",
    email: "a@tdtu.edu.vn",
    balance: 1112500000,
  };

  const handleLogout = () => {
    alert("Đăng xuất thành công!");
  };

  return (
    <div
      className={`flex h-screen bg-gray-100 transition-all duration-300 ${
        otpDialogOpen ? "blur-sm pointer-events-none" : ""
      }`}
    >
      <Sidebar
        user={userData}
        onLogout={handleLogout}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
      />

      <div className="flex-1 overflow-auto">
        <MobileHeader onToggle={() => setSidebarOpen(true)} />

        <div className="min-h-screen" style={{ backgroundColor: "#F3F2EC" }}>
          <div className="max-w-6xl mx-auto px-6 py-8">
            {currentPage === "payment" ? (
              <PaymentPage
                user={userData}
                onOtpDialogChange={setOtpDialogOpen}
              />
            ) : (
              <PaymentHistory />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// function App() {
// return <Login />;
// }
export default App;
