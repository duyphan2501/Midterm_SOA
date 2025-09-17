import React from "react";
import { Alert, Typography, Collapse } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";

const PaymentStatus = ({ paymentData, studentInfo, user }) => {
  if (!paymentData.studentId) return null;

  const isEnough = studentInfo.tuitionFee <= user.balance;

  return (
    <Collapse in={!!paymentData.studentId} timeout={500}>
      <Alert
        severity={isEnough ? "success" : "error"}
        icon={isEnough ? <CheckCircle /> : <Error />}
        sx={{
          borderRadius: 2,
          "& .MuiAlert-message": {
            width: "100%",
          },
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: 2,
          },
        }}
      >
        <Typography variant="body1" fontWeight="600">
          {isEnough ? (
            "Có thể thanh toán: Số dư đủ để thực hiện giao dịch"
          ) : (
            <>
              Không thể thanh toán: Số dư không đủ (thiếu{" "}
              {(studentInfo.tuitionFee - user.balance).toLocaleString("vi-VN")}{" "}
              VNĐ)
            </>
          )}
        </Typography>
      </Alert>
    </Collapse>
  );
};

export default PaymentStatus;
