import { useCallback, ChangeEvent } from 'react';
import { TodoFilters, SortOption, KanbanStatus } from '../../types';

interface TodoFiltersViewModel {
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleStatusToggle: (status: KanbanStatus) => void;
  handleCategoryToggle: (category: string) => void;
  handleSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface UseTodoFiltersViewModelProps {
  filters: TodoFilters;
  onFilterChange: (filters: TodoFilters) => void;
}

/**
 * ViewModel for TodoFilters component.
 * Manages filter state changes with multi-select support.
 */
export const useTodoFiltersViewModel = ({
  filters,
  onFilterChange,
}: UseTodoFiltersViewModelProps): TodoFiltersViewModel => {
  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onFilterChange({
        ...filters,
        searchText: e.target.value,
      });
    },
    [filters, onFilterChange]
  );

  const handleStatusToggle = useCallback(
    (status: KanbanStatus) => {
      const newStatuses = filters.statuses.includes(status)
        ? filters.statuses.filter((s) => s !== status)
        : [...filters.statuses, status];

      onFilterChange({
        ...filters,
        statuses: newStatuses,
      });
    },
    [filters, onFilterChange]
  );

  const handleCategoryToggle = useCallback(
    (category: string) => {
      const newCategories = filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category];

      onFilterChange({
        ...filters,
        categories: newCategories,
      });
    },
    [filters, onFilterChange]
  );

  const handleSortChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onFilterChange({
        ...filters,
        sortBy: e.target.value as SortOption,
      });
    },
    [filters, onFilterChange]
  );

  return {
    handleSearchChange,
    handleStatusToggle,
    handleCategoryToggle,
    handleSortChange,
  };
};
