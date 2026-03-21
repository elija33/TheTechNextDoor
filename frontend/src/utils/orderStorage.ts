import { repairOrdersApi } from '../services/api';

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  brand: string;
  grouping: string;
  model: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  amount: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  timestamp: number;
  textConfirmation: boolean;
  images: string[];
  streetAddress: string;
  city: string;
  zipPostalCode: string;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const response = await repairOrdersApi.getAll();
    return response.data as Order[];
  } catch {
    return [];
  }
}

export async function saveOrder(order: Order): Promise<void> {
  await repairOrdersApi.save(order);
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  await repairOrdersApi.updateStatus(id, status);
}

export async function deleteOrder(id: string): Promise<void> {
  await repairOrdersApi.delete(id);
}

export function generateOrderId(): string {
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `#ORD-${random}`;
}

export async function getBookedTimesForDate(date: string): Promise<string[]> {
  try {
    const response = await repairOrdersApi.getBookedTimes(date);
    return response.data as string[];
  } catch {
    return [];
  }
}
