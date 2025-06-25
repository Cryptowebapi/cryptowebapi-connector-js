// Re-export Axios error types for users who want to handle specific error types
export { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';

// Type guard to check if error is an Axios error
export function isAxiosError(error: any): error is AxiosError {
  return error != null && error.isAxiosError === true;
}

// Helper function to get error message from Axios error
export function getErrorMessage(error: any): string {
  if (isAxiosError(error)) {
    return (error.response?.data as any)?.message || error.message || 'Request failed';
  }
  return (error as any)?.message || 'Unknown error occurred';
}

// Helper function to get status code from Axios error
export function getErrorStatus(error: any): number | undefined {
  if (isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
}
