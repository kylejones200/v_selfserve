import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 px-4">
          <h1 className="text-lg font-semibold text-zinc-100">Something went wrong</h1>
          <p className="mt-2 text-sm text-zinc-400 text-center max-w-md">
            The app encountered an error. Try refreshing the page. If it persists, clear site data and sign in again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-4 py-2 text-sm font-medium"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
