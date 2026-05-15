import express from "express";
import twilio from "twilio";
import voice from "./routes/voice.js";
import info from "./routes/info.js";
import voicemail from "./routes/voicemail.js";
import forward from "./routes/forward.js";

const app = express();
app.set("trust proxy", true);
app.use(express.urlencoded({ extended: false }));

const validateTwilio = twilio.webhook({
  validate: process.env.NODE_ENV === "production",
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/", validateTwilio, voice);
app.use("/", validateTwilio, info);
app.use("/", validateTwilio, voicemail);
app.use("/", validateTwilio, forward);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IVR listening on :${PORT}`));
