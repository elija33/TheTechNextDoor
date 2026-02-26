import React, { JSX, useState } from "react";
import "../style/Contact.css";
import Footer from "./Footer";
import SEO from "./SEO";
import { saveContactMessage, ContactMessage } from "../utils/messageStorage";
import LoadingImagesContact from "./LoadingImagesContact";

interface FormDataContact {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  contactMethod: "email" | "call";
  message: string;
}

function Contact(): JSX.Element {
  const [formData, setFormData] = useState<FormDataContact>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    contactMethod: "email",
    message: "",
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName, setSubmittedName] = useState({ first: "", last: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const imageDataPromises = uploadedImages.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const imageDataUrls = await Promise.all(imageDataPromises);

    const message: ContactMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      firstName: formData.firstname,
      lastName: formData.lastname,
      email: formData.email,
      phone: formData.phone,
      contactMethod: formData.contactMethod,
      message: formData.message,
      images: imageDataUrls,
      timestamp: Date.now(),
      unread: true,
    };

    await saveContactMessage(message);

    setSubmittedName({ first: formData.firstname, last: formData.lastname });
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      contactMethod: "email",
      message: "",
    });
    setUploadedImages([]);
    setResetKey((prev) => prev + 1);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleImagesChange = (images: File[]) => {
    setUploadedImages(images);
  };

  const isFormValid =
    formData.firstname.trim() !== "" &&
    formData.lastname.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    (formData.contactMethod === "email" || formData.contactMethod === "call") &&
    uploadedImages.length > 0 &&
    formData.message.trim() !== "";

  return (
    <>
      <SEO
        title="Contact Us - The Tech Next Door"
        description="Contact The Tech Next Door for phone and device repair services. Send us a message and we'll get back to you soon."
      />
      <div className="contact-container">
        <div className="contact-wrapper">
          <div className="contact-header">
            <h2 className="contact-title">Contact Us</h2>
            <p className="contact-subtitle">
              Have questions? We'd love to hear from you. Send us a message!
            </p>
          </div>

          <div className="contact-content">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-column">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="John"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Doe"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">How may we contact you?</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="email"
                        name="contactMethod"
                        value="email"
                        checked={formData.contactMethod === "email"}
                        onChange={handleChange}
                        className="radio-input"
                      />
                      <label htmlFor="email" className="radio-label">
                        By Email
                      </label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="call"
                        name="contactMethod"
                        value="call"
                        checked={formData.contactMethod === "call"}
                        onChange={handleChange}
                        className="radio-input"
                      />
                      <label htmlFor="call" className="radio-label">
                        By Call
                      </label>
                    </div>
                  </div>
                </div>
                <LoadingImagesContact
                  key={resetKey}
                  onImagesChange={handleImagesChange}
                />
                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="form-textarea"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <div className="submit-container">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={!isFormValid}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      {showSuccessModal && (
        <div className="contact-modal-overlay" onClick={handleCloseModal}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="contact-modal-title">
              Thank You {submittedName.first} {submittedName.last}!
            </h3>
            <p className="contact-modal-text">
              Thank you for reaching out! We will contact you soon.
            </p>
            <button className="contact-modal-btn" onClick={handleCloseModal}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
export default Contact;
