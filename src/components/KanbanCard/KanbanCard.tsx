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
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const handleStatusClick = (newStatus: KanbanStatus) => {
    onStatusChange(todo.id, newStatus);
    setIsStatusOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleStatusToggle = () => {
    setIsStatusOpen((prev) => !prev);
  };

  const handleDelete = () => {
    onDelete(todo.id);
    setIsMenuOpen(false);
  };

  const getStatusLabel = (status: KanbanStatus) => {
    switch (status) {
      case KanbanStatus.TODO:
        return 'To Do';
      case KanbanStatus.IN_PROGRESS:
        return 'In Progress';
      case KanbanStatus.DONE:
        return 'Done';
      default:
        return status;
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    };

    if (isMenuOpen || isStatusOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isStatusOpen]);

  return (
    <div className={`${styles.card} ${isDragging ? styles.dragging : ''} ${styles[`priority__${todo.priority}`]}`}>
      {/* Header with status and menu */}
      <div className={styles.header}>
        {/* Custom Status Dropdown */}
        <div className={styles.statusContainer} ref={statusRef}>
          <button
            onClick={handleStatusToggle}
            className={`${styles.statusButton} ${styles[`status__${todo.status}`]}`}
            aria-label="Change status"
            aria-expanded={isStatusOpen}
            type="button"
          >
            {getStatusLabel(todo.status)}
          </button>

          {isStatusOpen && (
            <div className={styles.statusDropdown}>
              <button
                onClick={() => handleStatusClick(KanbanStatus.TODO)}
                className={`${styles.statusOption} ${styles.status__TODO} ${todo.status === KanbanStatus.TODO ? styles.active : ''}`}
                type="button"
              >
                To Do
              </button>
              <button
                onClick={() => handleStatusClick(KanbanStatus.IN_PROGRESS)}
                className={`${styles.statusOption} ${styles.status__IN_PROGRESS} ${todo.status === KanbanStatus.IN_PROGRESS ? styles.active : ''}`}
                type="button"
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusClick(KanbanStatus.DONE)}
                className={`${styles.statusOption} ${styles.status__DONE} ${todo.status === KanbanStatus.DONE ? styles.active : ''}`}
                type="button"
              >
                Done
              </button>
            </div>
          )}
        </div>

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
