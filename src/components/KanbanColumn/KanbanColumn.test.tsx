import { screen } from '@testing-library/react';
import { KanbanColumn } from './KanbanColumn';
import { renderWithStatus, MOCK_STATUSES, TEST_STATUS_IDS } from '../../test-utils/testHelpers';
import { Priority, Todo } from '../../types';

// Mock @dnd-kit components
jest.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ setNodeRef: jest.fn(), isOver: false }),
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

describe('KanbanColumn', () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();

  const createMockTodo = (overrides?: Partial<Todo>): Todo => ({
    id: '1',
    text: 'Test todo',
    completed: false,
    status: TEST_STATUS_IDS.TODO,
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

  describe('Column Headers', () => {
    it('should display "To Do" for TODO status', () => {
      renderWithStatus(
        <KanbanColumn
          status={MOCK_STATUSES.TODO}
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    it('should display "In Progress" for IN_PROGRESS status', () => {
      renderWithStatus(
        <KanbanColumn
          status={MOCK_STATUSES.IN_PROGRESS}
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('should display "Done" for DONE status', () => {
      renderWithStatus(
        <KanbanColumn
          status={MOCK_STATUSES.DONE}
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Done')).toBeInTheDocument();
    });
  });

  describe('Todo Count', () => {
    it('should display 0 count when no todos', () => {
      renderWithStatus(
        <KanbanColumn
          status={MOCK_STATUSES.TODO}
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByLabelText('0 tasks')).toBeInTheDocument();
    });

    it('should display correct count for multiple todos', () => {
      const todos = [
        createMockTodo({ id: '1' }),
        createMockTodo({ id: '2' }),
        createMockTodo({ id: '3' }),
      ];

      renderWithStatus(
        <KanbanColumn
          status={MOCK_STATUSES.TODO}
          todos={todos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByLabelText('3 tasks')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no todos', () => {
      renderWithStatus(
        <KanbanColumn
          status={MOCK_STATUSES.TODO}
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('No tasks here')).toBeInTheDocument();
    });

    it('should not show empty state when todos exist', () => {
      const todos = [createMockTodo()];

      renderWithStatus(
        <KanbanColumn
          status={MOCK_STATUSES.TODO}
          todos={todos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.queryByText('No tasks here')).not.toBeInTheDocument();
    });
  });

  describe('Todo Rendering', () => {
    it('should render all provided todos', () => {
      const todos = [
        createMockTodo({ id: '1', text: 'Task 1' }),
        createMockTodo({ id: '2', text: 'Task 2' }),
        createMockTodo({ id: '3', text: 'Task 3' }),
      ];

      renderWithStatus(
        <KanbanColumn
          status={MOCK_STATUSES.TODO}
          todos={todos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderWithStatus(
        <KanbanColumn
          status={MOCK_STATUSES.TODO}
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByRole('region', { name: /to do column/i })).toBeInTheDocument();
    });

    it('should have heading with proper ID', () => {
      renderWithStatus(
        <KanbanColumn
          status={MOCK_STATUSES.TODO}
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const heading = screen.getByRole('heading', { name: /to do/i });
      expect(heading).toHaveAttribute('id', 'status-todo-heading');
    });
  });
});
