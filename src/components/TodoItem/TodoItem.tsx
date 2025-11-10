import React, { useEffect, useRef } from 'react';
import { Todo, UpdateTodoInput, Priority } from '../../types';
import { useTodoItemViewModel } from './useTodoItemViewModel';
import { formatDueDate } from '../../utils';
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
  const {
    isEditing,
    editText,
    editPriority,
    editCategory,
    editDueDate,
    handleToggle,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleTextChange,
    handlePriorityChange,
    handleCategoryChange,
    handleDueDateChange,
    handleKeyDown,
  } = useTodoItemViewModel({ todo, onToggle, onDelete, onUpdate });

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    const priorityClass = `priority__${todo.priority}`;
    return (
      <div className={`${styles.todoItem} ${styles[priorityClass]}`}>
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

  const priorityClass = `priority__${todo.priority}`;
  return (
    <div className={`${styles.todoItem} ${styles[priorityClass]}`}>
      <div className={styles.mainContent}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className={styles.checkbox}
          aria-label={todo.text}
        />

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
