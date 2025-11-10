import { useState, useCallback } from 'react';
import { useTodoStorage } from '../../hooks';
import { TodoFilters, FilterStatus, SortOption, CreateTodoInput, UpdateTodoInput } from '../../types';

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
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodoStorage();

  const [filters, setFilters] = useState<TodoFilters>({
    status: FilterStatus.ALL,
    searchText: '',
    sortBy: SortOption.DATE_ADDED,
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
