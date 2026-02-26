import { JSX, useState, useEffect } from "react";
import { getContactMessages, markMessageAsRead, ContactMessage } from "../../utils/messageStorage";
import "../../style/DashboardMessages.css";

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function DashboardMessages(): JSX.Element {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    getContactMessages().then(setMessages);
  }, []);

  const unreadCount = messages.filter((m) => m.unread).length;

  const handleMessageClick = async (message: ContactMessage) => {
    if (message.unread) {
      await markMessageAsRead(message.id);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, unread: false } : m))
      );
    }
    setSelectedMessage(message);
  };

  const handleCloseDetail = () => {
    setSelectedMessage(null);
  };

  if (selectedMessage) {
    return (
      <div className="messages-page">
        <div className="message-detail-header">
          <button className="message-back-btn" onClick={handleCloseDetail}>
            ← Back to Messages
          </button>
        </div>
        <div className="message-detail">
          <div className="message-detail-top">
            <div className="message-avatar">
              {getInitials(selectedMessage.firstName, selectedMessage.lastName)}
            </div>
            <div className="message-detail-info">
              <h3>{selectedMessage.firstName} {selectedMessage.lastName}</h3>
              <p className="message-detail-contact">
                {selectedMessage.email} • {selectedMessage.phone}
              </p>
              <p className="message-detail-method">
                Prefers contact by: <strong>{selectedMessage.contactMethod === "email" ? "Email" : "Call"}</strong>
              </p>
              <p className="message-detail-time">{formatTimeAgo(selectedMessage.timestamp)}</p>
            </div>
          </div>
          <div className="message-detail-body">
            <h4>Message</h4>
            <p>{selectedMessage.message}</p>
          </div>
          {selectedMessage.images.length > 0 && (
            <div className="message-detail-images">
              <h4>Attached Images ({selectedMessage.images.length})</h4>
              <div className="message-images-grid">
                {selectedMessage.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Attachment ${idx + 1}`} className="message-image" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <h2>Messages ({unreadCount} unread)</h2>

      {messages.length === 0 ? (
        <div className="messages-empty">
          No messages yet. Messages from the Contact page will appear here.
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div
              className={`message-item ${message.unread ? "unread" : ""}`}
              key={message.id}
              onClick={() => handleMessageClick(message)}
            >
              <div className="message-avatar">
                {getInitials(message.firstName, message.lastName)}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">
                    {message.firstName} {message.lastName}
                  </span>
                  <span className="message-time">{formatTimeAgo(message.timestamp)}</span>
                </div>
                <div className="message-subject">
                  {message.contactMethod === "email" ? "Email" : "Call"} • {message.images.length} image{message.images.length !== 1 ? "s" : ""}
                </div>
                <div className="message-preview">{message.message}</div>
              </div>
              {message.unread && <div className="unread-dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardMessages;
