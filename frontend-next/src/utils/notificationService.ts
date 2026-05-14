// Notification Service for sending confirmation emails/SMS

interface ConfirmationDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
}

// Send confirmation email - opens default email client
export async function sendConfirmationEmail(details: ConfirmationDetails): Promise<boolean> {
  const { firstName, lastName, email, appointmentDate, appointmentTime } = details;

  const message = `Hello ${firstName} ${lastName}, your appointment on ${appointmentDate} at ${appointmentTime} is confirmed.`;

  try {
    const subject = encodeURIComponent("Appointment Confirmed - The Tech Next Door");
    const body = encodeURIComponent(message);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
    return true;
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return false;
  }
}

// Send confirmation SMS - shows alert with message
export async function sendConfirmationSMS(details: ConfirmationDetails): Promise<boolean> {
  const { firstName, lastName, phone, appointmentDate, appointmentTime } = details;

  const message = `Hello ${firstName} ${lastName}, your appointment on ${appointmentDate} at ${appointmentTime} is confirmed. - The Tech Next Door`;

  try {
    // For SMS integration with Twilio, you'll need a backend API
    // For now, show the message that would be sent
    alert(`Confirmation message for ${phone}:\n\n${message}`);
    return true;
  } catch (error) {
    console.error("Failed to send confirmation SMS:", error);
    return false;
  }
}

// Send both email and SMS confirmation
export async function sendConfirmationNotification(
  details: ConfirmationDetails,
  method: "email" | "sms" | "both" = "both"
): Promise<{ email: boolean; sms: boolean }> {
  const results = { email: false, sms: false };

  if (method === "email" || method === "both") {
    results.email = await sendConfirmationEmail(details);
  }

  if (method === "sms" || method === "both") {
    results.sms = await sendConfirmationSMS(details);
  }

  return results;
}
