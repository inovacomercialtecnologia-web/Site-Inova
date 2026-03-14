import React, { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080808] text-[#FAFAF8] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-light tracking-tight mb-4">Algo deu errado</h1>
            <p className="text-white/50 font-light mb-8">Ocorreu um erro inesperado. Tente recarregar a página.</p>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#080808] bg-[#C9A84C] px-8 py-3 hover:bg-[#E8C97A] transition-colors"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
