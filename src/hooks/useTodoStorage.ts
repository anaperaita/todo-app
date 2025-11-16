import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types';

const STORAGE_KEY = 'todos';

interface UseTodoStorageOptions {
  defaultStatusId?: string;
  validateStatus?: (statusId: string) => boolean;
}

/**
 * Custom hook for managing TODO storage with localStorage.
 * Designed to be easily replaceable with API calls in the future.
 */
export const useTodoStorage = (options: UseTodoStorageOptions = {}) => {
  const { defaultStatusId, validateStatus } = options;
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTodos(parsed);
      }
    } catch (error) {
      // Failed to load from localStorage, start with empty state
      setTodos([]);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      // Failed to save to localStorage, continue without persistence
    }
  }, [todos]);

  const addTodo = useCallback((input: CreateTodoInput): void => {
    const now = new Date().toISOString();

    // Determine status: use provided status, validate if needed, or use default
    let status = input.status || defaultStatusId || '';

    // Validate status if validation function provided
    if (validateStatus && status && !validateStatus(status)) {
      console.warn(`Invalid status "${status}", using default`);
      status = defaultStatusId || '';
    }

    if (!status) {
      throw new Error('Cannot add todo: no valid status available');
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      ...input,
      completed: false,
      status,
      createdAt: now,
      updatedAt: now,
    };

    setTodos((prev) => [...prev, newTodo]);
  }, [defaultStatusId, validateStatus]);

  const updateTodo = useCallback((id: string, updates: UpdateTodoInput): void => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const updatedTodo = { ...todo, ...updates, updatedAt: new Date().toISOString() };

          // Validate status if being updated
          if (updates.status && validateStatus && !validateStatus(updates.status)) {
            console.warn(`Invalid status "${updates.status}", keeping current status`);
            updatedTodo.status = todo.status;
          }

          return updatedTodo;
        }
        return todo;
      })
    );
  }, [validateStatus]);

  const deleteTodo = useCallback((id: string): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string): void => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const completed = !todo.completed;
          // Note: Status changes on toggle removed - status now managed independently
          return {
            ...todo,
            completed,
            updatedAt: new Date().toISOString()
          };
        }
        return todo;
      })
    );
  }, []);

  /**
   * Reassign all todos from one status to another
   * Used when deleting a status
   */
  const reassignTodos = useCallback((fromStatusId: string, toStatusId: string): void => {
    if (validateStatus && !validateStatus(toStatusId)) {
      throw new Error(`Cannot reassign: invalid target status "${toStatusId}"`);
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.status === fromStatusId
          ? { ...todo, status: toStatusId, updatedAt: new Date().toISOString() }
          : todo
      )
    );
  }, [validateStatus]);

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reassignTodos,
  };
};
