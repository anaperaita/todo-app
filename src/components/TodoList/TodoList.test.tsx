import { screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import { renderWithStatus, TEST_STATUS_IDS } from '../../test-utils/testHelpers';
import { Todo, Priority, SortOption } from '../../types';

const mockTodos: Todo[] = [
  {
    id: '1',
    text: 'First task',
    completed: false,
    status: TEST_STATUS_IDS.TODO,
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
    status: TEST_STATUS_IDS.DONE,
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
    status: TEST_STATUS_IDS.TODO,
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
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('should have list items for each todo', () => {
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    it('should have accessible empty state message', () => {
      renderWithStatus(
        <TodoList
          todos={[]}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText:'', sortBy: SortOption.DATE_ADDED }}
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
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.getByText('Second task')).toBeInTheDocument();
      expect(screen.getByText('Third task')).toBeInTheDocument();
    });

    it('should show only TODO status todos when filtered', () => {
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.queryByText('Second task')).not.toBeInTheDocument();
      expect(screen.getByText('Third task')).toBeInTheDocument();
    });

    it('should show only DONE status todos when filtered', () => {
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.DONE], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
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
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText:'first', sortBy: SortOption.DATE_ADDED }}
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
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText:'work', sortBy: SortOption.DATE_ADDED }}
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
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO], categories: [], searchText:'work', sortBy: SortOption.DATE_ADDED }}
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
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
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
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText:'', sortBy: SortOption.DATE_ADDED_DESC }}
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
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText:'', sortBy: SortOption.PRIORITY }}
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
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText:'', sortBy: SortOption.ALPHABETICAL }}
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
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText:'', sortBy: SortOption.DUE_DATE }}
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
      renderWithStatus(
        <TodoList
          todos={[]}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText:'', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });

    it('should show message when search returns no results', () => {
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText:'nonexistent', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });

    it('should show message when filter returns no results', () => {
      const allCompletedTodos = mockTodos.map(todo => ({ ...todo, completed: true, status: TEST_STATUS_IDS.DONE }));

      renderWithStatus(
        <TodoList
          todos={allCompletedTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO], categories: [], searchText:'', sortBy: SortOption.DATE_ADDED }}
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
      renderWithStatus(
        <TodoList
          todos={mockTodos}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText:'   ', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('should handle todos without categories in search', () => {
      const todosWithoutCategory = mockTodos.map(todo => ({ ...todo, category: '' }));

      renderWithStatus(
        <TodoList
          todos={todosWithoutCategory}
          filters={{ statuses: [TEST_STATUS_IDS.TODO, TEST_STATUS_IDS.IN_PROGRESS, TEST_STATUS_IDS.DONE], categories: [], searchText:'first', sortBy: SortOption.DATE_ADDED }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('First task')).toBeInTheDocument();
    });
  });
});
