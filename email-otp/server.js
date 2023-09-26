const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const randomstring = require('randomstring');
const cors = require('cors'); // Import the 'cors' middleware

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors()); // Use the 'cors' middleware

// Create a Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email service (e.g., 'Gmail')
  auth: {
    user: 'me.nasimkt@gmail.com', // Sender email address
    pass: 'crzaxyvgtuwuetbl',    // Sender email password
  },
});

// A map to store generated OTPs, where keys are email addresses and values are OTPs
const otpMap = new Map();

app.post('/sendOTP', async (req, res) => {
  const { email } = req.body;

  // Generate a random 6-digit OTP
  const otp = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });

  // Store the OTP in the map
  otpMap.set(email, otp);

  // Define email message options
  const mailOptions = {
    from: '9656484315@gptcthirurangadi.in', // Sender email address
    to: email,
    subject: 'Your OTP for Login',
    text: `Your OTP is: ${otp}`,
  };

  try {
    // Send the email with OTP
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending OTP' });
  }
});

app.post('/verifyOTP', (req, res) => {
  const { email, otp } = req.body;

  // Check if the provided OTP matches the one stored in the map
  if (otpMap.has(email) && otpMap.get(email) === otp) {
    // OTP is correct, remove it from the map
    otpMap.delete(email);
    res.status(200).json({ verified: true });
  } else {
    res.status(200).json({ verified: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

