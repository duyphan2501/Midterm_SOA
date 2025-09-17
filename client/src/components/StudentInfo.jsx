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
import { School, Person, CreditCard } from "@mui/icons-material";

const StudentInfo = ({ paymentData, setPaymentData, studentInfo }) => {
  return (
    <Slide direction="right" in timeout={400}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          bgcolor: "warning.50",
          border: 2,
          borderColor: "warning.200",
          borderRadius: 2,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            borderColor: "warning.300",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Chip
            label="1"
            sx={{
              width: 40,
              height: 40,
              bgcolor: "warning.600",
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
            color="warning.800"
          >
            Thông tin học phí
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Fade in timeout={600}>
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  color="text.primary"
                  sx={{ mb: 1 }}
                >
                  Mã số sinh viên
                </Typography>
                <TextField
                  fullWidth
                  value={paymentData.studentId}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      studentId: e.target.value,
                    }))
                  }
                  placeholder="VD: 52000001"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <School sx={{ color: "action.active" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: 1.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: 1,
                      },
                      "&.Mui-focused": {
                        transform: "translateY(-1px)",
                        boxShadow: 2,
                      },
                    },
                  }}
                />
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={4}>
            <Fade in timeout={800}>
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  color="text.primary"
                  sx={{ mb: 1 }}
                >
                  Họ tên sinh viên
                </Typography>
                <TextField
                  fullWidth
                  value={paymentData.studentId ? studentInfo.name : ""}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "action.active" }} />
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

          <Grid item xs={12} md={4}>
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  color="text.primary"
                  sx={{ mb: 1 }}
                >
                  Số tiền học phí
                </Typography>
                <TextField
                  fullWidth
                  value={
                    paymentData.studentId
                      ? `${studentInfo.tuitionFee.toLocaleString("vi-VN")} VNĐ`
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
            </Fade>
          </Grid>
        </Grid>
      </Paper>
    </Slide>
  );
};

export default StudentInfo;
