import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoApp } from './TodoApp';

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

describe('TodoApp', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<TodoApp />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should have main landmark', () => {
      render(<TodoApp />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should support keyboard navigation through all controls', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      // Tab through form, filters, etc.
      await user.tab();
      expect(screen.getByLabelText(/task description/i)).toHaveFocus();
    });
  });

  describe('Integration - Add Todo', () => {
    it('should add a new todo when form is submitted', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      const textInput = screen.getByLabelText(/task description/i);
      await user.type(textInput, 'New task');

      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);

      expect(screen.getByText('New task')).toBeInTheDocument();
    });

    it('should add todo with all fields', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await user.type(screen.getByLabelText(/task description/i), 'Complete task');
      await user.selectOptions(screen.getByLabelText(/priority/i), 'high');
      await user.type(screen.getByLabelText(/category/i), 'Work');
      await user.type(screen.getByLabelText(/due date/i), '2025-12-31');

      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);

      expect(screen.getByText('Complete task')).toBeInTheDocument();
      expect(screen.getByText('Work')).toBeInTheDocument();
    });

    it('should update stats after adding a todo', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await user.type(screen.getByLabelText(/task description/i), 'Test task');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      const statCards = screen.getAllByRole('region');
      const firstCard = statCards[0];
      expect(within(firstCard).getByText('1')).toBeInTheDocument();
    });
  });

  describe('Integration - Toggle Todo', () => {
    it('should toggle todo completion status', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      // Add a todo
      await user.type(screen.getByLabelText(/task description/i), 'Toggle me');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Toggle it
      const checkbox = screen.getByRole('checkbox', { name: /toggle me/i });
      await user.click(checkbox);

      expect(checkbox).toBeChecked();

      // Toggle it back
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('should update stats when toggling todos', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      // Add a todo
      await user.type(screen.getByLabelText(/task description/i), 'Test task');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Initial state: 1 active, 0 completed
      const statsRegion = screen.getByRole('region', { name: /task statistics/i });
      expect(within(statsRegion).getAllByText('1')[0]).toBeInTheDocument();

      // Toggle to completed
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      // Now: 0 active, 1 completed
      expect(within(statsRegion).getByText('0')).toBeInTheDocument();
    });
  });

  describe('Integration - Edit Todo', () => {
    it('should edit an existing todo', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      // Add a todo
      await user.type(screen.getByLabelText(/task description/i), 'Original text');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Edit it
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const editInput = screen.getByDisplayValue('Original text');
      await user.clear(editInput);
      await user.type(editInput, 'Updated text');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      expect(screen.getByText('Updated text')).toBeInTheDocument();
      expect(screen.queryByText('Original text')).not.toBeInTheDocument();
    });
  });

  describe('Integration - Delete Todo', () => {
    it('should delete a todo', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      // Add a todo
      await user.type(screen.getByLabelText(/task description/i), 'To be deleted');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      expect(screen.getByText('To be deleted')).toBeInTheDocument();

      // Delete it
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(screen.queryByText('To be deleted')).not.toBeInTheDocument();
    });

    it('should update stats when deleting todos', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      // Add a todo
      await user.type(screen.getByLabelText(/task description/i), 'Test task');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Delete it
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      const statsRegion = screen.getByRole('region', { name: /task statistics/i });
      expect(within(statsRegion).getByText('0')).toBeInTheDocument();
    });
  });

  describe('Integration - Filtering', () => {
    it('should filter todos by status', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      // Add two todos
      await user.type(screen.getByLabelText(/task description/i), 'Task 1');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      await user.type(screen.getByLabelText(/task description/i), 'Task 2');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Complete one
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);

      // Filter to active only
      const statusFilter = screen.getByLabelText(/filter by status/i);
      await user.selectOptions(statusFilter, 'active');

      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('should filter todos by search text', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      // Add two todos
      await user.type(screen.getByLabelText(/task description/i), 'Buy groceries');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      await user.type(screen.getByLabelText(/task description/i), 'Walk dog');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Search for "groceries"
      const searchInput = screen.getByLabelText(/search tasks/i);
      await user.type(searchInput, 'groceries');

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.queryByText('Walk dog')).not.toBeInTheDocument();
    });
  });

  describe('Integration - Sorting', () => {
    it('should sort todos by priority', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      // Add todos with different priorities
      await user.type(screen.getByLabelText(/task description/i), 'Low priority task');
      await user.selectOptions(screen.getByLabelText(/priority/i), 'low');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      await user.type(screen.getByLabelText(/task description/i), 'High priority task');
      await user.selectOptions(screen.getByLabelText(/priority/i), 'high');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Sort by priority
      const sortSelect = screen.getByLabelText(/sort by/i);
      await user.selectOptions(sortSelect, 'priority');

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('High priority task');
      expect(items[1]).toHaveTextContent('Low priority task');
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no todos exist', () => {
      render(<TodoApp />);

      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
      expect(screen.getByText(/add your first task/i)).toBeInTheDocument();
    });

    it('should show stats with zeros when no todos exist', () => {
      render(<TodoApp />);

      const statsRegion = screen.getByRole('region', { name: /task statistics/i });
      expect(within(statsRegion).getAllByText('0')).toHaveLength(3);
    });
  });

  describe('Persistence', () => {
    it('should persist todos to localStorage', async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await user.type(screen.getByLabelText(/task description/i), 'Persistent task');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      const stored = JSON.parse(localStorageMock.getItem('todos') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].text).toBe('Persistent task');
    });
  });
});
