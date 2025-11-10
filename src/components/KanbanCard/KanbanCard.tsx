import React from 'react';
import { Todo, UpdateTodoInput, Priority, KanbanStatus } from '../../types';
import styles from './KanbanCard.module.css';

export interface KanbanCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoInput) => void;
  onStatusChange: (id: string, newStatus: KanbanStatus) => void;
  isDragging?: boolean;
}

/**
 * Card component for displaying a task in the kanban board.
 */
export const KanbanCard: React.FC<KanbanCardProps> = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  onStatusChange,
  isDragging = false,
}) => {
  const formatDueDate = (dateString: string | null): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as KanbanStatus;
    onStatusChange(todo.id, newStatus);
  };

  return (
    <div className={`${styles.card} ${isDragging ? styles.dragging : ''} ${styles[`priority__${todo.priority}`]}`}>
      {/* Header with checkbox and priority */}
      <div className={styles.header}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className={styles.checkbox}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />

        {/* Status Dropdown (for accessibility) */}
        <select
          value={todo.status}
          onChange={handleStatusChange}
          className={styles.statusSelect}
          aria-label="Change status"
          title="Move to column"
        >
          <option value={KanbanStatus.TODO}>To Do</option>
          <option value={KanbanStatus.IN_PROGRESS}>In Progress</option>
          <option value={KanbanStatus.DONE}>Done</option>
        </select>
      </div>

      {/* Task Text */}
      <div className={`${styles.text} ${todo.completed ? styles.completed : ''}`}>
        {todo.text}
      </div>

      {/* Metadata */}
      <div className={styles.metadata}>
        {todo.category && (
          <span className={styles.category}>{todo.category}</span>
        )}
        {todo.dueDate && (
          <span className={styles.dueDate}>📅 {formatDueDate(todo.dueDate)}</span>
        )}
        <span className={styles.priority}>
          {todo.priority === Priority.HIGH && '🔴'}
          {todo.priority === Priority.MEDIUM && '🟡'}
          {todo.priority === Priority.LOW && '🟢'}
        </span>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          onClick={() => onDelete(todo.id)}
          className={styles.deleteButton}
          aria-label="Delete task"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
