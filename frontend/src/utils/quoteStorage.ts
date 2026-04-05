import { quoteRequestsApi, settingsApi } from '../services/api';

export interface QuoteRequest {
  id: string;
  brand: string;
  grouping: string;
  model: string;
  service: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timestamp: number;
  status: "pending" | "reviewed" | "completed";
}

export interface QuoteOptions {
  brands: string[];
  groupings: { brand: string; groupings: string[] }[];
  models: { brand: string; grouping: string; models: string[] }[];
  services: string[];
}


export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  try {
    const response = await quoteRequestsApi.getAll();
    return response.data as QuoteRequest[];
  } catch {
    return [];
  }
}

export async function saveQuoteRequest(quote: QuoteRequest): Promise<void> {
  await quoteRequestsApi.save(quote);
}

export async function updateQuoteStatus(id: string, status: QuoteRequest["status"]): Promise<void> {
  await quoteRequestsApi.updateStatus(id, status);
}

export async function deleteQuoteRequest(id: string): Promise<void> {
  await quoteRequestsApi.delete(id);
}

export async function getQuoteOptions(): Promise<QuoteOptions | null> {
  try {
    const response = await settingsApi.get('quoteOptions');
    if (response.data) {
      const saved = (typeof response.data === 'string'
        ? JSON.parse(response.data)
        : response.data) as Partial<QuoteOptions>;
      if (saved && (Array.isArray(saved.brands) || Array.isArray(saved.services))) {
        return {
          brands: Array.isArray(saved.brands) ? saved.brands : [],
          groupings: Array.isArray(saved.groupings) ? saved.groupings : [],
          models: Array.isArray(saved.models) ? saved.models : [],
          services: Array.isArray(saved.services) ? saved.services : [],
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveQuoteOptions(options: QuoteOptions): Promise<void> {
  await settingsApi.save('quoteOptions', JSON.stringify(options));
}
