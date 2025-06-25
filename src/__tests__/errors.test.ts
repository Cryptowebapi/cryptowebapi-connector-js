import {
  AxiosError,
  isAxiosError,
  getErrorMessage,
  getErrorStatus,
} from '../errors';

describe('Error Utilities', () => {
  describe('isAxiosError', () => {
    it('should return true for axios errors', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Request failed',
        response: {
          status: 500,
          data: { message: 'Server error' }
        }
      };

      expect(isAxiosError(axiosError)).toBe(true);
    });

    it('should return false for regular errors', () => {
      const regularError = new Error('Regular error');
      expect(isAxiosError(regularError)).toBe(false);
    });

    it('should return false for non-error objects', () => {
      expect(isAxiosError(null)).toBe(false);
      expect(isAxiosError(undefined)).toBe(false);
      expect(isAxiosError({})).toBe(false);
      expect(isAxiosError('string')).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from axios error response data', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Request failed',
        response: {
          status: 400,
          data: { message: 'Validation failed' }
        }
      };

      expect(getErrorMessage(axiosError)).toBe('Validation failed');
    });

    it('should fall back to axios error message', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Network Error',
        response: {
          status: 500,
          data: {}
        }
      };

      expect(getErrorMessage(axiosError)).toBe('Network Error');
    });

    it('should handle axios error without response', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Connection timeout'
      };

      expect(getErrorMessage(axiosError)).toBe('Connection timeout');
    });

    it('should handle regular errors', () => {
      const regularError = new Error('Something went wrong');
      expect(getErrorMessage(regularError)).toBe('Something went wrong');
    });

    it('should handle unknown errors', () => {
      expect(getErrorMessage(null)).toBe('Unknown error occurred');
      expect(getErrorMessage({})).toBe('Unknown error occurred');
    });
  });

  describe('getErrorStatus', () => {
    it('should extract status from axios error', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Request failed',
        response: {
          status: 404,
          data: { message: 'Not found' }
        }
      };

      expect(getErrorStatus(axiosError)).toBe(404);
    });

    it('should return undefined for axios error without response', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Network Error'
      };

      expect(getErrorStatus(axiosError)).toBeUndefined();
    });

    it('should return undefined for regular errors', () => {
      const regularError = new Error('Something went wrong');
      expect(getErrorStatus(regularError)).toBeUndefined();
    });

    it('should return undefined for unknown errors', () => {
      expect(getErrorStatus(null)).toBeUndefined();
      expect(getErrorStatus({})).toBeUndefined();
    });
  });
});
