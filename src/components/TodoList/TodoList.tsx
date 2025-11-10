import React from 'react';
import { Todo, TodoFilters, UpdateTodoInput } from '../../types';
import { TodoItem } from '../TodoItem';
import { useTodoListViewModel } from './useTodoListViewModel';
import styles from './TodoList.module.css';

export interface TodoListProps {
  todos: Todo[];
  filters: TodoFilters;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoInput) => void;
}

/**
 * List container component that renders filtered and sorted TODO items.
 */
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filters,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const { filteredAndSortedTodos } = useTodoListViewModel({ todos, filters });

  if (filteredAndSortedTodos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyMessage}>No tasks found</p>
        <p className={styles.emptyHint}>
          {todos.length === 0
            ? 'Add your first task to get started!'
            : 'Try adjusting your filters or search.'}
        </p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {filteredAndSortedTodos.map((todo) => (
        <li key={todo.id} className={styles.listItem}>
          <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
        </li>
      ))}
    </ul>
  );
};
