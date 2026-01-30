import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Auto-redirect to home after 1 second
    setTimeout(() => {
      window.location.href = '/home';
    }, 1000);
  }

  public render() {
    if (this.state.hasError) {
      // Silent redirect to home instead of showing error
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen bg-white p-4">
          <div className="text-center max-w-md">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">
                Redirecting to home...
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;