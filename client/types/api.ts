// app/types/api.ts
export interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDTO {
  name: string;
  description: string;
}

export interface UpdateItemDTO extends Partial<CreateItemDTO> {
  id: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
