// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'ADMIN' | 'MANAGER' | 'USER' | 'VIEWER';
  department?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

// Lead Types
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source: LeadSource;
  status: LeadStatus;
  stage?: string;
  score: number;
  assignedToId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum LeadSource {
  WEBSITE = 'WEBSITE',
  FACEBOOK_ADS = 'FACEBOOK_ADS',
  GOOGLE_ADS = 'GOOGLE_ADS',
  TIKTOK_ADS = 'TIKTOK_ADS',
  REFERRAL = 'REFERRAL',
  MANUAL = 'MANUAL',
  LANDING_PAGE = 'LANDING_PAGE',
  API = 'API',
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  NURTURING = 'NURTURING',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

// Deal Types
export interface Deal {
  id: string;
  name: string;
  description?: string;
  accountId?: string;
  amount: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate?: Date;
  status: DealStatus;
  assignedToId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DealStage {
  PROSPECTING = 'PROSPECTING',
  QUALIFICATION = 'QUALIFICATION',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSING = 'CLOSING',
  WON = 'WON',
  LOST = 'LOST',
}

export enum DealStatus {
  OPEN = 'OPEN',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
  STALLED = 'STALLED',
}

// Contact Types
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  accountId?: string;
  role: 'DECISION_MAKER' | 'INFLUENCER' | 'USER' | 'CHAMPION' | 'BLOCKER' | 'ECONOMIC_BUYER';
  createdAt: Date;
  updatedAt: Date;
}

// Account Types
export interface Account {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  type: 'PROSPECT' | 'CUSTOMER' | 'PARTNER' | 'COMPETITOR';
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: Date;
  dealId?: string;
  assignedToId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Activity Types
export enum ActivityType {
  LEAD_CREATED = 'LEAD_CREATED',
  LEAD_UPDATED = 'LEAD_UPDATED',
  DEAL_CREATED = 'DEAL_CREATED',
  DEAL_UPDATED = 'DEAL_UPDATED',
  EMAIL_SENT = 'EMAIL_SENT',
  CALL_MADE = 'CALL_MADE',
  MEETING_SCHEDULED = 'MEETING_SCHEDULED',
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  userId?: string;
  leadId?: string;
  dealId?: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
