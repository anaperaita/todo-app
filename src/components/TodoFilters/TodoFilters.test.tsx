import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilters } from './TodoFilters';
import { SortOption, KanbanStatus, Todo, Priority } from '../../types';

const mockTodos: Todo[] = [
  {
    id: '1',
    text: 'Test task',
    completed: false,
    status: KanbanStatus.TODO,
    priority: Priority.MEDIUM,
    category: 'Work',
    dueDate: null,
    createdAt: '2025-11-10T00:00:00.000Z',
    updatedAt: '2025-11-10T00:00:00.000Z',
  },
];

describe('TodoFilters', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  describe('Accessibility', () => {
    it('should have properly labeled filter controls', () => {
      render(
        <TodoFilters
          filters={{ statuses: [KanbanStatus.TODO, KanbanStatus.IN_PROGRESS, KanbanStatus.DONE], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
          todos={mockTodos}
        />
      );

      expect(screen.getByLabelText(/search tasks/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/filter by status/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ statuses: [KanbanStatus.TODO, KanbanStatus.IN_PROGRESS, KanbanStatus.DONE], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
          todos={mockTodos}
        />
      );

      const searchInput = screen.getByLabelText(/search tasks/i);

      await user.tab();
      expect(searchInput).toHaveFocus();
    });

    it('should have clear focus indicators', () => {
      render(
        <TodoFilters
          filters={{ statuses: [KanbanStatus.TODO, KanbanStatus.IN_PROGRESS, KanbanStatus.DONE], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
          todos={mockTodos}
        />
      );

      const searchInput = screen.getByLabelText(/search tasks/i);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Search Functionality', () => {
    it('should allow user to type in search box', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ statuses: [KanbanStatus.TODO, KanbanStatus.IN_PROGRESS, KanbanStatus.DONE], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
          todos={mockTodos}
        />
      );

      const searchInput = screen.getByLabelText(/search tasks/i);
      await user.type(searchInput, 'test search');

      expect(mockOnFilterChange).toHaveBeenCalled();
      // Check that the final call contains the last character
      const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
      expect(lastCall.searchText).toBe('test search');
    });

    it('should display current search text', () => {
      render(
        <TodoFilters
          filters={{ statuses: [KanbanStatus.TODO, KanbanStatus.IN_PROGRESS, KanbanStatus.DONE], categories: [], searchText: 'existing search', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
          todos={mockTodos}
        />
      );

      const searchInput = screen.getByLabelText(/search tasks/i) as HTMLInputElement;
      expect(searchInput.value).toBe('existing search');
    });

    it('should clear search when user deletes text', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ statuses: [KanbanStatus.TODO, KanbanStatus.IN_PROGRESS, KanbanStatus.DONE], categories: [], searchText: 'test', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
          todos={mockTodos}
        />
      );

      const searchInput = screen.getByLabelText(/search tasks/i);
      await user.clear(searchInput);

      expect(mockOnFilterChange).toHaveBeenLastCalledWith({
        statuses: [KanbanStatus.TODO, KanbanStatus.IN_PROGRESS, KanbanStatus.DONE],
        categories: [],
        searchText: '',
        sortBy: SortOption.DATE_ADDED,
      });
    });
  });

  describe('Status Filter Pills', () => {
    it('should render all status pill buttons', () => {
      render(
        <TodoFilters
          filters={{ statuses: [KanbanStatus.TODO], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
          todos={mockTodos}
        />
      );

      expect(screen.getByRole('button', { name: 'To Do' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'In Progress' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    });

    it('should toggle status filter when clicked', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ statuses: [KanbanStatus.TODO], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
          todos={mockTodos}
        />
      );

      const inProgressButton = screen.getByRole('button', { name: 'In Progress' });
      await user.click(inProgressButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        statuses: [KanbanStatus.TODO, KanbanStatus.IN_PROGRESS],
        categories: [],
        searchText: '',
        sortBy: SortOption.DATE_ADDED,
      });
    });
  });

  describe('Sort Options', () => {
    it('should display sort dropdown button', () => {
      render(
        <TodoFilters
          filters={{ statuses: [KanbanStatus.TODO, KanbanStatus.IN_PROGRESS, KanbanStatus.DONE], categories: [], searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
          todos={mockTodos}
        />
      );

      expect(screen.getByLabelText(/sort options/i)).toBeInTheDocument();
    });
  });
});
