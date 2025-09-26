// components/PaymentFormScreen.tsx
import { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const FormContainer = styled.div`
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

const Section = styled.div`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  color: #555;
  margin-bottom: 15px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
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
  
  &:disabled {
    background-color: #f9f9f9;
    color: #666;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background-color: #357ae8;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const StudentIdContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const StudentIdButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  
  &:hoverfont-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: #357ae8;
  }
`;

// Component
const PaymentFormScreen = ({
  formData,
  onStudentIdSubmit,
  onChange,
  onSubmit
}) => {
  const [tempStudentId, setTempStudentId] = useState('');
  
  const handleStudentIdSubmit = () => {
    if (tempStudentId.trim() !== '') {
      onStudentIdSubmit(tempStudentId);
    }   
  };
  
  const isFormValid = 
    formData.student.studentId.trim() !== '' &&
    formData.student.studentName.trim() !== '' &&
    formData.student.feeAmount > 0 &&
    formData.payment.termsAccepted;
  console.log(formData);
  
  return (
    <FormContainer>
      <Header>Payment Form</Header>
      
      {/* Payer Information Section */}
      <Section>
        <SectionTitle>Payer Information</SectionTitle>
        <FormGroup>
          <Label>Name</Label>
          <Input 
            type="text" 
            value={formData.payer.name} 
            disabled 
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Phone</Label>
          <Input 
            type="text" 
            value={formData.payer.phone} 
            disabled 
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Email</Label>
          <Input 
            type="email" 
            value={formData.payer.email} 
            disabled 
          />
        </FormGroup>
      </Section>
      
      {/* Student/Fee Information Section */}
      <Section>
        <SectionTitle>Student/Fee Information</SectionTitle>
        <FormGroup>
          <Label htmlFor="studentId">Student ID</Label>
          <StudentIdContainer>
            <Input
              id="studentId"
              type="text"
              value={tempStudentId}
              onChange={(e) => setTempStudentId(e.target.value)}
              placeholder="Enter student ID"
            />  
            <StudentIdButton onClick={handleStudentIdSubmit}>
              Submit
            </StudentIdButton>
          </StudentIdContainer>
        </FormGroup>
        
        <FormGroup>
          <Label>Student Name</Label>
          <Input 
            type="text" 
            value={formData.student.studentName} 
            disabled 
          />    
        </FormGroup>
        
        <FormGroup>
          <Label>Fee Amount</Label>
          <Input 
            type="text" 
            value={formData.student.feeAmount > 0 ? `$${formData.student.feeAmount.toFixed(2)}` : ''} 
            disabled 
          />
        </FormGroup>
        
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="payForOthers"
            checked={formData.student.payForOthers}
            onChange={(e) => onChange('student', 'payForOthers', e.target.checked)}
          />
          <Label htmlFor="payForOthers">Pay for others</Label>
        </CheckboxContainer>
      </Section>
      
      {/* Payment Details Section */}
      <Section>
        <SectionTitle>Payment Details</SectionTitle>
        <FormGroup>
          <Label>Available Balance</Label>
          <Input 
            type="text" 
            value={`$${formData.payment.availableBalance.toFixed(2)}`} 
            disabled 
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Total Fee</Label>
          <Input 
            type="text" 
            value={formData.payment.totalFee > 0 ? `$${formData.payment.totalFee.toFixed(2)}` : ''} 
            disabled 
          />
        </FormGroup>
        
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="termsAccepted"
            checked={formData.payment.termsAccepted}
            onChange={(e) => onChange('payment', 'termsAccepted', e.target.checked)}
          />
          <Label htmlFor="termsAccepted">I accept the terms and conditions</Label>
        </CheckboxContainer>
      </Section>
      
      <Button 
        onClick={onSubmit} 
      >
        Confirm Transaction
      </Button>
    </FormContainer>
  );
};

export default PaymentFormScreen;