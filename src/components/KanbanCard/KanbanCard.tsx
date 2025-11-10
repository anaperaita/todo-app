import React, { useState, useRef, useEffect } from 'react';
import { Todo, UpdateTodoInput, Priority, KanbanStatus } from '../../types';
import { formatDueDate } from '../../utils';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as KanbanStatus;
    onStatusChange(todo.id, newStatus);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleDelete = () => {
    onDelete(todo.id);
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className={`${styles.card} ${isDragging ? styles.dragging : ''} ${styles[`priority__${todo.priority}`]}`}>
      {/* Header with status and menu */}
      <div className={styles.header}>
        {/* Status Dropdown */}
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

        {/* Three-dot menu */}
        <div className={styles.menuContainer} ref={menuRef}>
          <button
            onClick={handleMenuToggle}
            className={styles.menuButton}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            type="button"
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div className={styles.menuDropdown}>
              <button
                onClick={handleDelete}
                className={`${styles.menuItem} ${styles.danger}`}
                type="button"
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
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
          <span className={styles.dueDate}>{formatDueDate(todo.dueDate)}</span>
        )}
        <span className={styles.priority}>
          {todo.priority === Priority.HIGH && '🔴'}
          {todo.priority === Priority.MEDIUM && '🟡'}
          {todo.priority === Priority.LOW && '🟢'}
        </span>
      </div>
    </div>
  );
};
