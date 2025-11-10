import React from 'react';
import { CreateTodoInput, Priority } from '../../types';
import { useTodoFormViewModel } from './useTodoFormViewModel';
import styles from './TodoForm.module.css';

export interface TodoFormProps {
  onAdd: (todo: CreateTodoInput) => void;
}

/**
 * Form component for adding new TODO items.
 * Supports task description, priority, category, and due date.
 */
export const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const {
    text,
    priority,
    category,
    dueDate,
    handleTextChange,
    handlePriorityChange,
    handleCategoryChange,
    handleDueDateChange,
    handleSubmit,
  } = useTodoFormViewModel({ onAdd });

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="todo-text" className={styles.label}>
          Task Description
        </label>
        <input
          id="todo-text"
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="What needs to be done?"
          required
          className={styles.input}
          autoComplete="off"
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="todo-priority" className={styles.label}>
            Priority
          </label>
          <select
            id="todo-priority"
            value={priority}
            onChange={handlePriorityChange}
            className={styles.select}
          >
            <option value={Priority.LOW}>Low</option>
            <option value={Priority.MEDIUM}>Medium</option>
            <option value={Priority.HIGH}>High</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="todo-category" className={styles.label}>
            Category
          </label>
          <input
            id="todo-category"
            type="text"
            value={category}
            onChange={handleCategoryChange}
            placeholder="e.g., Work, Personal"
            className={styles.input}
            autoComplete="off"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="todo-duedate" className={styles.label}>
            Due Date
          </label>
          <input
            id="todo-duedate"
            type="date"
            value={dueDate}
            onChange={handleDueDateChange}
            className={styles.input}
          />
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        Add Task
      </button>
    </form>
  );
};
