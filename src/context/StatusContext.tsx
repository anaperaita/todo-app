/**
 * StatusContext - Provides global access to status management
 * Wraps useStatusStorage hook and makes it available throughout the app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useStatusStorage } from '../hooks/useStatusStorage';
import {
  Status,
  CreateStatusInput,
  UpdateStatusInput,
} from '../types/todo.types';

interface StatusContextValue {
  statuses: Status[];
  addStatus: (input: CreateStatusInput) => void;
  updateStatus: (id: string, updates: UpdateStatusInput) => void;
  deleteStatus: (id: string) => void;
  reorderStatuses: (statusIds: string[]) => void;
  getStatusById: (id: string) => Status | undefined;
  statusExists: (statusId: string) => boolean;
  getFirstStatus: () => Status | undefined;
}

const StatusContext = createContext<StatusContextValue | undefined>(undefined);

interface StatusProviderProps {
  children: ReactNode;
}

/**
 * StatusProvider component - wraps the app to provide status context
 */
export function StatusProvider({ children }: StatusProviderProps): JSX.Element {
  const statusStorage = useStatusStorage();

  return (
    <StatusContext.Provider value={statusStorage}>
      {children}
    </StatusContext.Provider>
  );
}

/**
 * useStatuses hook - access status context from any component
 */
export function useStatuses(): StatusContextValue {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useStatuses must be used within a StatusProvider');
  }
  return context;
}
