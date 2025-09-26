import { History } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import useUserStore from "../stores/userStore";
import usePaymentStore from "../stores/paymentStore";
import useTuitionStore from "../stores/tuitionStore";
const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const user = useUserStore((state) => state.user);
  const getPaymentHistory = usePaymentStore((state) => state.getPaymentHistory);
  const getTuitionInfo = useTuitionStore((state) => state.getTuitionInfo);
  const [isLoading, setIsLoading] = useState(false);

  const statusMap = {
    SUCCESS: {
      text: "text-green-800",
      bg: "bg-green-100",
      label: "Thành công",
    },
    FAILED: {
      text: "text-red-800",
      bg: "bg-red-100",
      label: "Thất bại",
    },
  };

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  };

  const handleStatus = (status) => {
    const { text, bg, label } = statusMap[status] || {
      text: "text-gray-800",
      bg: "bg-gray-100",
      label: "Chưa xử lí",
    };

    return (
      <span
        className={`px-3 py-1 ${bg} ${text} rounded-full text-sm font-medium`}
      >
        {label}
      </span>
    );
  };

  const fetchPaymentHistory = async () => {
    setIsLoading(true);
    try {
      const payments = (await getPaymentHistory(user.user_id)) || [];

      const enrichedPayments = await Promise.all(
        payments.map(async (payment) => {
          const tuition = await getTuitionInfo(payment.tuition_id);
          return {
            ...payment,
            semester: tuition.semester,
            student_id: tuition.student_id,
            student_name: tuition.student_name,
          };
        })
      );

      setPaymentHistory(enrichedPayments);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center mb-6">
        <History className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Lịch sử thanh toán</h2>
      </div>

      {isLoading ? (
        <div className="h-full flex items-center justify-center mt-20">
          <div className="w-20 h-20 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4 h-full">
          {paymentHistory.length > 0 ? (
            paymentHistory.map((payment) => (
              <div
                key={payment.payment_code}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Học phí {payment.semester}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Mã GD: {payment.payment_code}
                    </p>
                  </div>
                  {handleStatus(payment.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">
                      {payment.status !== "SUCCESS"
                        ? "Cập nhật lúc"
                        : "Thanh toán lúc:"}
                    </p>
                    <p className="font-medium">
                      {formatDate(payment.updated_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mã sinh viên:</p>
                    <p className="font-medium">{payment.student_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tên sinh viên:</p>
                    <p className="font-medium">{payment.student_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      {payment.status === "SUCCESS"
                        ? "Đã thanh toán"
                        : "Cần thanh toán:"}
                    </p>
                    <p
                      className={`font-medium ${
                        statusMap[payment.status].text
                      }`}
                    >
                      {payment.amount.toLocaleString()} VNĐ
                    </p>
                  </div>
                </div>

                {payment.description && (
                  <div className="mt-4">
                    <span className="font-semibold text-black">Ghi chú: </span>
                    {payment.description}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 bg-[#fafafc] rounded-xl py-10">
              <img
                src="./NoTransaction.png"
                alt="Không có giao dịch"
                className="size-60 object-cover"
              />
              <div className="text-lg font-semibold">
                Hiện tại chưa có giao dịch nào
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
