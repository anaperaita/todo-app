import React from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { Todo, TodoFilters, UpdateTodoInput, KanbanStatus } from '../../types';
import { KanbanColumn } from '../KanbanColumn';
import { KanbanCard } from '../KanbanCard';
import { useKanbanBoardViewModel } from './useKanbanBoardViewModel';
import styles from './KanbanBoard.module.css';

export interface KanbanBoardProps {
  todos: Todo[];
  filters: TodoFilters;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoInput) => void;
}

/**
 * Kanban board component displaying todos in three columns: To Do, In Progress, Done.
 * Supports drag-and-drop between columns with keyboard navigation.
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  todos,
  filters,
  onToggle,
  onDelete,
  onUpdate,
}) => {
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

  const totalTodos = todos.length;
  const hasNoTodos = totalTodos === 0;

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
      {/* Keyboard Instructions */}
      <div className={styles.instructions}>
        <div className={styles.instructionsTitle}>💡 Drag & Drop Tips</div>
        <strong>Mouse:</strong> Click and drag cards between columns. {' '}
        <strong>Keyboard:</strong> Press Space to pick up, Arrow keys to move, Space to drop, or Escape to cancel.
      </div>

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
        {/* Three Columns */}
        <div className={styles.columnsContainer}>
          <KanbanColumn
            status={KanbanStatus.TODO}
            todos={todosByStatus[KanbanStatus.TODO]}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />

          <KanbanColumn
            status={KanbanStatus.IN_PROGRESS}
            todos={todosByStatus[KanbanStatus.IN_PROGRESS]}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />

          <KanbanColumn
            status={KanbanStatus.DONE}
            todos={todosByStatus[KanbanStatus.DONE]}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
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
