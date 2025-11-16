import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TodoFilters as TodoFiltersType, SortOption, Todo, Priority } from '../../types';
import { useTodoFiltersViewModel } from './useTodoFiltersViewModel';
import { getUniqueCategories } from '../../utils';
import { useStatuses } from '../../context/StatusContext';
import { FilterTabs } from '../FilterTabs';
import { CheckboxList, CheckboxOption } from '../CheckboxList';
import { getColorById } from '../../utils/colorPalette';
import styles from './TodoFilters.module.css';

export interface TodoFiltersProps {
  filters: TodoFiltersType;
  onFilterChange: (filters: TodoFiltersType) => void;
  todos: Todo[];  // Needed to extract unique categories
}

/**
 * Filter and sort controls for the TODO list with tabbed interface.
 */
export const TodoFilters: React.FC<TodoFiltersProps> = ({ filters, onFilterChange, todos }) => {
  const { statuses } = useStatuses();
  const {
    handleSearchChange,
    handleStatusToggle,
    handleCategoryToggle,
    handlePriorityToggle,
    handleSortChange,
    handleClearAll,
    activeTab,
    setActiveTab
  } = useTodoFiltersViewModel({
    filters,
    onFilterChange,
  });

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Collapsible section state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    status: false,
    category: false,
    priority: false,
    search: false,
    sort: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const uniqueCategories = getUniqueCategories(todos);

  // Convert statuses to CheckboxOption format
  const statusOptions: CheckboxOption[] = useMemo(() =>
    statuses.map(status => ({
      id: status.id,
      label: status.label,
      color: getColorById(status.color)?.hexValue,
    })),
    [statuses]
  );

  // Convert categories to CheckboxOption format
  const categoryOptions: CheckboxOption[] = useMemo(() =>
    uniqueCategories.map(category => ({
      id: category,
      label: category,
    })),
    [uniqueCategories]
  );

  // Priority options
  const priorityOptions: CheckboxOption[] = [
    { id: Priority.HIGH, label: 'High' },
    { id: Priority.MEDIUM, label: 'Medium' },
    { id: Priority.LOW, label: 'Low' },
  ];

  const handleSortClick = (sortBy: SortOption) => {
    const event = {
      target: { value: sortBy }
    } as React.ChangeEvent<HTMLSelectElement>;
    handleSortChange(event);
    setIsSortOpen(false);
  };

  const getSortLabel = (sortBy: SortOption) => {
    switch (sortBy) {
      case SortOption.DATE_ADDED:
        return 'Oldest First';
      case SortOption.DATE_ADDED_DESC:
        return 'Newest First';
      case SortOption.DUE_DATE:
        return 'Due Soon';
      case SortOption.DUE_DATE_DESC:
        return 'Due Later';
      case SortOption.PRIORITY:
        return 'Priority';
      case SortOption.ALPHABETICAL:
        return 'A-Z';
      default:
        return sortBy;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    if (isSortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortOpen]);

  return (
    <div className={styles.filters}>
      {/* Clear All Button */}
      <button
        onClick={handleClearAll}
        className={styles.clearButton}
        aria-label="Clear all filters"
      >
        Clear All Filters
      </button>

      {/* Tabbed Interface */}
      <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Basic Tab */}
      {activeTab === 'basic' && (
        <div
          role="tabpanel"
          id="basic-tab-panel"
          aria-labelledby="basic-tab"
          className={styles.tabPanel}
        >
          {/* Status Filter */}
          <div className={styles.filterSection}>
            <button
              onClick={() => toggleSection('status')}
              className={styles.filterHeader}
              aria-expanded={expandedSections.status}
              type="button"
            >
              <h3 className={styles.filterLabel}>
                <span className={styles.filterIcon} aria-hidden="true">●</span>
                Status
              </h3>
              <span className={styles.collapseIcon} aria-hidden="true">
                {expandedSections.status ? '▼' : '▶'}
              </span>
            </button>
            {expandedSections.status && (
              <CheckboxList
                options={statusOptions}
                selectedIds={filters.statuses}
                onChange={(selectedIds) => {
                  // Calculate the difference and toggle appropriately
                  const added = selectedIds.filter(id => !filters.statuses.includes(id));
                  const removed = filters.statuses.filter(id => !selectedIds.includes(id));

                  if (added.length > 0) {
                    added.forEach(id => handleStatusToggle(id));
                  } else if (removed.length > 0) {
                    removed.forEach(id => handleStatusToggle(id));
                  }
                }}
                ariaLabel="Filter by status"
              />
            )}
          </div>

          {/* Category Filter */}
          <div className={styles.filterSection}>
            <button
              onClick={() => toggleSection('category')}
              className={styles.filterHeader}
              aria-expanded={expandedSections.category}
              type="button"
            >
              <h3 className={styles.filterLabel}>
                <span className={styles.filterIcon} aria-hidden="true">📁</span>
                Category
              </h3>
              <span className={styles.collapseIcon} aria-hidden="true">
                {expandedSections.category ? '▼' : '▶'}
              </span>
            </button>
            {expandedSections.category && (
              <CheckboxList
                options={categoryOptions}
                selectedIds={filters.categories}
                onChange={(selectedIds) => {
                  const added = selectedIds.filter(id => !filters.categories.includes(id));
                  const removed = filters.categories.filter(id => !selectedIds.includes(id));

                  if (added.length > 0) {
                    added.forEach(id => handleCategoryToggle(id));
                  } else if (removed.length > 0) {
                    removed.forEach(id => handleCategoryToggle(id));
                  }
                }}
                ariaLabel="Filter by category"
                emptyMessage="No categories yet"
              />
            )}
          </div>

          {/* Sort Dropdown */}
          <div className={styles.filterSection}>
            <button
              onClick={() => toggleSection('sort')}
              className={styles.filterHeader}
              aria-expanded={expandedSections.sort}
              type="button"
            >
              <h3 className={styles.filterLabel}>
                <span className={styles.filterIcon} aria-hidden="true">⇅</span>
                Sort
              </h3>
              <span className={styles.collapseIcon} aria-hidden="true">
                {expandedSections.sort ? '▼' : '▶'}
              </span>
            </button>
            {expandedSections.sort && (
              <div className={styles.sortContainer} ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={styles.sortButton}
                  aria-label="Sort options"
                  aria-expanded={isSortOpen}
                  type="button"
                >
                  {getSortLabel(filters.sortBy)}
                </button>

                {isSortOpen && (
                  <div className={styles.sortDropdown}>
                    <button
                      onClick={() => handleSortClick(SortOption.DATE_ADDED_DESC)}
                      className={`${styles.sortOption} ${filters.sortBy === SortOption.DATE_ADDED_DESC ? styles.active : ''}`}
                      type="button"
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => handleSortClick(SortOption.DATE_ADDED)}
                      className={`${styles.sortOption} ${filters.sortBy === SortOption.DATE_ADDED ? styles.active : ''}`}
                      type="button"
                    >
                      Oldest First
                    </button>
                    <button
                      onClick={() => handleSortClick(SortOption.DUE_DATE)}
                      className={`${styles.sortOption} ${filters.sortBy === SortOption.DUE_DATE ? styles.active : ''}`}
                      type="button"
                    >
                      Due Soon
                    </button>
                    <button
                      onClick={() => handleSortClick(SortOption.DUE_DATE_DESC)}
                      className={`${styles.sortOption} ${filters.sortBy === SortOption.DUE_DATE_DESC ? styles.active : ''}`}
                      type="button"
                    >
                      Due Later
                    </button>
                    <button
                      onClick={() => handleSortClick(SortOption.PRIORITY)}
                      className={`${styles.sortOption} ${filters.sortBy === SortOption.PRIORITY ? styles.active : ''}`}
                      type="button"
                    >
                      Priority
                    </button>
                    <button
                      onClick={() => handleSortClick(SortOption.ALPHABETICAL)}
                      className={`${styles.sortOption} ${filters.sortBy === SortOption.ALPHABETICAL ? styles.active : ''}`}
                      type="button"
                    >
                      A-Z
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div
          role="tabpanel"
          id="advanced-tab-panel"
          aria-labelledby="advanced-tab"
          className={styles.tabPanel}
        >
          {/* Priority Filter */}
          <div className={styles.filterSection}>
            <button
              onClick={() => toggleSection('priority')}
              className={styles.filterHeader}
              aria-expanded={expandedSections.priority}
              type="button"
            >
              <h3 className={styles.filterLabel}>
                <span className={styles.filterIcon} aria-hidden="true">⭐</span>
                Priority
              </h3>
              <span className={styles.collapseIcon} aria-hidden="true">
                {expandedSections.priority ? '▼' : '▶'}
              </span>
            </button>
            {expandedSections.priority && (
              <CheckboxList
                options={priorityOptions}
                selectedIds={filters.priorities}
                onChange={(selectedIds) => {
                  const added = selectedIds.filter(id => !filters.priorities.includes(id as Priority));
                  const removed = filters.priorities.filter(id => !selectedIds.includes(id));

                  if (added.length > 0) {
                    added.forEach(id => handlePriorityToggle(id as Priority));
                  } else if (removed.length > 0) {
                    removed.forEach(id => handlePriorityToggle(id as Priority));
                  }
                }}
                ariaLabel="Filter by priority"
              />
            )}
          </div>

          {/* Search */}
          <div className={styles.filterSection}>
            <button
              onClick={() => toggleSection('search')}
              className={styles.filterHeader}
              aria-expanded={expandedSections.search}
              type="button"
            >
              <h3 className={styles.filterLabel}>
                <span className={styles.filterIcon} aria-hidden="true">🔍</span>
                Search
              </h3>
              <span className={styles.collapseIcon} aria-hidden="true">
                {expandedSections.search ? '▼' : '▶'}
              </span>
            </button>
            {expandedSections.search && (
              <div className={styles.searchContainer}>
                <label htmlFor="search-tasks" className={styles.visuallyHidden}>
                  Search tasks
                </label>
                <input
                  id="search-tasks"
                  type="text"
                  value={filters.searchText}
                  onChange={handleSearchChange}
                  placeholder="Search tasks..."
                  className={styles.searchInput}
                  aria-label="Search tasks"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
