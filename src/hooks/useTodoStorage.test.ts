import { renderHook, act } from '@testing-library/react';
import { useTodoStorage } from './useTodoStorage';
import { Priority, CreateTodoInput } from '../types';

const TEST_STATUS_ID = 'test-status-id';

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(2, 15),
  },
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTodoStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('Initialization', () => {
    it('should initialize with empty todos array when localStorage is empty', () => {
      const { result } = renderHook(() => useTodoStorage({ defaultStatusId: TEST_STATUS_ID }));

      expect(result.current.todos).toEqual([]);
    });

    it('should load existing todos from localStorage', () => {
      const existingTodos = [
        {
          id: '1',
          text: 'Test todo',
          completed: false,
          status: TEST_STATUS_ID,
          priority: Priority.MEDIUM,
          category: 'work',
          dueDate: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorageMock.setItem('todos', JSON.stringify(existingTodos));

      const { result } = renderHook(() => useTodoStorage({ defaultStatusId: TEST_STATUS_ID }));

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Test todo');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorageMock.setItem('todos', 'invalid json');

      const { result } = renderHook(() => useTodoStorage({ defaultStatusId: TEST_STATUS_ID }));

      expect(result.current.todos).toEqual([]);
    });
  });

  describe('Add Todo', () => {
    it('should add a new todo with generated id and timestamps', () => {
      const { result } = renderHook(() => useTodoStorage({ defaultStatusId: TEST_STATUS_ID }));

      const newTodo: CreateTodoInput = {
        text: 'New task',
        priority: Priority.HIGH,
        category: 'personal',
        dueDate: '2025-12-31',
      };

      act(() => {
        result.current.addTodo(newTodo);
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0]).toMatchObject({
        text: 'New task',
        completed: false,
        priority: Priority.HIGH,
        category: 'personal',
        dueDate: '2025-12-31',
      });
      expect(result.current.todos[0].id).toBeDefined();
      expect(result.current.todos[0].createdAt).toBeDefined();
      expect(result.current.todos[0].updatedAt).toBeDefined();
    });

    it('should persist todo to localStorage', () => {
      const { result } = renderHook(() => useTodoStorage({ defaultStatusId: TEST_STATUS_ID }));

      const newTodo: CreateTodoInput = {
        text: 'Persistent task',
        priority: Priority.LOW,
        category: 'home',
        dueDate: null,
      };

      act(() => {
        result.current.addTodo(newTodo);
      });

      const stored = JSON.parse(localStorageMock.getItem('todos') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].text).toBe('Persistent task');
    });
  });

  describe('Update Todo', () => {
    it('should update an existing todo', () => {
      const { result } = renderHook(() => useTodoStorage({ defaultStatusId: TEST_STATUS_ID }));

      const newTodo: CreateTodoInput = {
        text: 'Original text',
        priority: Priority.MEDIUM,
        category: 'work',
        dueDate: null,
      };

      act(() => {
        result.current.addTodo(newTodo);
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.updateTodo(todoId, { text: 'Updated text', priority: Priority.HIGH });
      });

      expect(result.current.todos[0].text).toBe('Updated text');
      expect(result.current.todos[0].priority).toBe(Priority.HIGH);
      expect(result.current.todos[0].updatedAt).toBeDefined();
      expect(new Date(result.current.todos[0].updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(result.current.todos[0].createdAt).getTime()
      );
    });

    it('should not update non-existent todo', () => {
      const { result } = renderHook(() => useTodoStorage({ defaultStatusId: TEST_STATUS_ID }));

      const initialLength = result.current.todos.length;

      act(() => {
        result.current.updateTodo('non-existent-id', { text: 'Should not work' });
      });

      expect(result.current.todos).toHaveLength(initialLength);
    });
  });

  describe('Delete Todo', () => {
    it('should delete an existing todo', () => {
      const { result } = renderHook(() => useTodoStorage({ defaultStatusId: TEST_STATUS_ID }));

      const newTodo: CreateTodoInput = {
        text: 'To be deleted',
        priority: Priority.LOW,
        category: 'temp',
        dueDate: null,
      };

      act(() => {
        result.current.addTodo(newTodo);
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.deleteTodo(todoId);
      });

      expect(result.current.todos).toHaveLength(0);
    });

    it('should persist deletion to localStorage', () => {
      const { result } = renderHook(() => useTodoStorage({ defaultStatusId: TEST_STATUS_ID }));

      const newTodo: CreateTodoInput = {
        text: 'To be deleted',
        priority: Priority.LOW,
        category: 'temp',
        dueDate: null,
      };

      act(() => {
        result.current.addTodo(newTodo);
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.deleteTodo(todoId);
      });

      const stored = JSON.parse(localStorageMock.getItem('todos') || '[]');
      expect(stored).toHaveLength(0);
    });
  });

  describe('Toggle Todo', () => {
    it('should toggle todo completion status', () => {
      const { result } = renderHook(() => useTodoStorage({ defaultStatusId: TEST_STATUS_ID }));

      const newTodo: CreateTodoInput = {
        text: 'Toggle me',
        priority: Priority.MEDIUM,
        category: 'test',
        dueDate: null,
      };

      act(() => {
        result.current.addTodo(newTodo);
      });

      const todoId = result.current.todos[0].id;

      expect(result.current.todos[0].completed).toBe(false);

      act(() => {
        result.current.toggleTodo(todoId);
      });

      expect(result.current.todos[0].completed).toBe(true);

      act(() => {
        result.current.toggleTodo(todoId);
      });

      expect(result.current.todos[0].completed).toBe(false);
    });
  });
});
