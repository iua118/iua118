import { create } from 'zustand';
import * as leadsApi from '../api/leads';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source: string;
  status: string;
  score: number;
}

interface LeadsState {
  leads: Lead[];
  currentLead: Lead | null;
  total: number;
  page: number;
  limit: number;
  pages: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    source?: string;
    assignedToId?: string;
    search?: string;
  };

  // Actions
  setFilters: (filters: any) => void;
  fetchLeads: (page?: number) => Promise<void>;
  fetchLead: (id: string) => Promise<void>;
  createLead: (data: any) => Promise<void>;
  updateLead: (id: string, data: any) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  assignLead: (id: string, assignedToId: string) => Promise<void>;
  updateLeadStatus: (id: string, status: string) => Promise<void>;
  clearCurrentLead: () => void;
  clearError: () => void;
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  currentLead: null,
  total: 0,
  page: 1,
  limit: 20,
  pages: 0,
  isLoading: false,
  error: null,
  filters: {},

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters }, page: 1 })),

  fetchLeads: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const state = get();
      const response = await leadsApi.getLeads({
        page,
        limit: state.limit,
        ...state.filters,
      });
      set({
        leads: response.data,
        total: response.total,
        page: response.page,
        pages: response.pages,
      });
    } catch (error: any) {
      set({ error: error.message || 'Lỗi khi tải danh sách leads' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLead: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const lead = await leadsApi.getLead(id);
      set({ currentLead: lead });
    } catch (error: any) {
      set({ error: error.message || 'Lỗi khi tải lead' });
    } finally {
      set({ isLoading: false });
    }
  },

  createLead: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const lead = await leadsApi.createLead(data);
      set((state) => ({
        leads: [lead, ...state.leads],
        total: state.total + 1,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Lỗi khi tạo lead' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateLead: async (id: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const updatedLead = await leadsApi.updateLead(id, data);
      set((state) => ({
        leads: state.leads.map((lead) => (lead.id === id ? updatedLead : lead)),
        currentLead: state.currentLead?.id === id ? updatedLead : state.currentLead,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Lỗi khi cập nhật lead' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteLead: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await leadsApi.deleteLead(id);
      set((state) => ({
        leads: state.leads.filter((lead) => lead.id !== id),
        total: state.total - 1,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Lỗi khi xóa lead' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  assignLead: async (id: string, assignedToId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedLead = await leadsApi.assignLead(id, assignedToId);
      set((state) => ({
        leads: state.leads.map((lead) => (lead.id === id ? updatedLead : lead)),
        currentLead: state.currentLead?.id === id ? updatedLead : state.currentLead,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Lỗi khi gán lead' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateLeadStatus: async (id: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedLead = await leadsApi.updateLeadStatus(id, status);
      set((state) => ({
        leads: state.leads.map((lead) => (lead.id === id ? updatedLead : lead)),
        currentLead: state.currentLead?.id === id ? updatedLead : state.currentLead,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Lỗi khi cập nhật trạng thái' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCurrentLead: () => set({ currentLead: null }),
  clearError: () => set({ error: null }),
}));
