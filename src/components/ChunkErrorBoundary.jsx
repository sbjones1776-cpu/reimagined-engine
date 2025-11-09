import React from 'react';

// ErrorBoundary to catch dynamic import (lazy chunk) failures and surface recovery options
export default class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ChunkErrorBoundary caught an error:', error, info);
  }

  hardReload = () => {
    window.location.reload(true);
  };

  clearCachesAndReload = async () => {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to clear caches or unregister SW', e);
    } finally {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message || '';
      const isChunkError =
        this.state.error?.name === 'ChunkLoadError' ||
        this.state.error?.name === 'CSSChunkLoadError' ||
        /Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
          message
        );

      if (isChunkError) {
        return (
          <div className="min-h-[60vh] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <div className="mb-4 text-3xl">⚠️</div>
              <h2 className="text-xl font-semibold mb-2">Update available</h2>
              <p className="text-gray-600 mb-4">
                The app was updated. Please refresh to load the latest version.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={this.hardReload}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white"
                >
                  Refresh
                </button>
                <button
                  onClick={this.clearCachesAndReload}
                  className="px-4 py-2 rounded-lg bg-gray-200"
                >
                  Reset cache & reload
                </button>
              </div>
              <details className="mt-4 text-left text-xs text-gray-500">
                <summary>Details</summary>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.error?.stack || message}
                </pre>
              </details>
            </div>
          </div>
        );
      }

      // Fallback for other errors
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="mb-4 text-3xl">💥</div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
