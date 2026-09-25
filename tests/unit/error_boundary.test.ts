import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { ErrorBoundary } from '../../src/engine/ErrorBoundary';

describe('Global ErrorBoundary', () => {
  it('harus menghasilkan state error saat getDerivedStateFromError dipanggil', () => {
    const error = new Error('Test fatal crash in React render tree');
    const state = ErrorBoundary.getDerivedStateFromError(error);

    expect(state.hasError).toBe(true);
    expect(state.error).toBe(error);
    expect(state.emergencySave).toBe('');
  });

  it('harus mencatat error ke console saat componentDidCatch dipanggil', () => {
    const error = new Error('Simulated runtime error');
    const errorInfo: React.ErrorInfo = { componentStack: 'at Dashboard' };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const boundary = new ErrorBoundary({ children: React.createElement('div', null, 'Normal content') });

    boundary.componentDidCatch(error, errorInfo);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unhandled render error caught by EverLife ErrorBoundary:'),
      error,
      errorInfo
    );

    consoleSpy.mockRestore();
  });

  it('harus merender children ketika state hasError bernilai false', () => {
    const child = React.createElement('span', null, 'Aplikasi Berjalan Normal');
    const boundary = new ErrorBoundary({ children: child });
    boundary.state = { hasError: false, error: null, emergencySave: '', copyFeedback: '' };

    const rendered = boundary.render();
    expect(rendered).toBe(child);
  });

  it('harus merender UI recovery saat state hasError bernilai true', () => {
    const boundary = new ErrorBoundary({ children: React.createElement('div', null, 'Crash') });
    boundary.state = {
      hasError: true,
      error: new Error('Render crash UI test'),
      emergencySave: '{"dummy":"save"}',
      copyFeedback: 'Data save berhasil disalin',
    };

    const rendered = boundary.render() as React.ReactElement;
    expect(rendered).toBeDefined();
    expect(rendered.type).toBe('div');
  });
});
