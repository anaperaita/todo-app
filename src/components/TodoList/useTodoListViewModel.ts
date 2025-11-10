import { useMemo } from 'react';
import { Todo, TodoFilters, SortOption, Priority } from '../../types';

interface TodoListViewModel {
  filteredAndSortedTodos: Todo[];
}

interface UseTodoListViewModelProps {
  todos: Todo[];
  filters: TodoFilters;
}

const PRIORITY_ORDER = {
  [Priority.HIGH]: 3,
  [Priority.MEDIUM]: 2,
  [Priority.LOW]: 1,
};

/**
 * ViewModel for TodoList component.
 * Handles filtering and sorting logic.
 */
export const useTodoListViewModel = ({
  todos,
  filters,
}: UseTodoListViewModelProps): TodoListViewModel => {
  const filteredAndSortedTodos = useMemo(() => {
    let result = [...todos];

    // Apply status filter (multi-select)
    if (filters.statuses.length > 0) {
      result = result.filter((todo) => filters.statuses.includes(todo.status));
    }

    // Apply category filter (multi-select)
    if (filters.categories.length > 0) {
      result = result.filter((todo) => filters.categories.includes(todo.category));
    }

    // Apply search filter
    const searchText = filters.searchText.trim().toLowerCase();
    if (searchText) {
      result = result.filter((todo) => {
        const textMatch = todo.text.toLowerCase().includes(searchText);
        const categoryMatch = todo.category.toLowerCase().includes(searchText);
        return textMatch || categoryMatch;
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case SortOption.DATE_ADDED:
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;

      case SortOption.DATE_ADDED_DESC:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;

      case SortOption.DUE_DATE:
        result.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;

      case SortOption.DUE_DATE_DESC:
        result.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return -1;
          if (!b.dueDate) return 1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });
        break;

      case SortOption.PRIORITY:
        result.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
        break;

      case SortOption.ALPHABETICAL:
        result.sort((a, b) => a.text.localeCompare(b.text));
        break;

      default:
        break;
    }

    return result;
  }, [todos, filters]);

  return {
    filteredAndSortedTodos,
  };
};
