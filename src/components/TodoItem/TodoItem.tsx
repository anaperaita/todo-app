import React, { useEffect, useRef, useState } from 'react';
import { Todo, UpdateTodoInput, Priority } from '../../types';
import { useTodoItemViewModel } from './useTodoItemViewModel';
import { formatDueDate } from '../../utils';
import { useStatuses } from '../../context/StatusContext';
import styles from './TodoItem.module.css';

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoInput) => void;
}

/**
 * Individual TODO item component with inline editing, completion toggle, and delete functionality.
 */
export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const { statuses, getStatusById } = useStatuses();
  const {
    isEditing,
    editText,
    editPriority,
    editCategory,
    editDueDate,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleTextChange,
    handlePriorityChange,
    handleCategoryChange,
    handleDueDateChange,
    handleKeyDown,
    handleStatusChange,
  } = useTodoItemViewModel({ todo, onToggle, onDelete, onUpdate });

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const currentStatus = getStatusById(todo.status);

  const handleStatusClick = (statusId: string) => {
    const event = {
      target: { value: statusId }
    } as React.ChangeEvent<HTMLSelectElement>;
    handleStatusChange(event);
    setIsStatusOpen(false);
  };

  const handleStatusToggle = () => {
    setIsStatusOpen((prev) => !prev);
  };


  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    };

    if (isStatusOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusOpen]);

  if (isEditing) {
    const statusColor = currentStatus?.color || 'color-1';
    return (
      <div className={styles.todoItem} style={{ borderLeftColor: `var(--color-${statusColor})` }}>
        <div className={styles.editMode}>
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            className={styles.editInput}
          />

          <div className={styles.editRow}>
            <select
              value={editPriority}
              onChange={handlePriorityChange}
              className={styles.editSelect}
            >
              <option value={Priority.LOW}>Low</option>
              <option value={Priority.MEDIUM}>Medium</option>
              <option value={Priority.HIGH}>High</option>
            </select>

            <input
              type="text"
              value={editCategory}
              onChange={handleCategoryChange}
              placeholder="Category"
              className={styles.editInputSmall}
            />

            <input
              type="date"
              value={editDueDate}
              onChange={handleDueDateChange}
              className={styles.editInputSmall}
            />
          </div>

          <div className={styles.editActions}>
            <button onClick={handleSaveEdit} className={styles.saveButton} aria-label="Save">
              Save
            </button>
            <button onClick={handleCancelEdit} className={styles.cancelButton} aria-label="Cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = currentStatus?.color || 'color-1';
  return (
    <div className={styles.todoItem} style={{ borderLeftColor: `var(--color-${statusColor})` }}>
      <div className={styles.mainContent}>
        {/* Custom Status Dropdown */}
        <div className={styles.statusContainer} ref={statusRef}>
          <button
            onClick={handleStatusToggle}
            className={`${styles.statusButton} ${styles[`status__${todo.status}`]}`}
            aria-label="Change status"
            aria-expanded={isStatusOpen}
            type="button"
          >
            {currentStatus?.label || 'Unknown'}
          </button>

          {isStatusOpen && (
            <div className={styles.statusDropdown}>
              {statuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleStatusClick(status.id)}
                  className={`${styles.statusOption} ${styles[`status__${status.value}`]} ${todo.status === status.id ? styles.active : ''}`}
                  type="button"
                >
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.textContent}>
          <span className={`${styles.text} ${todo.completed ? styles.completed : ''}`}>
            {todo.text}
          </span>

          <div className={styles.metadata}>
            {todo.category && <span className={styles.category}>{todo.category}</span>}
            {todo.dueDate && <span className={styles.dueDate}>{formatDueDate(todo.dueDate)}</span>}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={handleEdit} className={styles.editButton} aria-label="Edit">
          Edit
        </button>
        <button onClick={handleDelete} className={styles.deleteButton} aria-label="Delete">
          Delete
        </button>
      </div>
    </div>
  );
};
