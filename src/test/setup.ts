import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Executa cleanup após cada teste automaticamente (opcional, mas recomendado)
afterEach(() => {
  cleanup();
});
