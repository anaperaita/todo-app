import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoInput, UpdateTodoInput, KanbanStatus } from '../types';

const STORAGE_KEY = 'todos';

/**
 * Custom hook for managing TODO storage with localStorage.
 * Designed to be easily replaceable with API calls in the future.
 */
export const useTodoStorage = () => {
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
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      ...input,
      completed: false,
      status: input.status || KanbanStatus.TODO,
      createdAt: now,
      updatedAt: now,
    };

    setTodos((prev) => [...prev, newTodo]);
  }, []);

  const updateTodo = useCallback((id: string, updates: UpdateTodoInput): void => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
          : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string): void => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const completed = !todo.completed;
          const status = completed ? KanbanStatus.DONE :
            (todo.status === KanbanStatus.DONE ? KanbanStatus.TODO : todo.status);
          return {
            ...todo,
            completed,
            status,
            updatedAt: new Date().toISOString()
          };
        }
        return todo;
      })
    );
  }, []);

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
};
