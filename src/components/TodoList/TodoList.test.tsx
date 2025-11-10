import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import { Todo, Priority, FilterStatus, SortOption, KanbanStatus } from '../../types';

const mockTodos: Todo[] = [
  {
    id: '1',
    text: 'First task',
    completed: false,
    status: KanbanStatus.TODO,
    priority: Priority.HIGH,
    category: 'Work',
    dueDate: '2025-11-15',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    text: 'Second task',
    completed: true,
    status: KanbanStatus.DONE,
    priority: Priority.MEDIUM,
    category: 'Personal',
    dueDate: '2025-12-01',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    text: 'Third task',
    completed: false,
    status: KanbanStatus.TODO,
    priority: Priority.LOW,
    category: 'Work',
    dueDate: null,
    createdAt: '2025-01-03T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
  },
];

describe('TodoList', () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnDelete.mockClear();
    mockOnUpdate.mockClear();
  });

  describe('Accessibility', () => {
    it('should render as a list with proper semantics', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('should have list items for each todo', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    it('should have accessible empty state message', () => {
      render(
        <TodoList
          todos={[]}
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('should show all todos when filter is ALL', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.getByText('Second task')).toBeInTheDocument();
      expect(screen.getByText('Third task')).toBeInTheDocument();
    });

    it('should show only active todos when filter is ACTIVE', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ACTIVE, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.queryByText('Second task')).not.toBeInTheDocument();
      expect(screen.getByText('Third task')).toBeInTheDocument();
    });

    it('should show only completed todos when filter is COMPLETED', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.COMPLETED, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.queryByText('First task')).not.toBeInTheDocument();
      expect(screen.getByText('Second task')).toBeInTheDocument();
      expect(screen.queryByText('Third task')).not.toBeInTheDocument();
    });

    it('should filter by search text (case insensitive)', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: 'first', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.queryByText('Second task')).not.toBeInTheDocument();
      expect(screen.queryByText('Third task')).not.toBeInTheDocument();
    });

    it('should filter by category in search text', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: 'work', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.queryByText('Second task')).not.toBeInTheDocument();
      expect(screen.getByText('Third task')).toBeInTheDocument();
    });

    it('should combine status filter and search text', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ACTIVE, searchText: 'work', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.queryByText('Second task')).not.toBeInTheDocument();
      expect(screen.getByText('Third task')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort by date added (oldest first)', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('First task');
      expect(items[1]).toHaveTextContent('Second task');
      expect(items[2]).toHaveTextContent('Third task');
    });

    it('should sort by date added descending (newest first)', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED_DESC }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('Third task');
      expect(items[1]).toHaveTextContent('Second task');
      expect(items[2]).toHaveTextContent('First task');
    });

    it('should sort by priority (high to low)', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.PRIORITY }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('First task'); // HIGH
      expect(items[1]).toHaveTextContent('Second task'); // MEDIUM
      expect(items[2]).toHaveTextContent('Third task'); // LOW
    });

    it('should sort alphabetically', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.ALPHABETICAL }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('First task');
      expect(items[1]).toHaveTextContent('Second task');
      expect(items[2]).toHaveTextContent('Third task');
    });

    it('should sort by due date (earliest first, null dates last)', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DUE_DATE }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('First task'); // 2025-11-15
      expect(items[1]).toHaveTextContent('Second task'); // 2025-12-01
      expect(items[2]).toHaveTextContent('Third task'); // null
    });
  });

  describe('Empty States', () => {
    it('should show message when no todos exist', () => {
      render(
        <TodoList
          todos={[]}
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });

    it('should show message when search returns no results', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: 'nonexistent', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });

    it('should show message when filter returns no results', () => {
      const allCompletedTodos = mockTodos.map(todo => ({ ...todo, completed: true }));

      render(
        <TodoList
          todos={allCompletedTodos}
          filters={{ status: FilterStatus.ACTIVE, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty search text gracefully', () => {
      render(
        <TodoList
          todos={mockTodos}
          filters={{ status: FilterStatus.ALL, searchText: '   ', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('should handle todos without categories in search', () => {
      const todosWithoutCategory = mockTodos.map(todo => ({ ...todo, category: '' }));

      render(
        <TodoList
          todos={todosWithoutCategory}
          filters={{ status: FilterStatus.ALL, searchText: 'first', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('First task')).toBeInTheDocument();
    });
  });
});
