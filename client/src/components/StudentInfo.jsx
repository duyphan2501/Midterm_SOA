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
} from "@mui/material";
import { School, Person, CreditCard, Category } from "@mui/icons-material";
import PaymentStatus from "./PaymentStatus";
import useTuitionStore from "../stores/tuitionStore";

const StudentInfo = ({
  paymentData,
  setPaymentData,
  studentInfo,
  onSearchStudent,
}) => {
  const message = useTuitionStore((state) => state.message);
  const success = useTuitionStore((state) => state.success);
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Chip
          label="1"
          sx={{
            width: 40,
            height: 40,
            bgcolor: `${
              studentInfo.tuitionFee !== 0 ? "#1976d3" : "success.600"
            }`,
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="body2"
            fontWeight="medium"
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Mã số sinh viên
          </Typography>
          <Fade in timeout={400}>
            <div className="flex items-center">
              <TextField
                value={paymentData.studentId}
                onChange={(e) =>
                  setPaymentData((prev) => ({
                    ...prev,
                    studentId: e.target.value,
                  }))
                }
                className=" [&_.MuiOutlinedInput-root]:!rounded-r-none flex-1"
                placeholder="VD: 52000001"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <School sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                className="!h-full !py-[15.5px] !rounded-l-none !bg-[#1976d3] !text-white !border-none hover:!bg-[#1565c0] !px-4 disabled:!bg-gray-300 disabled:!cursor-not-allowed transition-colors"
                onClick={() =>
                  onSearchStudent &&
                  onSearchStudent(paymentData.studentId.trim())
                }
                disabled={!paymentData.studentId}
              >
                Tìm kiếm
              </Button>
            </div>
          </Fade>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Fade in timeout={1200}>
            <Box>
              <Typography
                variant="body2"
                fontWeight="medium"
                color="text.primary"
                sx={{ mb: 1, userSelect: "none" }}
              >
                Họ tên sinh viên
              </Typography>
              <TextField
                fullWidth
                value={studentInfo ? studentInfo.fullname : ""}
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
          <Fade in timeout={800}>
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
                  studentInfo && studentInfo.tuitionFee !== 0
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
                Học kỳ
              </Typography>
              <TextField
                fullWidth
                value={studentInfo ? studentInfo.semester : ""}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category sx={{ color: "action.active" }} />
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
      </div>
      {message && (
        <div className="mt-5">
          <PaymentStatus
            open={message !== null}
            status={success}
            message={message}
          />
        </div>
      )}
    </Paper>
  );
};

export default StudentInfo;
