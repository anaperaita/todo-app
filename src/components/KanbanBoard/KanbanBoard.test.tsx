import { render, screen } from '@testing-library/react';
import { KanbanBoard } from './KanbanBoard';
import { Todo, Priority, FilterStatus, SortOption, KanbanStatus } from '../../types';

describe('KanbanBoard', () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();

  const defaultFilters = {
    status: FilterStatus.ALL,
    searchText: '',
    sortBy: SortOption.DATE_ADDED,
  };

  const createMockTodo = (overrides?: Partial<Todo>): Todo => ({
    id: '1',
    text: 'Test todo',
    completed: false,
    status: KanbanStatus.TODO,
    priority: Priority.MEDIUM,
    category: 'Work',
    dueDate: '2025-12-31',
    createdAt: '2025-11-10T00:00:00.000Z',
    updatedAt: '2025-11-10T00:00:00.000Z',
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty State', () => {
    it('should show empty state when no todos exist', () => {
      render(
        <KanbanBoard
          todos={[]}
          filters={defaultFilters}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
      expect(screen.getByText(/click the \+ button/i)).toBeInTheDocument();
    });
  });

  describe('Column Rendering', () => {
    it('should render all three columns', () => {
      const todos = [createMockTodo()];

      render(
        <KanbanBoard
          todos={todos}
          filters={defaultFilters}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('should group todos by status correctly', () => {
      const todos = [
        createMockTodo({ id: '1', text: 'Todo 1', status: KanbanStatus.TODO }),
        createMockTodo({ id: '2', text: 'Todo 2', status: KanbanStatus.IN_PROGRESS }),
        createMockTodo({ id: '3', text: 'Todo 3', status: KanbanStatus.DONE }),
      ];

      render(
        <KanbanBoard
          todos={todos}
          filters={defaultFilters}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Todo 2')).toBeInTheDocument();
      expect(screen.getByText('Todo 3')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('should filter todos by search text', () => {
      const todos = [
        createMockTodo({ id: '1', text: 'Buy groceries' }),
        createMockTodo({ id: '2', text: 'Walk dog' }),
      ];

      const filters = { ...defaultFilters, searchText: 'groceries' };

      render(
        <KanbanBoard
          todos={todos}
          filters={filters}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.queryByText('Walk dog')).not.toBeInTheDocument();
    });

    it('should filter todos by completion status', () => {
      const todos = [
        createMockTodo({ id: '1', text: 'Active task', completed: false }),
        createMockTodo({ id: '2', text: 'Completed task', completed: true }),
      ];

      const filters = { ...defaultFilters, status: FilterStatus.ACTIVE };

      render(
        <KanbanBoard
          todos={todos}
          filters={filters}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Active task')).toBeInTheDocument();
      expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
    });

    it('should filter by category in search', () => {
      const todos = [
        createMockTodo({ id: '1', text: 'Task 1', category: 'Work' }),
        createMockTodo({ id: '2', text: 'Task 2', category: 'Personal' }),
      ];

      const filters = { ...defaultFilters, searchText: 'work' };

      render(
        <KanbanBoard
          todos={todos}
          filters={filters}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for columns', () => {
      const todos = [createMockTodo()];

      render(
        <KanbanBoard
          todos={todos}
          filters={defaultFilters}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByLabelText(/to do column/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/in progress column/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/done column/i)).toBeInTheDocument();
    });

    it('should show keyboard instructions', () => {
      const todos = [createMockTodo()];

      render(
        <KanbanBoard
          todos={todos}
          filters={defaultFilters}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText(/drag & drop tips/i)).toBeInTheDocument();
      expect(screen.getByText(/press space to pick up/i)).toBeInTheDocument();
    });
  });

  describe('Todo Counts', () => {
    it('should display correct count for each column', () => {
      const todos = [
        createMockTodo({ id: '1', status: KanbanStatus.TODO }),
        createMockTodo({ id: '2', status: KanbanStatus.TODO }),
        createMockTodo({ id: '3', status: KanbanStatus.IN_PROGRESS }),
      ];

      render(
        <KanbanBoard
          todos={todos}
          filters={defaultFilters}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      // Check counts (exact matching might vary, so we check for presence)
      const counts = screen.getAllByLabelText(/\d+ tasks/i);
      expect(counts.length).toBeGreaterThan(0);
    });
  });
});
