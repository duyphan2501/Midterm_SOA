import { GraduationCap, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import StudentInfoForm from "../components/StudentInfo";
import PaymentInfo from "../components/PaymentInfo";
import TermsAgreement from "../components/TermAgreement";
import PaymentStatus from "../components/PaymentStatus";
import OTPScreen from "../components/OTPScreen";
import { Paper } from "@mui/material";
import useTuitionStore from "../stores/tuitionStore";
import usePaymentStore from "../stores/paymentStore";
import { toast } from "react-toastify";

const PaymentPage = ({ user, onOtpDialogChange }) => {
  const [paymentData, setPaymentData] = useState({
    studentId: "",
    acceptTerms: JSON.parse(localStorage.getItem("isAgreed")) || false,
  });
  const [studentInfo, setStudentInfo] = useState({
    fullname: "",
    tuitionFee: 0,
    semester: "",
  });

  const [showOtpDialog, setShowOtpDialog] = useState(false);

  const fetchTuition = useTuitionStore((state) => state.fetchTuition);
  const createPayment = usePaymentStore((state) => state.createPayment);
  const isProcessing = usePaymentStore((state) => state.isProcessing);

  const updateOtpDialog = (isOpen) => {
    setShowOtpDialog(isOpen);
    if (onOtpDialogChange) {
      onOtpDialogChange(isOpen);
    }
  };

  const handleSearchStudent = async (studentId) => {
    const tuition = await fetchTuition(studentId);
    setStudentInfo({
      fullname: tuition ? tuition.student_name : "",
      tuitionFee: tuition ? tuition.amount : 0,
      semester: tuition ? tuition.semester : "",
    });
  };

  const isFormValid = () => {
    return (
      paymentData.studentId &&
      paymentData.acceptTerms &&
      studentInfo &&
      studentInfo.tuitionFee !== 0 &&
      studentInfo.tuitionFee <= user.balance
    );
  };

  useEffect(() => {
    setStudentInfo({ fullname: "", tuitionFee: 0, semester: "" });
  }, [paymentData.studentId]);

  const handlePayment = async () => {
    const tuition = useTuitionStore.getState().tuition;
    if (!tuition) {
      toast.error("Dữ liệu học phí không tồn tại. Vui lòng kiểm tra lại.");
      return;
    }
    await createPayment(tuition, user);
    const payment = usePaymentStore.getState().payment;
    if (payment) {
      onOtpDialogChange(true);
      setShowOtpDialog(true);
    }
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

        <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
          <div className="lg:flex gap-7">
            <div className="flex-1">
              <PaymentInfo
                user={user}
                paymentData={paymentData}
                studentInfo={studentInfo}
              />
            </div>

            <div className="flex-1 mt-8 lg:mt-0">
              <TermsAgreement
                paymentData={paymentData}
                setPaymentData={setPaymentData}
              />
            </div>
          </div>
          {studentInfo.fullname && (
            <div className="mt-4">
              <PaymentStatus
                open={studentInfo.fullname}
                status={
                  studentInfo.tuitionFee !== 0 &&
                  studentInfo.tuitionFee <= user.balance
                    ? "success"
                    : "error"
                }
                message={
                  studentInfo.tuitionFee !== 0 &&
                  studentInfo.tuitionFee <= user.balance
                    ? "Có thể thanh toán: Số dư đủ để thực hiện giao dịch"
                    : `Không thể thanh toán: Số dư không đủ (thiếu ${(
                        studentInfo.tuitionFee - user.balance
                      ).toLocaleString("vi-VN")} VNĐ)`
                }
              />
            </div>
          )}
        </Paper>

        <div className="text-center">
          <button
            disabled={!isFormValid() || isProcessing}
            onClick={handlePayment}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg cursor-pointer"
          >
            <CheckCircle className="w-6 h-6 mr-2" />
            {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </div>
      </div>

      <OTPScreen
        isOpen={showOtpDialog}
        onClose={closeOtpDialog}
        isProcessing={isProcessing}
        clearPaymentData={() =>
          setPaymentData({
            studentId: "",
          })
        }
      />
    </>
  );
};

export default PaymentPage;
