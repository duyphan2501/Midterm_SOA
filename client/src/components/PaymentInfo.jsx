import {
  Box,
  Typography,
  TextField,
  Paper,
  Grid,
  InputAdornment,
  Chip,
  Fade,
  Slide,
} from "@mui/material";
import { Business, CreditCard } from "@mui/icons-material";

const PaymentInfo = ({ user, paymentData, studentInfo }) => {
  return (
    <Slide direction="left" in timeout={600}>
      <div className="">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Chip
            label="2"
            sx={{
              width: 40,
              height: 40,
              bgcolor: `${studentInfo.tuitionFee !== 0 && studentInfo.tuitionFee <= user.balance ? "#1976d3" : "success.600"}`,
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
              mr: 2,
            }}
          />
          <Typography
            variant="h5"
            component="h3"
            fontWeight="bold"
            color="success.800"
          >
            Thông tin thanh toán
          </Typography>
        </Box>

        <div className="flex flex-col gap-5">
          <Box>
            <Typography
              variant="body2"
              fontWeight="medium"
              color="text.primary"
              sx={{ mb: 1 }}
            >
              Số dư khả dụng
            </Typography>
            <TextField
              fullWidth
              value={`${
                studentInfo.tuitionFee !== 0
                  ? user.balance.toLocaleString() + " VNĐ"
                  : ""
              }`}
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: "grey.100",
                  borderRadius: 1.5,
                  transition: "all 0.3s ease",
                },
              }}
            />
          </Box>
          <Box>
            <Typography
              variant="body2"
              fontWeight="medium"
              color="text.primary"
              sx={{ mb: 1 }}
            >
              Số tiền cần thanh toán
            </Typography>
            <TextField
              fullWidth
              value={
                paymentData.studentId && studentInfo.tuitionFee !== 0
                  ? `${studentInfo.tuitionFee?.toLocaleString()} VNĐ`
                  : ""
              }
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCard sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: "grey.100",
                  borderRadius: 1.5,
                  transition: "all 0.3s ease",
                },
              }}
            />
          </Box>
        </div>
      </div>
    </Slide>
  );
};

export default PaymentInfo;
