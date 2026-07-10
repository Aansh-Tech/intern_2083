export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;  // Made optional - some APIs might return just success/message
  errors?: Record<string, string[]>;  // For validation errors from Laravel
  status?: number;  // HTTP status code
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}