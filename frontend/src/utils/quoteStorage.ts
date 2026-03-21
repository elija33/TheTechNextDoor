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

const DEFAULT_OPTIONS: QuoteOptions = {
  brands: ["Apple"],
  groupings: [
    {
      brand: "Apple",
      groupings: [
        "iPhone 16 Series", "iPhone 15 Series", "iPhone 14 Series",
        "iPhone 13 Series", "iPhone 12 Series", "iPhone 11 Series",
        "iPhone X Series", "iPhone 8 Series", "iPhone 7 Series", "iPhone SE Series",
      ],
    },
  ],
  models: [
    { brand: "Apple", grouping: "iPhone 16 Series", models: ["iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max"] },
    { brand: "Apple", grouping: "iPhone 15 Series", models: ["iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max"] },
    { brand: "Apple", grouping: "iPhone 14 Series", models: ["iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max"] },
    { brand: "Apple", grouping: "iPhone 13 Series", models: ["iPhone 13", "iPhone 13 Mini", "iPhone 13 Pro", "iPhone 13 Pro Max"] },
    { brand: "Apple", grouping: "iPhone 12 Series", models: ["iPhone 12", "iPhone 12 Mini", "iPhone 12 Pro", "iPhone 12 Pro Max"] },
    { brand: "Apple", grouping: "iPhone 11 Series", models: ["iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max"] },
    { brand: "Apple", grouping: "iPhone X Series", models: ["iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max"] },
    { brand: "Apple", grouping: "iPhone 8 Series", models: ["iPhone 8", "iPhone 8 Plus"] },
    { brand: "Apple", grouping: "iPhone SE Series", models: ["iPhone SE (1st Gen)", "iPhone SE (2nd Gen)", "iPhone SE (3rd Gen)"] },
  ],
  services: [
    "Screen Repair", "Battery Replacement", "Charging Port Repair",
    "Camera Repair", "Speaker Repair", "Back Glass Replacement", "Software Issues", "Other",
  ],
};

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

export async function getQuoteOptions(): Promise<QuoteOptions> {
  try {
    const response = await settingsApi.get('quoteOptions');
    if (response.data) {
      const saved = JSON.parse(response.data) as Partial<QuoteOptions>;
      return {
        brands: saved.brands?.length ? saved.brands : DEFAULT_OPTIONS.brands,
        groupings: saved.groupings?.length ? saved.groupings : DEFAULT_OPTIONS.groupings,
        models: saved.models?.length ? saved.models : DEFAULT_OPTIONS.models,
        services: saved.services?.length ? saved.services : DEFAULT_OPTIONS.services,
      };
    }
    return DEFAULT_OPTIONS;
  } catch {
    return DEFAULT_OPTIONS;
  }
}

export async function saveQuoteOptions(options: QuoteOptions): Promise<void> {
  await settingsApi.save('quoteOptions', JSON.stringify(options));
}

export function getDefaultOptions(): QuoteOptions {
  return { ...DEFAULT_OPTIONS };
}
