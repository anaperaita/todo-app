import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { Todo, TodoFilters, UpdateTodoInput } from '../../types';
import { KanbanColumn } from '../KanbanColumn';
import { KanbanCard } from '../KanbanCard';
import { useKanbanBoardViewModel } from './useKanbanBoardViewModel';
import { useStatuses } from '../../context/StatusContext';
import styles from './KanbanBoard.module.css';

export interface KanbanBoardProps {
  todos: Todo[];
  filters: TodoFilters;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoInput) => void;
}

/**
 * Kanban board component displaying todos in dynamic columns based on available statuses.
 * Supports drag-and-drop between columns with keyboard navigation.
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  todos,
  filters,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const { statuses } = useStatuses();
  const {
    todosByStatus,
    sensors,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    activeTodo,
  } = useKanbanBoardViewModel({ todos, filters, onUpdate });

  // Filter visible columns based on status filter
  // If filters.statuses is empty, show all columns
  // If filters.statuses has items, only show those columns
  const visibleStatuses = filters.statuses.length > 0
    ? statuses.filter(status => filters.statuses.includes(status.id))
    : statuses;

  const totalTodos = todos.length;
  const hasNoTodos = totalTodos === 0;

  // Tips banner dismissal state
  const [isTipsDismissed, setIsTipsDismissed] = useState(() => {
    const stored = localStorage.getItem('kanban-tips-dismissed');
    return stored === 'true';
  });

  const handleDismissTips = () => {
    setIsTipsDismissed(true);
    localStorage.setItem('kanban-tips-dismissed', 'true');
  };

  // Empty state when no todos exist
  if (hasNoTodos) {
    return (
      <div className={styles.emptyBoard}>
        <div className={styles.emptyBoardIcon}>📋</div>
        <h2 className={styles.emptyBoardTitle}>No Tasks Yet</h2>
        <p className={styles.emptyBoardText}>
          Click the + button to add your first task
        </p>
      </div>
    );
  }

  return (
    <div className={styles.board}>
      {/* Keyboard Instructions - Dismissible */}
      {!isTipsDismissed && (
        <div className={styles.instructions}>
          <div className={styles.instructionsHeader}>
            <div className={styles.instructionsTitle}>💡 Drag & Drop Tips</div>
            <button
              onClick={handleDismissTips}
              className={styles.dismissButton}
              aria-label="Dismiss tips"
              type="button"
            >
              ✕
            </button>
          </div>
          <div className={styles.instructionsContent}>
            <strong>Mouse:</strong> Click and drag cards between columns.{' '}
            <strong>Keyboard:</strong> Press Space to pick up, Arrow keys to move, Space to drop, or Escape to cancel.
          </div>
        </div>
      )}

      {/* Screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {activeId && activeTodo && `Dragging task: ${activeTodo.text}`}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Dynamic Columns based on available statuses */}
        <div className={styles.columnsContainer}>
          {visibleStatuses.map((status) => (
            <KanbanColumn
              key={status.id}
              status={status}
              todos={todosByStatus[status.id] || []}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>

        {/* Drag Overlay - shows card while dragging */}
        <DragOverlay>
          {activeId && activeTodo ? (
            <div className={styles.dragOverlay}>
              <KanbanCard
                todo={activeTodo}
                onToggle={() => {}}
                onDelete={() => {}}
                onUpdate={() => {}}
                onStatusChange={() => {}}
                isDragging={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
