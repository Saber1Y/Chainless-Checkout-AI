import { create } from "zustand";
import type { GeneratedProduct, BuilderKit, InvoiceReceipt } from "@/types";

interface AppState {
  // Merchant
  currentProduct: GeneratedProduct | null;
  setCurrentProduct: (product: GeneratedProduct | null) => void;

  // Buyer
  currentInvoice: InvoiceReceipt | null;
  setCurrentInvoice: (invoice: InvoiceReceipt | null) => void;

  // Builder kit
  currentKit: BuilderKit | null;
  setCurrentKit: (kit: BuilderKit | null) => void;

  // Payment progress
  progressSteps: { label: string; status: string }[];
  setProgressSteps: (steps: { label: string; status: string }[]) => void;
  updateStepStatus: (index: number, status: string) => void;

  // UI
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  error: string | null;
  setError: (err: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  currentProduct: null,
  setCurrentProduct: (product) => set({ currentProduct: product }),

  currentInvoice: null,
  setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),

  currentKit: null,
  setCurrentKit: (kit) => set({ currentKit: kit }),

  progressSteps: [],
  setProgressSteps: (steps) => set({ progressSteps: steps }),
  updateStepStatus: (index, status) =>
    set((state) => {
      const steps = [...state.progressSteps];
      if (steps[index]) {
        steps[index] = { ...steps[index], status };
      }
      return { progressSteps: steps };
    }),

  isGenerating: false,
  setIsGenerating: (val) => set({ isGenerating: val }),
  error: null,
  setError: (err) => set({ error: err }),
}));
