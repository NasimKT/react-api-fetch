import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

function PhoneAuthComponent() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const handlePhoneNumberChange = (event) => {
    const inputPhoneNumber = event.target.value;

    // Validate if the phone number starts with a plus sign (+) and is followed by digits
    if (!/^\+\d+$/.test(inputPhoneNumber)) {
      setPhoneNumberError('Please enter a valid phone number with a country code (e.g., +1 for US).');
    } else {
      setPhoneNumberError('');
    }

    setPhoneNumber(inputPhoneNumber);
    setIsOTPVerified(false); // Reset OTP verification status when phone number changes
  };

  const handleOTPChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSendOTP = async () => {
    try {
      // Send a request to your backend to send an SMS with OTP
      await axios.post('http://localhost:3001/sendOTP', { phoneNumber });
      alert('OTP sent to your phone number.');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleLogin = async () => {
    try {
      // Send a request to your backend to verify the OTP
      const response = await axios.post('http://localhost:3001/verifyOTP', { phoneNumber, otp });

      if (response.data.verified) {
        setIsOTPVerified(true);
        alert('Login successful!');
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className="App">
      <h1 className="header">PHONE NUMBER AUTHENTICATION</h1>
      <input
        type="tel"
        placeholder="Enter your phone number with country code (e.g., +1 for US)"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />
      {phoneNumberError && <p className="error">{phoneNumberError}</p>}
      <button onClick={handleSendOTP}>Send OTP</button>
      <br />
      {isOTPVerified ? (
        <p>You are logged in!</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOTPChange}
          />
          <button onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  );
}

export default PhoneAuthComponent;
