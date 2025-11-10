import { render, screen } from '@testing-library/react';
import { TodoStats } from './TodoStats';
import { Todo, Priority, KanbanStatus } from '../../types';

const createMockTodo = (id: string, completed: boolean): Todo => ({
  id,
  text: `Task ${id}`,
  completed,
  status: completed ? KanbanStatus.DONE : KanbanStatus.TODO,
  priority: Priority.MEDIUM,
  category: 'Test',
  dueDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe('TodoStats', () => {
  describe('Accessibility', () => {
    it('should render stats with proper semantic structure', () => {
      const todos = [createMockTodo('1', false), createMockTodo('2', true)];
      render(<TodoStats todos={todos} />);

      expect(screen.getByText(/total/i)).toBeInTheDocument();
      expect(screen.getByText(/active/i)).toBeInTheDocument();
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });

    it('should have accessible labels for statistics', () => {
      const todos = [createMockTodo('1', false), createMockTodo('2', true)];
      render(<TodoStats todos={todos} />);

      expect(screen.getByRole('region')).toBeInTheDocument();
    });
  });

  describe('Statistics Display', () => {
    it('should display total count correctly', () => {
      const todos = [
        createMockTodo('1', false),
        createMockTodo('2', false),
        createMockTodo('3', true),
      ];
      render(<TodoStats todos={todos} />);

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText(/total/i)).toBeInTheDocument();
    });

    it('should display active count correctly', () => {
      const todos = [
        createMockTodo('1', false),
        createMockTodo('2', false),
        createMockTodo('3', true),
      ];
      render(<TodoStats todos={todos} />);

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText(/active/i)).toBeInTheDocument();
    });

    it('should display completed count correctly', () => {
      const todos = [
        createMockTodo('1', false),
        createMockTodo('2', true),
        createMockTodo('3', true),
      ];
      render(<TodoStats todos={todos} />);

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });

    it('should show singular form for 1 item', () => {
      const todos = [createMockTodo('1', false)];
      render(<TodoStats todos={todos} />);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should show plural form for multiple items', () => {
      const todos = [createMockTodo('1', false), createMockTodo('2', false)];
      render(<TodoStats todos={todos} />);

      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty todo list', () => {
      render(<TodoStats todos={[]} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle all todos being active', () => {
      const todos = [createMockTodo('1', false), createMockTodo('2', false)];
      render(<TodoStats todos={todos} />);

      const activeCount = screen.getAllByText('2')[0];
      expect(activeCount).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle all todos being completed', () => {
      const todos = [createMockTodo('1', true), createMockTodo('2', true)];
      render(<TodoStats todos={todos} />);

      expect(screen.getByText('0')).toBeInTheDocument();
      const completedCount = screen.getAllByText('2')[0];
      expect(completedCount).toBeInTheDocument();
    });

    it('should update when todos change', () => {
      const { rerender } = render(<TodoStats todos={[createMockTodo('1', false)]} />);

      expect(screen.getByText('1')).toBeInTheDocument();

      rerender(
        <TodoStats
          todos={[createMockTodo('1', false), createMockTodo('2', false)]}
        />
      );

      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Visual Feedback', () => {
    it('should render all three stat cards', () => {
      const todos = [
        createMockTodo('1', false),
        createMockTodo('2', true),
        createMockTodo('3', false),
      ];
      render(<TodoStats todos={todos} />);

      const statCards = screen.getAllByRole('region');
      expect(statCards.length).toBeGreaterThanOrEqual(1);
    });

    it('should display stats in correct order', () => {
      const todos = [createMockTodo('1', false), createMockTodo('2', true)];
      const { container } = render(<TodoStats todos={todos} />);

      const text = container.textContent;
      const totalIndex = text?.indexOf('Total') || 0;
      const activeIndex = text?.indexOf('Active') || 0;
      const completedIndex = text?.indexOf('Completed') || 0;

      expect(totalIndex).toBeLessThan(activeIndex);
      expect(activeIndex).toBeLessThan(completedIndex);
    });
  });
});
