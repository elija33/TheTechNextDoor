import { repairServicesApi } from '../services/api';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
}

export async function getServices(): Promise<Service[]> {
  try {
    const response = await repairServicesApi.getAll();
    return response.data as Service[];
  } catch {
    return [];
  }
}

export async function saveService(service: Service): Promise<void> {
  await repairServicesApi.save(service);
}

export async function deleteService(id: string): Promise<void> {
  await repairServicesApi.delete(id);
}
