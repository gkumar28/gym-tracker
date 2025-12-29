import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NetworkErrorHandler, NavigationType } from '../utils/networkErrorHandler';

interface UseApiCallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showNetworkErrorScreen?: boolean;
}

export function useApiCall(options: UseApiCallOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationType>();

  const {
    onSuccess,
    onError,
    showNetworkErrorScreen = true
  } = options;

  const execute = useCallback(async <T>(
    apiCall: () => Promise<T>,
    customErrorHandler?: (error: any) => void
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err as any;
      
      if (NetworkErrorHandler.isNetworkError(error)) {
        const errorMessage = NetworkErrorHandler.getErrorMessage(error);
        setError(errorMessage);
        
        if (showNetworkErrorScreen) {
          NetworkErrorHandler.handleNetworkError(error, navigation);
        }
        
        customErrorHandler?.(error);
        onError?.(error);
      } else {
        const errorMessage = error?.message || 'An unexpected error occurred';
        setError(errorMessage);
        customErrorHandler?.(error);
        onError?.(error);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [navigation, onSuccess, onError, showNetworkErrorScreen]);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return {
    execute,
    loading,
    error,
    reset,
    isNetworkError: error ? NetworkErrorHandler.isNetworkError({ message: error }) : false
  };
}
