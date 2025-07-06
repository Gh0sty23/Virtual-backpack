const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
    console.error("FATAL ERROR: RESEND_API_KEY is not defined. Check your .env file.");
    process.exit(1); // stop server if the key is missing
}
const resend = new Resend(resendApiKey);

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

app.post('/api/send-email', async (req, res) => {
  try {
    console.log("4. [Server] Received a request to /api/send-email");
    const { to, subject, html } = req.body;
    console.log("[Server] Attempting to send email with these details:", { to, subject });

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: to,
      subject: subject,
      html: html,
    });

    // error handling
    if (error) {
      console.error("[Server] Resend returned an error:", error);
      return res.status(400).json({ error });
    }

    console.log("[Server] Resend responded successfully:", data);
    res.status(200).json({ data });
  } catch (error) {
    console.error("[Server] A fatal error occurred in the endpoint:", error);
    res.status(500).json({ error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});