import { useCallback, ChangeEvent, useState } from 'react';

import { TodoFilters, SortOption, Priority } from '../../types';

interface TodoFiltersViewModel {
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleStatusToggle: (statusId: string) => void;
  handleCategoryToggle: (category: string) => void;
  handlePriorityToggle: (priority: Priority) => void;
  handleSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleClearAll: () => void;
  activeTab: 'basic' | 'advanced';
  setActiveTab: (tab: 'basic' | 'advanced') => void;
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
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

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
    (statusId: string) => {
      const newStatuses = filters.statuses.includes(statusId)
        ? filters.statuses.filter((s) => s !== statusId)
        : [...filters.statuses, statusId];

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

  const handlePriorityToggle = useCallback(
    (priority: Priority) => {
      const newPriorities = filters.priorities.includes(priority)
        ? filters.priorities.filter((p) => p !== priority)
        : [...filters.priorities, priority];

      onFilterChange({
        ...filters,
        priorities: newPriorities,
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

  const handleClearAll = useCallback(() => {
    onFilterChange({
      statuses: [],
      categories: [],
      priorities: [],
      searchText: '',
      sortBy: SortOption.DATE_ADDED,
    });
  }, [onFilterChange]);

  return {
    handleSearchChange,
    handleStatusToggle,
    handleCategoryToggle,
    handlePriorityToggle,
    handleSortChange,
    handleClearAll,
    activeTab,
    setActiveTab,
  };
};
