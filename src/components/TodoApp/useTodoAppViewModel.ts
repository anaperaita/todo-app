import { useState, useCallback, useEffect } from 'react';
import { useTodoStorage } from '../../hooks';
import { TodoFilters, SortOption, CreateTodoInput, UpdateTodoInput } from '../../types';
import { useStatuses } from '../../context/StatusContext';

interface TodoAppViewModel {
  todos: ReturnType<typeof useTodoStorage>['todos'];
  filters: TodoFilters;
  handleAddTodo: (todo: CreateTodoInput) => void;
  handleToggleTodo: (id: string) => void;
  handleDeleteTodo: (id: string) => void;
  handleUpdateTodo: (id: string, updates: UpdateTodoInput) => void;
  handleFilterChange: (newFilters: TodoFilters) => void;
}

/**
 * ViewModel for TodoApp component.
 * Orchestrates all TODO operations and filter state.
 */
export const useTodoAppViewModel = (): TodoAppViewModel => {
  const { statuses, statusExists, getFirstStatus } = useStatuses();
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodoStorage({
    defaultStatusId: getFirstStatus()?.id,
    validateStatus: statusExists,
  });

  const [filters, setFilters] = useState<TodoFilters>({
    statuses: [],  // Will be initialized with all available statuses
    categories: [],  // Empty array = show all categories
    searchText: '',
    sortBy: SortOption.DATE_ADDED_DESC,  // Newest first by default
  });

  // Initialize filters with all available statuses
  useEffect(() => {
    if (statuses.length > 0 && filters.statuses.length === 0) {
      setFilters((prev) => ({
        ...prev,
        statuses: statuses.map((s) => s.id),
      }));
    }
  }, [statuses, filters.statuses.length]);

  const handleAddTodo = useCallback(
    (todo: CreateTodoInput) => {
      addTodo(todo);
    },
    [addTodo]
  );

  const handleToggleTodo = useCallback(
    (id: string) => {
      toggleTodo(id);
    },
    [toggleTodo]
  );

  const handleDeleteTodo = useCallback(
    (id: string) => {
      deleteTodo(id);
    },
    [deleteTodo]
  );

  const handleUpdateTodo = useCallback(
    (id: string, updates: UpdateTodoInput) => {
      updateTodo(id, updates);
    },
    [updateTodo]
  );

  const handleFilterChange = useCallback((newFilters: TodoFilters) => {
    setFilters(newFilters);
  }, []);

  return {
    todos,
    filters,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleUpdateTodo,
    handleFilterChange,
  };
};
