// ==========================================
// Partner Banner Types
// ==========================================

export interface IPartner {
  id: number;
  name: string;
  logo: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerCreationAttributes {
  name: string;
  logo?: string | null;
  orderIndex?: number;
  isActive?: boolean;
}

export interface CreatePartnerRequest {
  name: string;
  logo?: string | null;
  orderIndex?: number;
  isActive?: boolean;
}

export interface UpdatePartnerRequest {
  name?: string;
  logo?: string | null;
  orderIndex?: number;
  isActive?: boolean;
}

export interface PartnerQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PartnerListResult {
  total: number;
  totalPages: number;
  currentPage: number;
  partners: IPartner[];
}
