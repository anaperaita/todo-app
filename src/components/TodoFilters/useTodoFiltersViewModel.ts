import { useCallback, ChangeEvent } from 'react';
import { TodoFilters, FilterStatus, SortOption } from '../../types';

interface TodoFiltersViewModel {
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface UseTodoFiltersViewModelProps {
  filters: TodoFilters;
  onFilterChange: (filters: TodoFilters) => void;
}

/**
 * ViewModel for TodoFilters component.
 * Manages filter state changes.
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

  const handleStatusChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onFilterChange({
        ...filters,
        status: e.target.value as FilterStatus,
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
    handleStatusChange,
    handleSortChange,
  };
};
