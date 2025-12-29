import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

export type NavigationType = NativeStackNavigationProp<RootStackParamList>;

export class NetworkErrorHandler {
  static handleNetworkError(
    error: any,
    navigation?: NavigationType
  ): boolean {
    const isNetworkError = this.isNetworkError(error);
    
    if (isNetworkError && navigation) {
      const errorMessage = this.getErrorMessage(error);
      navigation.navigate('Error', { error: errorMessage });
      return true;
    }
    
    return isNetworkError;
  }

  static isNetworkError(error: any): boolean {
    if (!error) return false;
    
    const errorMessage = error.message?.toLowerCase() || '';
    const errorString = String(error).toLowerCase();
    
    return (
      errorMessage.includes('network error') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('enotfound') ||
      errorMessage.includes('econnrefused') ||
      errorMessage.includes('failed to fetch') ||
      errorString.includes('network error') ||
      errorString.includes('timeout') ||
      errorString.includes('enotfound') ||
      errorString.includes('econnrefused') ||
      errorString.includes('failed to fetch') ||
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED'
    );
  }

  static getErrorMessage(error: any): string {
    if (error?.message) {
      if (error.message.includes('timeout')) {
        return 'Request timed out. Please check your connection and try again.';
      }
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        return 'Unable to connect to server. Please check your internet connection.';
      }
      if (error.message.includes('Network Error')) {
        return 'Network error occurred. Please check your internet connection.';
      }
      return error.message;
    }
    
    return 'A network error occurred. Please try again.';
  }

  static createRetryFunction<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let retryCount = 0;
      
      const attempt = async () => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          retryCount++;
          
          if (retryCount >= maxRetries || !this.isNetworkError(error)) {
            reject(error);
            return;
          }
          
          console.log(`Retrying operation (${retryCount}/${maxRetries}) after ${delay}ms...`);
          setTimeout(attempt, delay * retryCount);
        }
      };
      
      attempt();
    });
  }
}
