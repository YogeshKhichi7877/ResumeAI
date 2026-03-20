// src/components/ErrorBoundary.jsx
import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="neo-card p-8 text-center">
          <h2 className="font-space text-2xl font-extrabold mb-2">Something went wrong , Its not your fault</h2>
          <button className="neo-button mt-4" onClick={() => window.location.href = '/'}>
            Go Home
          </button>
        </div>
      </div>
    );
    return this.props.children;
  }
}