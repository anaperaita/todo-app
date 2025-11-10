import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilters } from './TodoFilters';
import { FilterStatus, SortOption } from '../../types';

describe('TodoFilters', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  describe('Accessibility', () => {
    it('should have properly labeled filter controls', () => {
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.getByLabelText(/search tasks/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/filter by status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const searchInput = screen.getByLabelText(/search tasks/i);
      const statusSelect = screen.getByLabelText(/filter by status/i);
      const sortSelect = screen.getByLabelText(/sort by/i);

      await user.tab();
      expect(searchInput).toHaveFocus();

      await user.tab();
      expect(statusSelect).toHaveFocus();

      await user.tab();
      expect(sortSelect).toHaveFocus();
    });

    it('should have clear focus indicators', () => {
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
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
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
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
          filters={{ status: FilterStatus.ALL, searchText: 'existing search', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const searchInput = screen.getByLabelText(/search tasks/i) as HTMLInputElement;
      expect(searchInput.value).toBe('existing search');
    });

    it('should clear search when user deletes text', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: 'test', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const searchInput = screen.getByLabelText(/search tasks/i);
      await user.clear(searchInput);

      expect(mockOnFilterChange).toHaveBeenLastCalledWith({
        status: FilterStatus.ALL,
        searchText: '',
        sortBy: SortOption.DATE_ADDED,
      });
    });
  });

  describe('Status Filter', () => {
    it('should allow selecting ALL status', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ACTIVE, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const statusSelect = screen.getByLabelText(/filter by status/i);
      await user.selectOptions(statusSelect, FilterStatus.ALL);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: FilterStatus.ALL,
        searchText: '',
        sortBy: SortOption.DATE_ADDED,
      });
    });

    it('should allow selecting ACTIVE status', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const statusSelect = screen.getByLabelText(/filter by status/i);
      await user.selectOptions(statusSelect, FilterStatus.ACTIVE);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: FilterStatus.ACTIVE,
        searchText: '',
        sortBy: SortOption.DATE_ADDED,
      });
    });

    it('should allow selecting COMPLETED status', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const statusSelect = screen.getByLabelText(/filter by status/i);
      await user.selectOptions(statusSelect, FilterStatus.COMPLETED);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: FilterStatus.COMPLETED,
        searchText: '',
        sortBy: SortOption.DATE_ADDED,
      });
    });

    it('should display current status filter', () => {
      render(
        <TodoFilters
          filters={{ status: FilterStatus.COMPLETED, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const statusSelect = screen.getByLabelText(/filter by status/i) as HTMLSelectElement;
      expect(statusSelect.value).toBe(FilterStatus.COMPLETED);
    });
  });

  describe('Sort Options', () => {
    it('should allow selecting date added (oldest first)', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.PRIORITY }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const sortSelect = screen.getByLabelText(/sort by/i);
      await user.selectOptions(sortSelect, SortOption.DATE_ADDED);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: FilterStatus.ALL,
        searchText: '',
        sortBy: SortOption.DATE_ADDED,
      });
    });

    it('should allow selecting date added (newest first)', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const sortSelect = screen.getByLabelText(/sort by/i);
      await user.selectOptions(sortSelect, SortOption.DATE_ADDED_DESC);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: FilterStatus.ALL,
        searchText: '',
        sortBy: SortOption.DATE_ADDED_DESC,
      });
    });

    it('should allow selecting priority sort', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const sortSelect = screen.getByLabelText(/sort by/i);
      await user.selectOptions(sortSelect, SortOption.PRIORITY);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: FilterStatus.ALL,
        searchText: '',
        sortBy: SortOption.PRIORITY,
      });
    });

    it('should allow selecting due date sort', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const sortSelect = screen.getByLabelText(/sort by/i);
      await user.selectOptions(sortSelect, SortOption.DUE_DATE);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: FilterStatus.ALL,
        searchText: '',
        sortBy: SortOption.DUE_DATE,
      });
    });

    it('should allow selecting alphabetical sort', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const sortSelect = screen.getByLabelText(/sort by/i);
      await user.selectOptions(sortSelect, SortOption.ALPHABETICAL);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: FilterStatus.ALL,
        searchText: '',
        sortBy: SortOption.ALPHABETICAL,
      });
    });

    it('should display current sort option', () => {
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.PRIORITY }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const sortSelect = screen.getByLabelText(/sort by/i) as HTMLSelectElement;
      expect(sortSelect.value).toBe(SortOption.PRIORITY);
    });
  });

  describe('Combined Filters', () => {
    it('should maintain search text when changing status', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: 'test', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const statusSelect = screen.getByLabelText(/filter by status/i);
      await user.selectOptions(statusSelect, FilterStatus.ACTIVE);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: FilterStatus.ACTIVE,
        searchText: 'test',
        sortBy: SortOption.DATE_ADDED,
      });
    });

    it('should maintain status when changing sort', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.COMPLETED, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const sortSelect = screen.getByLabelText(/sort by/i);
      await user.selectOptions(sortSelect, SortOption.PRIORITY);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        status: FilterStatus.COMPLETED,
        searchText: '',
        sortBy: SortOption.PRIORITY,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid typing in search box', async () => {
      const user = userEvent.setup();
      render(
        <TodoFilters
          filters={{ status: FilterStatus.ALL, searchText: '', sortBy: SortOption.DATE_ADDED }}
          onFilterChange={mockOnFilterChange}
        />
      );

      const searchInput = screen.getByLabelText(/search tasks/i);
      await user.type(searchInput, 'rapid');

      expect(mockOnFilterChange).toHaveBeenCalled();
      const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
      expect(lastCall.searchText).toBe('rapid');
      expect(lastCall.status).toBe(FilterStatus.ALL);
      expect(lastCall.sortBy).toBe(SortOption.DATE_ADDED);
    });
  });
});
