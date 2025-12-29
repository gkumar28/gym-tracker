import React, { Component, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { ErrorScreen } from '../screens/ErrorScreen';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkError = this.state.error?.message.includes('Network Error') ||
                           this.state.error?.message.includes('timeout') ||
                           this.state.error?.message.includes('ENOTFOUND') ||
                           this.state.error?.message.includes('ECONNREFUSED');

      return (
        <ErrorScreen
          error={isNetworkError ? 'Network error occurred. Please check your connection.' : this.state.error?.message}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
