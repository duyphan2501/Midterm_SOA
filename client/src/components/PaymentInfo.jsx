import React from "react";
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
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          bgcolor: "success.50",
          border: 2,
          borderColor: "success.200",
          borderRadius: 2,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            borderColor: "success.300",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Chip
            label="2"
            sx={{
              width: 40,
              height: 40,
              bgcolor: "success.600",
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
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
                  value={`${user.balance.toLocaleString("vi-VN")} VNĐ`}
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
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in timeout={1200}>
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
                    paymentData.studentId
                      ? `${studentInfo.tuitionFee.toLocaleString("vi-VN")} VNĐ`
                      : "0 VNĐ"
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
            </Fade>
          </Grid>
        </Grid>
      </Paper>
    </Slide>
  );
};

export default PaymentInfo;
