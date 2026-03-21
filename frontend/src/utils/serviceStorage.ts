import { repairServicesApi } from '../services/api';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
}

const DEFAULT_SERVICES: Service[] = [
  { id: "1", name: "Screen Repair", description: "Fix cracked or broken screens for all phone models.", price: "$89.99" },
  { id: "2", name: "Battery Replacement", description: "Replace old or faulty batteries to restore battery life.", price: "$49.99" },
  { id: "4", name: "Charging Port Fix", description: "Repair or replace faulty charging ports.", price: "$39.99" },
  { id: "5", name: "Speaker Repair", description: "Fix audio issues and replace damaged speakers.", price: "$59.99" },
  { id: "6", name: "Camera Fix", description: "Repair front or rear cameras for clear photos.", price: "$69.99" },
  { id: "7", name: "Back Glass Repair", description: "Replace cracked back glass panels.", price: "$79.99" },
  { id: "8", name: "Software Troubleshooting", description: "Fix software issues, updates, and data recovery.", price: "$29.99" },
];

export async function getServices(): Promise<Service[]> {
  try {
    const response = await repairServicesApi.getAll();
    const services = response.data as Service[];
    return services.length > 0 ? services : DEFAULT_SERVICES;
  } catch {
    return DEFAULT_SERVICES;
  }
}

export async function saveService(service: Service): Promise<void> {
  await repairServicesApi.save(service);
}

export async function deleteService(id: string): Promise<void> {
  await repairServicesApi.delete(id);
}

export async function initializeServices(): Promise<void> {
  // No-op — backend initializes on first save
}

export function getDefaultServices(): Service[] {
  return [...DEFAULT_SERVICES];
}
