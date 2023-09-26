import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

function MyComponent() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOTPVerified, setIsOTPVerified] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsOTPVerified(false); // Reset OTP verification status when email changes
  };

  const handleOTPChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSendOTP = async () => {
    try {
      // Send a request to your backend to send an email with OTP
      await axios.post('http://localhost:3001/sendOTP', { email });
      alert('OTP sent to your email address. Please check your inbox.');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleLogin = async () => {
    try {
      // Send a request to your backend to verify the OTP
      const response = await axios.post('http://localhost:3001/verifyOTP', { email, otp });

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
      <h1 className="header">LOGIN</h1> 
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
      />
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

export default MyComponent;
