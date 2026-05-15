import { Router } from "express";
import twilio from "twilio";

const router = Router();
const { VoiceResponse } = twilio.twiml;
const VOICE = { voice: "Polly.Joanna" };

router.post("/voicemail/complete", async (req, res) => {
  const { RecordingUrl, From } = req.body;
  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        from: process.env.TWILIO_FROM_NUMBER,
        to: process.env.OWNER_PHONE,
        body: `New TheTechNextDoor voicemail from ${From}. Listen: ${RecordingUrl}.mp3`,
      });
    }
  } catch (err) {
    // Don't fail the call if SMS notification fails — Twilio just needs valid TwiML back.
    console.error("SMS notify failed:", err.message);
  }
  const twiml = new VoiceResponse();
  twiml.say(VOICE, "Thanks. We will call you back shortly. Goodbye.");
  twiml.hangup();
  res.type("text/xml").send(twiml.toString());
});

export default router;
