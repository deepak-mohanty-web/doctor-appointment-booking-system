// backend/routes/sms.js
import express from "express";
const smsRouter = express.Router();
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

smsRouter.post("/send-sms", async (req, res) => {
  const { phoneNumber, message } = req.body;
  console.log(phoneNumber);
  try {
    const smsResponse = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    res
      .status(200)
      .json({ success: true, message: "SMS sent successfully!", smsResponse });
  } catch (error) {
    console.error("Error sending SMS:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send SMS.",
      error: error.message, // Send exact Twilio error message
    });
  }
});

export default smsRouter;
