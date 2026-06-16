import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the AuthContext if needed
vi.mock('./context/AuthContext', () => ({
  useAuth: () => ({
    username: 'TestUser',
    isAuthenticated: true,
  }),
}));
