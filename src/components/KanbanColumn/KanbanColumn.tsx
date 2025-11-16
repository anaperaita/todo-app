import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Todo, Status, UpdateTodoInput } from '../../types';
import { KanbanCard } from '../KanbanCard/KanbanCard';
import { useKanbanColumnViewModel } from './useKanbanColumnViewModel';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './KanbanColumn.module.css';

export interface KanbanColumnProps {
  status: Status;
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoInput) => void;
}

/**
 * Wrapper for individual card to make it sortable
 */
const SortableCard: React.FC<{
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
}> = ({ todo, onToggle, onDelete, onStatusChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard
        todo={todo}
        onToggle={onToggle}
        onDelete={onDelete}
        onUpdate={() => {}}
        onStatusChange={onStatusChange}
        isDragging={isDragging}
      />
    </div>
  );
};

/**
 * Column component for Kanban board.
 * Displays todos for a specific status and handles drag-and-drop.
 */
export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  todos,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const { title, count, isEmpty, statusClass } = useKanbanColumnViewModel({
    status,
    todoCount: todos.length,
  });

  const { setNodeRef, isOver } = useDroppable({
    id: status.id,
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    onUpdate(id, { status: newStatus });
  };

  const todoIds = todos.map((todo) => todo.id);

  return (
    <div
      ref={setNodeRef}
      className={`${styles.column} ${styles[statusClass]} ${isOver ? styles.dragOver : ''}`}
      role="region"
      aria-label={`${title} column`}
    >
      {/* Column Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div
            className={styles.statusIndicator}
            style={{ backgroundColor: `var(--color-${status.color})` }}
          />
          <h2 className={styles.title} id={`${status.id}-heading`}>
            {title}
          </h2>
        </div>
        <div className={styles.count} aria-label={`${count} tasks`}>
          {count}
        </div>
      </div>

      {/* Cards List */}
      <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
        <div className={styles.cardsList} aria-labelledby={`${status.id}-heading`}>
          {isEmpty ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📭</div>
              <p className={styles.emptyText}>No tasks here</p>
            </div>
          ) : (
            todos.map((todo) => (
              <SortableCard
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};
