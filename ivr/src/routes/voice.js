import { Router } from "express";
import twilio from "twilio";
import { isOpen } from "../lib/hours.js";

const router = Router();
const { VoiceResponse } = twilio.twiml;
const VOICE = { voice: "Polly.Joanna" };

router.post("/voice", (_req, res) => {
  const twiml = new VoiceResponse();
  twiml.say(
    VOICE,
    "Thanks for calling The Tech Next Door, your local phone repair service in Columbus."
  );

  if (!isOpen()) {
    twiml.say(
      VOICE,
      "We are currently closed. Our hours are Monday through Friday, nine to six, and Saturday and Sunday, nine to seven. Please leave a message after the tone and we'll call you back."
    );
    twiml.record({
      action: "/voicemail/complete",
      maxLength: 120,
      playBeep: true,
      transcribe: false,
    });
    twiml.hangup();
    res.type("text/xml").send(twiml.toString());
    return;
  }

  const gather = twiml.gather({
    numDigits: 1,
    action: "/menu",
    method: "POST",
    timeout: 6,
  });
  gather.say(
    VOICE,
    "Press 1 to schedule a repair. Press 2 for pricing. Press 3 to check the status of a repair. Press 0 to speak with us."
  );

  twiml.redirect({ method: "POST" }, "/voice");
  res.type("text/xml").send(twiml.toString());
});

router.post("/menu", (req, res) => {
  const digit = req.body.Digits;
  const twiml = new VoiceResponse();
  const map = {
    "1": "/schedule",
    "2": "/pricing",
    "3": "/status",
    "0": "/forward",
  };
  const next = map[digit];
  if (!next) {
    twiml.say(VOICE, "Sorry, I didn't catch that.");
    twiml.redirect({ method: "POST" }, "/voice");
  } else {
    twiml.redirect({ method: "POST" }, next);
  }
  res.type("text/xml").send(twiml.toString());
});

export default router;
