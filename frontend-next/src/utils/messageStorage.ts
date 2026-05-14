import { contactMessagesApi } from '../services/api';

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactMethod: "email" | "call";
  message: string;
  images: string[];
  timestamp: number;
  unread: boolean;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const response = await contactMessagesApi.getAll();
    return response.data as ContactMessage[];
  } catch {
    return [];
  }
}

export async function saveContactMessage(message: ContactMessage): Promise<void> {
  await contactMessagesApi.save(message);
}

export async function markMessageAsRead(id: string): Promise<void> {
  await contactMessagesApi.markAsRead(id);
}

export async function deleteContactMessage(id: string): Promise<void> {
  await contactMessagesApi.delete(id);
}
