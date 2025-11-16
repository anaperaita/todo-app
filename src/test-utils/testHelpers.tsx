/**
 * Test utilities and helpers
 */
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { StatusProvider } from '../context/StatusContext';
import { Status } from '../types';

/**
 * Default status IDs for testing (matching useStatusStorage defaults)
 */
export const TEST_STATUS_IDS = {
  TODO: 'status-todo',
  IN_PROGRESS: 'status-inprogress',
  DONE: 'status-done',
} as const;

/**
 * Mock Status objects for testing
 */
export const MOCK_STATUSES: Record<string, Status> = {
  TODO: {
    id: TEST_STATUS_IDS.TODO,
    label: 'To Do',
    value: 'todo',
    color: 'in-progress-blue',
    colorName: 'In Progress Blue',
    description: 'Tasks that need to be started',
    position: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  IN_PROGRESS: {
    id: TEST_STATUS_IDS.IN_PROGRESS,
    label: 'In Progress',
    value: 'inProgress',
    color: 'warning-yellow',
    colorName: 'Warning Yellow',
    description: 'Tasks currently being worked on',
    position: 2,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  DONE: {
    id: TEST_STATUS_IDS.DONE,
    label: 'Done',
    value: 'done',
    color: 'success-green',
    colorName: 'Success Green',
    description: 'Completed tasks',
    position: 3,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
};

/**
 * Custom render function that wraps components with StatusProvider
 */
export function renderWithStatus(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => <StatusProvider>{children}</StatusProvider>,
    ...options,
  });
}

// Re-export everything from testing library
export * from '@testing-library/react';
