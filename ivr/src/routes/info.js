import { Router } from "express";
import twilio from "twilio";

const router = Router();
const { VoiceResponse } = twilio.twiml;
const VOICE = { voice: "Polly.Joanna" };

router.post("/schedule", (_req, res) => {
  const twiml = new VoiceResponse();
  twiml.say(
    VOICE,
    "To schedule a repair, please leave your name, the phone model, and a brief description of the issue after the tone. We will call you right back."
  );
  twiml.record({
    action: "/voicemail/complete",
    maxLength: 120,
    playBeep: true,
  });
  twiml.hangup();
  res.type("text/xml").send(twiml.toString());
});

router.post("/pricing", (_req, res) => {
  const twiml = new VoiceResponse();
  twiml.say(
    VOICE,
    "Most iPhone screen repairs range from 80 to 200 dollars depending on the model. Battery replacements start at 60 dollars. Charging port repairs start at 70 dollars. For an exact quote, visit thetechnextdoors.com slash getaquote."
  );
  const gather = twiml.gather({
    numDigits: 1,
    action: "/pricing-choice",
    method: "POST",
    timeout: 5,
  });
  gather.say(VOICE, "Press 1 to be connected, or star to return to the main menu.");
  twiml.redirect({ method: "POST" }, "/voice");
  res.type("text/xml").send(twiml.toString());
});

router.post("/pricing-choice", (req, res) => {
  const twiml = new VoiceResponse();
  if (req.body.Digits === "1") twiml.redirect({ method: "POST" }, "/forward");
  else twiml.redirect({ method: "POST" }, "/voice");
  res.type("text/xml").send(twiml.toString());
});

router.post("/status", (_req, res) => {
  const twiml = new VoiceResponse();
  twiml.say(
    VOICE,
    "Please leave your name and the phone we are repairing, and we'll get back to you with an update."
  );
  twiml.record({
    action: "/voicemail/complete",
    maxLength: 90,
    playBeep: true,
  });
  twiml.hangup();
  res.type("text/xml").send(twiml.toString());
});

export default router;
