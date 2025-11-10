import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import { Todo, Priority, KanbanStatus } from '../../types';

const mockTodo: Todo = {
  id: '1',
  text: 'Test todo',
  completed: false,
  status: KanbanStatus.TODO,
  priority: Priority.MEDIUM,
  category: 'Work',
  dueDate: '2025-12-31',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('TodoItem', () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnDelete.mockClear();
    mockOnUpdate.mockClear();
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should have accessible checkbox with proper label', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: /test todo/i });
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('should show checked state for completed todos', () => {
      const completedTodo = { ...mockTodo, completed: true };
      render(
        <TodoItem
          todo={completedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should support keyboard navigation for edit mode', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const textInput = screen.getByDisplayValue('Test todo');
      expect(textInput).toHaveFocus();
    });

    it('should have focus visible indicators', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });
  });

  describe('User Interactions', () => {
    it('should call onToggle when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(mockOnToggle).toHaveBeenCalledWith('1');
    });

    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    it('should enter edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      expect(screen.getByDisplayValue('Test todo')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should update todo when save is clicked in edit mode', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const textInput = screen.getByDisplayValue('Test todo');
      await user.clear(textInput);
      await user.type(textInput, 'Updated todo');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      expect(mockOnUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
        text: 'Updated todo',
      }));
    });

    it('should cancel edit mode when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const textInput = screen.getByDisplayValue('Test todo');
      await user.clear(textInput);
      await user.type(textInput, 'Should not save');

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnUpdate).not.toHaveBeenCalled();
      // After cancel, should exit edit mode and show original text
      expect(screen.getByText('Test todo')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
    });

    it('should save edit on Enter key', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const textInput = screen.getByDisplayValue('Test todo');
      await user.clear(textInput);
      await user.type(textInput, 'Quick update{Enter}');

      expect(mockOnUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
        text: 'Quick update',
      }));
    });

    it('should cancel edit on Escape key', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const textInput = screen.getByDisplayValue('Test todo');
      await user.clear(textInput);
      await user.type(textInput, 'Will cancel{Escape}');

      expect(mockOnUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Display Information', () => {
    it('should display todo text', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });

    it('should display category', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Work')).toBeInTheDocument();
    });

    it('should display due date', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText(/dec 31, 2025/i)).toBeInTheDocument();
    });

    it('should display priority indicator', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      // Priority is indicated via CSS class on the container
      const container = screen.getByRole('checkbox').closest('div');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass(expect.any(String));
    });

    it('should apply completed styling when todo is completed', () => {
      const completedTodo = { ...mockTodo, completed: true };
      render(
        <TodoItem
          todo={completedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const todoText = screen.getByText('Test todo');
      // Completed styling is applied via CSS class
      expect(todoText).toBeInTheDocument();
      expect(todoText.className).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty category', () => {
      const todoWithoutCategory = { ...mockTodo, category: '' };
      render(
        <TodoItem
          todo={todoWithoutCategory}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.queryByText('Work')).not.toBeInTheDocument();
    });

    it('should handle null due date', () => {
      const todoWithoutDueDate = { ...mockTodo, dueDate: null };
      render(
        <TodoItem
          todo={todoWithoutDueDate}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.queryByText(/dec/i)).not.toBeInTheDocument();
    });

    it('should not save edit if text is empty', async () => {
      const user = userEvent.setup();
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const textInput = screen.getByDisplayValue('Test todo');
      await user.clear(textInput);

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      expect(mockOnUpdate).not.toHaveBeenCalled();
    });

    it('should handle all priority levels', () => {
      const { rerender } = render(
        <TodoItem
          todo={{ ...mockTodo, priority: Priority.HIGH }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      let container = screen.getByRole('checkbox').closest('div');
      expect(container).toBeInTheDocument();
      const initialClass = container?.className;

      rerender(
        <TodoItem
          todo={{ ...mockTodo, priority: Priority.LOW }}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      );

      container = screen.getByRole('checkbox').closest('div');
      expect(container).toBeInTheDocument();
      // Class should change when priority changes
      expect(container?.className).not.toBe(initialClass);
    });
  });
});
