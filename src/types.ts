import type { z } from "@deepseek-ai/schemastery";

export const ProtocolCategory = "NTN" | "TN" | "HOLOGRAPHIC" | "NEAR_FIELD" | "FAR_FIELD" | "HYBRID" | "SAFETY" | "MISC";

export interface ProtocolEntry {
  id: string;
  name: string;
  category: ProtocolCategory;
  subcategory: string;
  release: string;
  description: string;
  keyFeatures: string[];
  url?: string;
}

export type ProtocolMap = Record<string, ProtocolEntry>;
export type CategoryMap = Record<ProtocolCategory, ProtocolEntry[]>;

export interface QueryResult {
  total: number;
  entries: ProtocolEntry[];
  categoryCounts: Partial<Record<ProtocolCategory, number>>;
}

export interface BrowseResult {
  categories: Array<{
    key: ProtocolCategory;
    label: string;
    count: number;
    entries: ProtocolEntry[];
  }>;
}

export type CommProtocolService = {
  queryProtocol(query: string): QueryResult;
  browseByCategory(): BrowseResult;
  getProtocolById(id: string): ProtocolEntry | null;
};
