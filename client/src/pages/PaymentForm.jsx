import { GraduationCap, CheckCircle } from "lucide-react";
import { useState } from "react";
import StudentInfoForm from "../components/StudentInfo";
import PaymentInfo from "../components/PaymentInfo";
import TermsAgreement from "../components/TermAgreement";
import PaymentStatus from "../components/PaymentStatus";
import OTPScreen from "../components/OTPScreen";

const PaymentPage = ({ user, onOtpDialogChange }) => {
  const [paymentData, setPaymentData] = useState({
    studentId: "",
    acceptTerms: false,
  });

  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  const updateOtpDialog = (isOpen) => {
    setShowOtpDialog(isOpen);
    if (onOtpDialogChange) {
      onOtpDialogChange(isOpen);
    }
  };

  const mockStudentData = {
    523: {
      name: "Trần Thị Bình",
      tuitionFee: 12500000,
    },
  };

  const [studentInfo, setStudentInfo] = useState({
    name: "",
    tuitionFee: 0,
  });

  const handleSearchStudent = (studentId) => {
    
  };

  const isFormValid = () => {
    return (
      paymentData.studentId &&
      paymentData.acceptTerms &&
      studentInfo &&
      studentInfo.tuitionFee <= user.balance
    );
  };

  // Mock constants and functions
  const DEMO_OTP = "123456";
  const DEMO_EMAIL = "user****@gmail.com";

  const sendOtp = (studentId, amount) => {
    
  };

  const verifyOtpAndPay = (studentId, amount, otp) => {
    
  };

  const handlePayment = async () => {
    
  };

  const handleOtpVerify = async (otp) => {
    
  };

  const closeOtpDialog = () => {
    updateOtpDialog(false);
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center mb-8">
          <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">
            Thanh toán học phí
          </h2>
        </div>

        <StudentInfoForm
          paymentData={paymentData}
          setPaymentData={setPaymentData}
          studentInfo={studentInfo}
          onSearchStudent={handleSearchStudent}
        />

        <>
          <PaymentInfo
            user={user}
            paymentData={paymentData}
            studentInfo={studentInfo}
          />

          <TermsAgreement
            paymentData={paymentData}
            setPaymentData={setPaymentData}
          />

          <PaymentStatus
            paymentData={paymentData}
            studentInfo={studentInfo}
            user={user}
          />
        </>

        <div className="text-center pt-6">
          <button
            disabled={!isFormValid() || isProcessing}
            onClick={handlePayment}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            <CheckCircle className="w-6 h-6 mr-2" />
            {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </div>
      </div>

      <OTPScreen
        isOpen={showOtpDialog}
        onClose={closeOtpDialog}
        onVerify={handleOtpVerify}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default PaymentPage;
