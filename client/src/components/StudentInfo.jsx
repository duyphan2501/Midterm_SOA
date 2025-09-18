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
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { School, Person, CreditCard, Category } from "@mui/icons-material";

const StudentInfo = ({
  paymentData,
  setPaymentData,
  studentInfo,
  onSearchStudent,
}) => {
  return (
    <Slide direction="right" in timeout={400}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          bgcolor: "#FFEFD5",
          border: 2,
          borderColor: "#FF6600",
          borderRadius: 2,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            borderColor: "warning.300",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
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

        <Grid container spacing={2} alignItems="end" sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 3, md: 3.9 }}>
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
            />
          </Grid>

          <Grid
            size={{ xs: 12, sm: 4, md: 2 }}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", sm: "flex-end" },
            }}
          >
            <Button
              variant="contained"
              onClick={() =>
                onSearchStudent && onSearchStudent(paymentData.studentId)
              }
              disabled={!paymentData.studentId}
              sx={{
                minWidth: { xs: "100%", sm: 120, md: 140 },
                width: { xs: "100%", sm: "auto" },
                bgcolor: "warning.600",
                "&:hover": { bgcolor: "warning.700" },
              }}
            >
              Tìm kiếm
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
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
                  value={studentInfo ? studentInfo.name : ""}
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

          <Grid size={{ xs: 12, md: 4 }}>
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
                    studentInfo
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

          <Grid size={{ xs: 12, md: 4 }}>
            <Fade in timeout={1200}>
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  color="text.primary"
                  sx={{ mb: 1 }}
                >
                  Chọn học kì
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={paymentData.feeType || ""}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        feeType: e.target.value,
                      }))
                    }
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <Category sx={{ color: "action.active" }} />
                      </InputAdornment>
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "warning.500",
                        },
                        "&.Mui-focused": {
                          borderColor: "warning.600",
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Chọn học kì</em>
                    </MenuItem>
                    <MenuItem value="hk1">Học kì I</MenuItem>
                    <MenuItem value="hk2">Học kì II</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Paper>
    </Slide>
  );
};

export default StudentInfo;
