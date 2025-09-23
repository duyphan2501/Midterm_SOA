import { Alert, Typography, Collapse } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";

const PaymentStatus = ({ open, status, message }) => {
  const isSuccess = status === "success";

  return (
    <Collapse in={open} timeout={500}>
      <Alert
        severity={isSuccess ? "success" : "error"}
        icon={isSuccess ? <CheckCircle /> : <Error />}
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
          {message}
        </Typography>
      </Alert>
    </Collapse>
  );
};

export default PaymentStatus;
