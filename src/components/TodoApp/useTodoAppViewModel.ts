import { useState, useCallback } from 'react';
import { useTodoStorage } from '../../hooks';
import { TodoFilters, SortOption, CreateTodoInput, UpdateTodoInput, Priority } from '../../types';
import { useStatuses } from '../../context/StatusContext';

interface TodoAppViewModel {
  todos: ReturnType<typeof useTodoStorage>['todos'];
  filters: TodoFilters;
  handleAddTodo: (todo: CreateTodoInput) => void;
  handleToggleTodo: (id: string) => void;
  handleDeleteTodo: (id: string) => void;
  handleUpdateTodo: (id: string, updates: UpdateTodoInput) => void;
  handleFilterChange: (newFilters: TodoFilters) => void;
  handleRemoveStatusFilter: (statusId: string) => void;
  handleRemoveCategoryFilter: (category: string) => void;
  handleRemovePriorityFilter: (priority: Priority) => void;
  handleClearSearch: () => void;
}

/**
 * ViewModel for TodoApp component.
 * Orchestrates all TODO operations and filter state.
 */
export const useTodoAppViewModel = (): TodoAppViewModel => {
  const { statusExists, getFirstStatus } = useStatuses();
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodoStorage({
    defaultStatusId: getFirstStatus()?.id,
    validateStatus: statusExists,
  });

  const [filters, setFilters] = useState<TodoFilters>({
    statuses: [],  // Empty = show all todos
    categories: [],  // Empty = show all categories
    priorities: [],  // Empty = show all priorities
    searchText: '',
    sortBy: SortOption.DATE_ADDED,  // Oldest first by default
  });

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

  const handleRemoveStatusFilter = useCallback((statusId: string) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.filter((id) => id !== statusId),
    }));
  }, []);

  const handleRemoveCategoryFilter = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  }, []);

  const handleRemovePriorityFilter = useCallback((priority: Priority) => {
    setFilters((prev) => ({
      ...prev,
      priorities: prev.priorities.filter((p) => p !== priority),
    }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      searchText: '',
    }));
  }, []);

  return {
    todos,
    filters,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleUpdateTodo,
    handleFilterChange,
    handleRemoveStatusFilter,
    handleRemoveCategoryFilter,
    handleRemovePriorityFilter,
    handleClearSearch,
  };
};
