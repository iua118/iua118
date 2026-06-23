import authApi from './auth';

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
  stage?: string;
  score: number;
  notes?: string;
  tags?: string[];
  assignedToId?: string;
  assignedTo?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: string;
  source?: string;
  assignedToId?: string;
  search?: string;
}

export interface LeadResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Lấy danh sách leads
export async function getLeads(filters: LeadFilters = {}): Promise<LeadResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.status) params.append('status', filters.status);
  if (filters.source) params.append('source', filters.source);
  if (filters.assignedToId) params.append('assignedToId', filters.assignedToId);
  if (filters.search) params.append('search', filters.search);

  const response = await authApi.get(`/leads?${params.toString()}`);
  return response.data;
}

// Lấy chi tiết lead
export async function getLead(id: string): Promise<Lead> {
  const response = await authApi.get(`/leads/${id}`);
  return response.data;
}

// Tạo lead mới
export async function createLead(data: any): Promise<Lead> {
  const response = await authApi.post('/leads', data);
  return response.data;
}

// Cập nhật lead
export async function updateLead(id: string, data: any): Promise<Lead> {
  const response = await authApi.put(`/leads/${id}`, data);
  return response.data;
}

// Xóa lead
export async function deleteLead(id: string): Promise<void> {
  await authApi.delete(`/leads/${id}`);
}

// Gán lead cho nhân viên
export async function assignLead(id: string, assignedToId: string): Promise<Lead> {
  const response = await authApi.put(`/leads/${id}/assign`, {
    assignedToId,
  });
  return response.data;
}

// Cập nhật trạng thái lead
export async function updateLeadStatus(id: string, status: string): Promise<Lead> {
  const response = await authApi.put(`/leads/${id}/status`, {
    status,
  });
  return response.data;
}

// Cập nhật điểm số lead
export async function updateLeadScore(id: string, score: number): Promise<Lead> {
  const response = await authApi.put(`/leads/${id}/score`, {
    score,
  });
  return response.data;
}

// Lấy thống kê
export async function getLeadStats(assignedToId?: string) {
  const params = assignedToId ? `?assignedToId=${assignedToId}` : '';
  const response = await authApi.get(`/leads/stats/overview${params}`);
  return response.data;
}

// Lấy leads theo nguồn
export async function getLeadsBySource() {
  const response = await authApi.get('/leads/stats/by-source');
  return response.data;
}
