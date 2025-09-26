// components/OTPVerificationScreen.tsx
import { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const VerificationContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
  text-align: center;
  color: #555;
  margin-bottom: 20px;
`;

const Instructions = styled.p`
  margin-bottom: 20px;
  color: #555;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  letter-spacing: 5px;
  text-align: center;
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background-color: #357ae8;
  }
  
  &:disabled {
    background-color: #cccccursor: not-allowed;
  }
`;

// Component
const OTPVerificationScreen = ({ onSubmit }) => {
  const [otp, setOtp] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(otp);
  };
  
  const isFormValid = otp.trim() !== '' && otp.length >= 4;
  
  return (
    <VerificationContainer>
      <Header>OTP Verification</Header>
      <Instructions>
        Please enter the one-time password sent to your registered mobile number.
      </Instructions>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="otp">OTP</Label>
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={!isFormValid}>
        </Button>
      </Form>
    </VerificationContainer>
  );
};

export default OTPVerificationScreen;
