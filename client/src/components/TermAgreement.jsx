import React from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  useTheme,
  Chip,
} from "@mui/material";
import { Circle } from "@mui/icons-material";

const TermsAgreement = ({ paymentData, setPaymentData }) => {
  const theme = useTheme();

  const terms = [
    "Giao dịch thanh toán học phí chỉ được thực hiện một lần cho mỗi kỳ học",
    "Số tiền thanh toán phải bằng đúng số tiền học phí cần nộp",
    "Giao dịch không thể hoàn tác sau khi đã xác nhận",
    "Phí giao dịch: 0 VNĐ (miễn phí)",
  ];

  return (
    <Fade in timeout={1200}>
      <div className="">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Chip
            label="3"
            sx={{
              width: 40,
              height: 40,
              bgcolor: `${paymentData.acceptTerms ? "#1976d3" : "success.600"}`,
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
            color="text.primary"
          >
            Điều khoản và thỏa thuận
          </Typography>
        </Box>

        <List sx={{ mb: 3, p: 0 }}>
          {terms.map((term, index) => (
            <ListItem
              key={index}
              sx={{
                px: 0,
                py: 0.5,
                "&:hover": {
                  bgcolor: "action.hover",
                  borderRadius: 1,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 20 }}>
                <Circle sx={{ fontSize: 6, color: "text.secondary" }} />
              </ListItemIcon>
              <ListItemText
                primary={term}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
              />
            </ListItem>
          ))}
        </List>

        <FormControlLabel
          control={
            <Checkbox
              checked={paymentData.acceptTerms}
              onChange={(e) =>
                setPaymentData((prev) => ({
                  ...prev,
                  acceptTerms: e.target.checked,
                }))
              }
              sx={{
                "&.Mui-checked": {
                  color: theme.palette.primary.main,
                  transform: "scale(1.1)",
                  transition: "transform 0.2s ease",
                },
              }}
            />
          }
          label={
            <Typography variant="body2" fontWeight="600" color="text.primary">
              Tôi đã đọc và đồng ý với các điều khoản và thỏa thuận trên
            </Typography>
          }
          sx={{ m: 0 }}
        />
      </div>
    </Fade>
  );
};

export default TermsAgreement;
