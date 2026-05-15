import { Router } from "express";
import twilio from "twilio";

const router = Router();
const { VoiceResponse } = twilio.twiml;
const VOICE = { voice: "Polly.Joanna" };

router.post("/forward", (_req, res) => {
  const twiml = new VoiceResponse();
  twiml.say(VOICE, "Connecting you now. Please hold.");
  const dial = twiml.dial({
    callerId: process.env.TWILIO_FROM_NUMBER,
    timeout: 20,
    action: "/forward-fallback",
  });
  dial.number(process.env.OWNER_PHONE);
  res.type("text/xml").send(twiml.toString());
});

router.post("/forward-fallback", (req, res) => {
  const status = req.body.DialCallStatus;
  const twiml = new VoiceResponse();
  if (status === "completed") {
    twiml.hangup();
  } else {
    twiml.say(
      VOICE,
      "We couldn't reach the line. Please leave a message after the tone."
    );
    twiml.record({
      action: "/voicemail/complete",
      maxLength: 120,
      playBeep: true,
    });
    twiml.hangup();
  }
  res.type("text/xml").send(twiml.toString());
});

export default router;
