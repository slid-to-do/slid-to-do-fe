'use client'

import { useQueryErrorResetBoundary } from '@tanstack/react-query';

import { ErrorBoundaryWrapper } from '../error-boundary';

export function ErrorBoundaryProvider({ children }: { children: React.ReactNode }) {
    const { reset } = useQueryErrorResetBoundary();
    return <ErrorBoundaryWrapper onReset={reset}>{children}</ErrorBoundaryWrapper>;
  }