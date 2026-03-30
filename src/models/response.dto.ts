export interface ApiResponse<T = void> {
  success: boolean;
  data?: T | null;
  message?: string;
  errors?: string[];
}