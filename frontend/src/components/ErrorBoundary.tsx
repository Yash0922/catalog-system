import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '../utils/performance';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Oops! Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            <details className="error-details">
              <summary>Error details</summary>
              <pre>{this.state.error?.message}</pre>
              <pre>{this.state.error?.stack}</pre>
            </details>
            <button
              className="error-boundary-button"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Styled error boundary CSS (add to App.css)
export const errorBoundaryStyles = `
.error-boundary {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
  background: rgba(254, 226, 226, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin: 2rem;
  border: 2px solid #fca5a5;
}

.error-boundary-content {
  text-align: center;
  max-width: 500px;
}

.error-boundary h2 {
  color: #dc2626;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.error-boundary p {
  color: #7f1d1d;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.error-details {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: left;
}

.error-details summary {
  cursor: pointer;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.error-details pre {
  font-size: 0.8rem;
  color: #7f1d1d;
  white-space: pre-wrap;
  word-break: break-word;
}

.error-boundary-button {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.error-boundary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
}
`;