import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from './TodoForm';
import { Priority } from '../../types';

describe('TodoForm', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  describe('Accessibility', () => {
    it('should have proper form structure with labels', () => {
      render(<TodoForm onAdd={mockOnAdd} />);

      expect(screen.getByLabelText(/task description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    });

    it('should have an accessible submit button', () => {
      render(<TodoForm onAdd={mockOnAdd} />);

      const button = screen.getByRole('button', { name: /add task/i });
      expect(button).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      const textInput = screen.getByLabelText(/task description/i);
      const prioritySelect = screen.getByLabelText(/priority/i);
      const categoryInput = screen.getByLabelText(/category/i);
      const dueDateInput = screen.getByLabelText(/due date/i);

      // Tab through all form fields
      await user.tab();
      expect(textInput).toHaveFocus();

      await user.tab();
      expect(prioritySelect).toHaveFocus();

      await user.tab();
      expect(categoryInput).toHaveFocus();

      await user.tab();
      expect(dueDateInput).toHaveFocus();
    });

    it('should have required field marked appropriately', () => {
      render(<TodoForm onAdd={mockOnAdd} />);

      const textInput = screen.getByLabelText(/task description/i);
      expect(textInput).toBeRequired();
    });
  });

  describe('User Interactions', () => {
    it('should allow user to type task description', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      const textInput = screen.getByLabelText(/task description/i);
      await user.type(textInput, 'Buy groceries');

      expect(textInput).toHaveValue('Buy groceries');
    });

    it('should allow user to select priority', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      const prioritySelect = screen.getByLabelText(/priority/i);
      await user.selectOptions(prioritySelect, Priority.HIGH);

      expect(prioritySelect).toHaveValue(Priority.HIGH);
    });

    it('should allow user to enter category', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      const categoryInput = screen.getByLabelText(/category/i);
      await user.type(categoryInput, 'Shopping');

      expect(categoryInput).toHaveValue('Shopping');
    });

    it('should allow user to select due date', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      const dueDateInput = screen.getByLabelText(/due date/i);
      await user.type(dueDateInput, '2025-12-31');

      expect(dueDateInput).toHaveValue('2025-12-31');
    });

    it('should call onAdd with correct data when form is submitted', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      await user.type(screen.getByLabelText(/task description/i), 'Complete project');
      await user.selectOptions(screen.getByLabelText(/priority/i), Priority.HIGH);
      await user.type(screen.getByLabelText(/category/i), 'Work');
      await user.type(screen.getByLabelText(/due date/i), '2025-11-15');

      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);

      expect(mockOnAdd).toHaveBeenCalledWith({
        text: 'Complete project',
        priority: Priority.HIGH,
        category: 'Work',
        dueDate: '2025-11-15',
      });
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      const textInput = screen.getByLabelText(/task description/i);
      const categoryInput = screen.getByLabelText(/category/i);
      const dueDateInput = screen.getByLabelText(/due date/i);

      await user.type(textInput, 'Test task');
      await user.type(categoryInput, 'Test');
      await user.type(dueDateInput, '2025-12-01');

      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);

      expect(textInput).toHaveValue('');
      expect(categoryInput).toHaveValue('');
      expect(dueDateInput).toHaveValue('');
    });

    it('should prevent submission when task description is empty', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should handle submission with Enter key', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      const textInput = screen.getByLabelText(/task description/i);
      await user.type(textInput, 'Quick task{Enter}');

      expect(mockOnAdd).toHaveBeenCalledWith({
        text: 'Quick task',
        priority: Priority.MEDIUM, // default
        category: '',
        dueDate: null,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle submission with only required field filled', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      await user.type(screen.getByLabelText(/task description/i), 'Minimal task');
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);

      expect(mockOnAdd).toHaveBeenCalledWith({
        text: 'Minimal task',
        priority: Priority.MEDIUM,
        category: '',
        dueDate: null,
      });
    });

    it('should trim whitespace from text input', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      await user.type(screen.getByLabelText(/task description/i), '  Spaces around  ');
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);

      expect(mockOnAdd).toHaveBeenCalledWith({
        text: 'Spaces around',
        priority: Priority.MEDIUM,
        category: '',
        dueDate: null,
      });
    });

    it('should not submit if trimmed text is empty', async () => {
      const user = userEvent.setup();
      render(<TodoForm onAdd={mockOnAdd} />);

      await user.type(screen.getByLabelText(/task description/i), '   ');
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);

      expect(mockOnAdd).not.toHaveBeenCalled();
    });
  });
});
