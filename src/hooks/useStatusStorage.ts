/**
 * Custom hook for managing status CRUD operations with localStorage
 * Provides centralized status management with validation and persistence
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Status,
  CreateStatusInput,
  UpdateStatusInput,
  MAX_STATUSES,
} from '../types/todo.types';

const STORAGE_KEY = 'statuses';

/**
 * Generate default statuses on first load
 */
function generateDefaultStatuses(): Status[] {
  const now = new Date().toISOString();

  return [
    {
      id: 'status-todo',
      label: 'To Do',
      value: 'todo',
      color: 'color-7',
      colorName: 'Warm Amber',
      description: 'Tasks that need to be started',
      position: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'status-inprogress',
      label: 'In Progress',
      value: 'inProgress',
      color: 'color-1',
      colorName: 'Terracotta',
      description: 'Tasks currently being worked on',
      position: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'status-done',
      label: 'Done',
      value: 'done',
      color: 'color-2',
      colorName: 'Sage',
      description: 'Completed tasks',
      position: 3,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

/**
 * Load statuses from localStorage
 */
function loadStatuses(): Status[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // If no statuses exist, initialize with defaults
    const defaults = generateDefaultStatuses();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  } catch (error) {
    console.error('Failed to load statuses from localStorage:', error);
    return generateDefaultStatuses();
  }
}

/**
 * Save statuses to localStorage
 */
function saveStatuses(statuses: Status[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
  } catch (error) {
    console.error('Failed to save statuses to localStorage:', error);
  }
}

/**
 * Generate unique status ID
 */
function generateStatusId(): string {
  return `status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Custom hook for status storage and management
 */
export function useStatusStorage() {
  const [statuses, setStatuses] = useState<Status[]>(loadStatuses);

  // Sync to localStorage whenever statuses change
  useEffect(() => {
    saveStatuses(statuses);
  }, [statuses]);

  /**
   * Add a new status
   */
  const addStatus = useCallback((input: CreateStatusInput): void => {
    setStatuses((prev) => {
      // Validate max statuses limit
      if (prev.length >= MAX_STATUSES) {
        throw new Error(`Cannot add status: maximum of ${MAX_STATUSES} statuses allowed`);
      }

      // Validate duplicate labels (case-insensitive)
      const labelExists = prev.some(
        (s) => s.label.toLowerCase() === input.label.toLowerCase()
      );
      if (labelExists) {
        throw new Error(`Status with label "${input.label}" already exists`);
      }

      const now = new Date().toISOString();
      const newStatus: Status = {
        ...input,
        id: generateStatusId(),
        createdAt: now,
        updatedAt: now,
      };

      return [...prev, newStatus];
    });
  }, []);

  /**
   * Update an existing status
   */
  const updateStatus = useCallback((id: string, updates: UpdateStatusInput): void => {
    setStatuses((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      if (index === -1) {
        throw new Error(`Status with id "${id}" not found`);
      }

      // If updating label, check for duplicates (excluding current status)
      if (updates.label) {
        const labelExists = prev.some(
          (s, i) => i !== index && s.label.toLowerCase() === updates.label!.toLowerCase()
        );
        if (labelExists) {
          throw new Error(`Status with label "${updates.label}" already exists`);
        }
      }

      const updatedStatus: Status = {
        ...prev[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const newStatuses = [...prev];
      newStatuses[index] = updatedStatus;
      return newStatuses;
    });
  }, []);

  /**
   * Delete a status
   */
  const deleteStatus = useCallback((id: string): void => {
    setStatuses((prev) => {
      const exists = prev.some((s) => s.id === id);
      if (!exists) {
        throw new Error(`Status with id "${id}" not found`);
      }

      return prev.filter((s) => s.id !== id);
    });
  }, []);

  /**
   * Reorder statuses
   */
  const reorderStatuses = useCallback((orderedIds: string[]): void => {
    setStatuses((prev) => {
      // Create a map for quick lookup
      const statusMap = new Map(prev.map((s) => [s.id, s]));

      // Build new array with updated positions
      return orderedIds.map((id, index) => {
        const status = statusMap.get(id);
        if (!status) {
          throw new Error(`Status with id "${id}" not found`);
        }
        return {
          ...status,
          position: index + 1,
          updatedAt: new Date().toISOString(),
        };
      });
    });
  }, []);

  /**
   * Get status by ID
   */
  const getStatusById = useCallback(
    (id: string): Status | undefined => {
      return statuses.find((s) => s.id === id);
    },
    [statuses]
  );

  /**
   * Check if a status value exists
   */
  const statusExists = useCallback(
    (statusId: string): boolean => {
      return statuses.some((s) => s.id === statusId);
    },
    [statuses]
  );

  /**
   * Get first status (default)
   */
  const getFirstStatus = useCallback((): Status | undefined => {
    return statuses.length > 0 ? statuses[0] : undefined;
  }, [statuses]);

  return {
    statuses,
    addStatus,
    updateStatus,
    deleteStatus,
    reorderStatuses,
    getStatusById,
    statusExists,
    getFirstStatus,
  };
}
