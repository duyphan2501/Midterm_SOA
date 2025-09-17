import { History } from "lucide-react";
const PaymentHistory = () => {
  const paymentHistory = [
    {
      id: 1,
      date: "2024-01-15",
      studentId: "52000001",
      studentName: "Trần Thị Bình",
      amount: 12500000,
      status: "Thành công",
      semester: "HK1 2023-2024",
    },
    {
      id: 2,
      date: "2023-08-20",
      studentId: "52000001",
      studentName: "Trần Thị Bình",
      amount: 12000000,
      status: "Thành công",
      semester: "HK2 2022-2023",
    },
    {
      id: 3,
      date: "2023-01-10",
      studentId: "52000001",
      studentName: "Trần Thị Bình",
      amount: 11500000,
      status: "Thành công",
      semester: "HK1 2022-2023",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <History className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Lịch sử thanh toán</h2>
      </div>

      <div className="space-y-4">
        {paymentHistory.map((payment) => (
          <div
            key={payment.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Học phí {payment.semester}
                </h3>
                <p className="text-sm text-gray-600">
                  Mã GD: #{payment.id.toString().padStart(8, "0")}
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {payment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Ngày thanh toán:</p>
                <p className="font-medium">
                  {new Date(payment.date).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Mã sinh viên:</p>
                <p className="font-medium">{payment.studentId}</p>
              </div>
              <div>
                <p className="text-gray-600">Tên sinh viên:</p>
                <p className="font-medium">{payment.studentName}</p>
              </div>
              <div>
                <p className="text-gray-600">Số tiền:</p>
                <p className="font-medium text-green-600">
                  {payment.amount.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PaymentHistory;
