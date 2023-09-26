const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio'); // Import Twilio for SMS
const randomstring = require('randomstring');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Initialize Twilio account SID and auth token
const twilioClient = twilio('twilio sid', 'auth token');

// A map to store generated OTPs, where keys are phone numbers and values are OTPs
const otpMap = new Map();

app.post('/sendOTP', async (req, res) => {
  const { phoneNumber } = req.body;

  // Generate a random 6-digit OTP
  const otp = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });

  // Store the OTP in the map
  otpMap.set(phoneNumber, otp);

  try {
    // Send an SMS with OTP using Twilio
    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: 'twilio number',
      to: phoneNumber,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'An error occurred while sending OTP' });
  }
});

app.post('/verifyOTP', (req, res) => {
  const { phoneNumber, otp } = req.body;

  // Check if the provided OTP matches the one stored in the map
  if (otpMap.has(phoneNumber) && otpMap.get(phoneNumber) === otp) {
    // OTP is correct, remove it from the map
    otpMap.delete(phoneNumber);
    res.status(200).json({ verified: true });
  } else {
    res.status(200).json({ verified: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

