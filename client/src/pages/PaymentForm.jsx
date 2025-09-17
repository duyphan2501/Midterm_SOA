import { GraduationCap, CheckCircle } from "lucide-react";
import { useState } from "react";
import StudentInfoForm from "../components/StudentInfo";
import PaymentInfo from "../components/PaymentInfo";
import TermsAgreement from "../components/TermAgreement";
import PaymentStatus from "../components/PaymentStatus";
const PaymentPage = ({ user }) => {
  const [paymentData, setPaymentData] = useState({
    studentId: "523",
    acceptTerms: false,
  });

  const studentInfo = {
    name: "Trần Thị Bình",
    tuitionFee: 12500000,
  };

  const isFormValid = () => {
    return (
      paymentData.studentId &&
      paymentData.acceptTerms &&
      studentInfo.tuitionFee <= user.balance
    );
  };

  const handlePayment = () => {
    alert("Chức năng thanh toán - Demo UI only");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-8">
        <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Thanh toán học phí</h2>
      </div>

      <StudentInfoForm
        paymentData={paymentData}
        setPaymentData={setPaymentData}
        studentInfo={studentInfo}
      />

      <PaymentInfo
        user={user}
        paymentData={paymentData}
        studentInfo={studentInfo}
      />

      <TermsAgreement
        paymentData={paymentData}
        setPaymentData={setPaymentData}
      />

      {paymentData.studentId && (
        <PaymentStatus
          paymentData={paymentData}
          studentInfo={studentInfo}
          user={user}
        />
      )}

      <div className="text-center pt-6">
        <button
          disabled={!isFormValid()}
          onClick={handlePayment}
          className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          <CheckCircle className="w-6 h-6 mr-2" />
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
