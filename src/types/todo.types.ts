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

export enum KanbanStatus {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  DONE = 'done',
}

export enum ViewMode {
  LIST = 'list',
  KANBAN = 'kanban',
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  status: KanbanStatus; // For kanban board positioning
  priority: Priority;
  category: string;
  dueDate: string | null; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface TodoFilters {
  statuses: KanbanStatus[];  // Multi-select: filter by selected statuses
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
  status?: KanbanStatus;
};
export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'createdAt'>>;
