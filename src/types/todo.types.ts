/**
 * Shared types and interfaces for the TODO list application
 */

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum SortOption {
  DATE_ADDED = 'dateAdded',
  DATE_ADDED_DESC = 'dateAddedDesc',
  DUE_DATE = 'dueDate',
  DUE_DATE_DESC = 'dueDateDesc',
  PRIORITY = 'priority',
  ALPHABETICAL = 'alphabetical',
}

/**
 * Status configuration interface for dynamic status management
 */
export interface Status {
  id: string;
  label: string;              // Display name (e.g., "To Do", "In Progress")
  value: string;              // Unique identifier (e.g., "todo", "in-progress")
  color: string;              // Color ID from palette
  colorName: string;          // Semantic color name (e.g., "Success Green")
  description: string;        // Optional description of when to use this status
  position: number;           // Order in Kanban board and filters
  createdAt: string;          // ISO 8601 date string
  updatedAt: string;          // ISO 8601 date string
}

/**
 * Input type for creating a new status
 */
export type CreateStatusInput = Omit<Status, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Input type for updating an existing status
 */
export type UpdateStatusInput = Partial<Omit<Status, 'id' | 'createdAt'>>;

/**
 * Constants for status validation
 */
export const MAX_STATUSES = 7;
export const MIN_STATUS_LABEL_LENGTH = 3;
export const MAX_STATUS_LABEL_LENGTH = 30;

export enum ViewMode {
  LIST = 'list',
  KANBAN = 'kanban',
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  status: string; // Status ID referencing Status.id
  priority: Priority;
  category: string;
  dueDate: string | null; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface TodoFilters {
  statuses: string[];  // Multi-select: filter by selected status IDs
  categories: string[];       // Multi-select: filter by selected categories
  searchText: string;
  sortBy: SortOption;
}

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

export type CreateTodoInput = Omit<Todo, 'id' | 'completed' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: string;
};
export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'createdAt'>>;
