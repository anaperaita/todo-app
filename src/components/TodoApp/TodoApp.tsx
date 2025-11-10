import React, { useState } from 'react';
import { TodoForm } from '../TodoForm';
import { TodoFilters } from '../TodoFilters';
import { TodoList } from '../TodoList';
import { SlideInPanel } from '../SlideInPanel';
import { useTodoAppViewModel } from './useTodoAppViewModel';
import { useTodoStatsViewModel } from '../TodoStats/useTodoStatsViewModel';
import { ViewMode, CreateTodoInput } from '../../types';
import styles from './TodoApp.module.css';

/**
 * Main TODO application container.
 * Orchestrates all TODO operations, filtering, and statistics.
 */
export const TodoApp: React.FC = () => {
  const {
    todos,
    filters,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleUpdateTodo,
    handleFilterChange,
  } = useTodoAppViewModel();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Calculate stats for header
  const { stats } = useTodoStatsViewModel({ todos });
  const { active: activeCount, completed: completedCount } = stats;

  const handleAddTodoAndClose = (input: CreateTodoInput) => {
    handleAddTodo(input);
    setIsPanelOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className={styles.app}>
      {/* Header with stats, view toggle and settings */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuButton}
            onClick={toggleSidebar}
            aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isSidebarExpanded}
          >
            ☰
          </button>
          <h1 className={styles.title}>Task Manager</h1>
          <div className={styles.stats}>
            <span className={styles.statBadge}>
              {activeCount} active
            </span>
            <span className={styles.statDivider}>•</span>
            <span className={styles.statBadge}>
              {completedCount} done
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          {/* View Toggle */}
          <div className={styles.viewToggle} role="tablist" aria-label="View mode">
            <button
              role="tab"
              aria-selected={viewMode === ViewMode.LIST}
              aria-label="List view"
              className={`${styles.viewButton} ${viewMode === ViewMode.LIST ? styles.active : ''}`}
              onClick={() => setViewMode(ViewMode.LIST)}
            >
              <span className={styles.icon}>☰</span>
              <span className={styles.viewLabel}>List</span>
            </button>
            <button
              role="tab"
              aria-selected={viewMode === ViewMode.KANBAN}
              aria-label="Kanban view"
              className={`${styles.viewButton} ${viewMode === ViewMode.KANBAN ? styles.active : ''}`}
              onClick={() => setViewMode(ViewMode.KANBAN)}
            >
              <span className={styles.icon}>▥</span>
              <span className={styles.viewLabel}>Board</span>
            </button>
          </div>

          {/* Settings Icon (placeholder for now) */}
          <button className={styles.settingsButton} aria-label="Settings">
            ⚙️
          </button>
        </div>
      </header>

      <div className={styles.container}>
        {/* Collapsible Sidebar with Toggle Button */}
        <aside className={`${styles.sidebar} ${isSidebarExpanded ? styles.expanded : ''}`}>
          {/* Collapsed State - Vertical Text */}
          {!isSidebarExpanded && (
            <div className={styles.collapsedLabel}>
              <span className={styles.verticalText}>FILTERS</span>
            </div>
          )}

          {/* Expanded State - Filters and Controls */}
          {isSidebarExpanded && (
            <div className={styles.sidebarContent}>
              <h2 className={styles.sidebarTitle}>Filters & Sort</h2>
              <TodoFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Toggle Button */}
          <button
            className={styles.toggleButton}
            onClick={toggleSidebar}
            aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarExpanded ? '◀' : '▶'}
          </button>
        </aside>

        {/* Main Content Area */}
        <main className={styles.main} role="main">
          {viewMode === ViewMode.LIST ? (
            <TodoList
              todos={todos}
              filters={filters}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
            />
          ) : (
            <div className={styles.kanbanPlaceholder}>
              <h2>Kanban Board</h2>
              <p>Coming next! 🎯</p>
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        className={styles.fab}
        onClick={() => setIsPanelOpen(true)}
        aria-label="Add new task"
        title="Add new task"
      >
        <span className={styles.fabIcon}>+</span>
      </button>

      {/* Slide-in Panel for Add Task Form */}
      <SlideInPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title="Add New Task"
      >
        <TodoForm onAdd={handleAddTodoAndClose} />
      </SlideInPanel>
    </div>
  );
};
