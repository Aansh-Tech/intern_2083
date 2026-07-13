export interface ApiResponse<T = any> {
  success: boolean;
  message?: string; 
  data: T;  // Made optional - some APIs might return just success/message
  errors?: Record<string, string[]>;  // For validation errors from Laravel
  status?: number;  // HTTP status code
}

