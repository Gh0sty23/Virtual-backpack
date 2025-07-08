const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); // <-- Use nodemailer

const app = express();

// --- Nodemailer Setup ---
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("FATAL ERROR: EMAIL_USER or EMAIL_PASS is not defined. Check your .env file.");
    process.exit(1);
}

// Create a "transporter" which is the object that can send emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use the Gmail service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use the App Password here
    },
});
// --- End of Nodemailer Setup ---

app.use(express.json());
const frontendURL = 'https://gh0sty23.github.io/virtual-backpack-site/'; 

app.use(cors({ origin: frontendURL })); 

const PORT = process.env.PORT || 3001;

app.post('/api/send-email', async (req, res) => {
  try {
    console.log("4. [Server] Received a request to /api/send-email");
    const { to, subject, html } = req.body;
    console.log("[Server] Attempting to send email with these details:", { to, subject });

    // Define the email options
    const mailOptions = {
        from: `"Virtual Backpack" <${process.env.EMAIL_USER}>`, // The "from" field with a name
        to: to,
        subject: subject,
        html: html,
    };

    // Send the email using the transporter
    await transporter.sendMail(mailOptions);

    console.log("[Server] Nodemailer sent the email successfully.");
    res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    console.error("[Server] A fatal error occurred in the endpoint:", error);
    res.status(500).json({ error: { message: error.message } });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});