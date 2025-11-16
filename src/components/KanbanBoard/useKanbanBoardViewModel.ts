import { useMemo, useState, useCallback } from 'react';
import {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Todo, TodoFilters, UpdateTodoInput } from '../../types';
import { useStatuses } from '../../context/StatusContext';

interface KanbanBoardViewModel {
  todosByStatus: Record<string, Todo[]>;
  sensors: ReturnType<typeof useSensors>;
  activeId: string | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
  activeTodo: Todo | undefined;
}

interface UseKanbanBoardViewModelProps {
  todos: Todo[];
  filters: TodoFilters;
  onUpdate: (id: string, updates: UpdateTodoInput) => void;
}

/**
 * ViewModel for KanbanBoard component.
 * Handles todo grouping by status, filtering, and drag-and-drop logic.
 */
export const useKanbanBoardViewModel = ({
  todos,
  filters,
  onUpdate,
}: UseKanbanBoardViewModelProps): KanbanBoardViewModel => {
  const { statuses } = useStatuses();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure sensors for drag and drop (mouse, touch, keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter and group todos by status
  const todosByStatus = useMemo(() => {
    let filteredTodos = [...todos];

    // Apply status filter (multi-select)
    if (filters.statuses.length > 0) {
      filteredTodos = filteredTodos.filter((todo) => filters.statuses.includes(todo.status));
    }

    // Apply category filter (multi-select)
    if (filters.categories.length > 0) {
      filteredTodos = filteredTodos.filter((todo) => filters.categories.includes(todo.category));
    }

    // Apply priority filter (multi-select)
    if (filters.priorities.length > 0) {
      filteredTodos = filteredTodos.filter((todo) => filters.priorities.includes(todo.priority));
    }

    // Apply search filter
    const searchText = filters.searchText.trim().toLowerCase();
    if (searchText) {
      filteredTodos = filteredTodos.filter((todo) => {
        const textMatch = todo.text.toLowerCase().includes(searchText);
        const categoryMatch = todo.category.toLowerCase().includes(searchText);
        return textMatch || categoryMatch;
      });
    }

    // Group by status dynamically
    const grouped: Record<string, Todo[]> = {};

    // Initialize groups for all available statuses
    statuses.forEach((status) => {
      grouped[status.id] = [];
    });

    // Assign todos to their status groups
    filteredTodos.forEach((todo) => {
      if (grouped[todo.status]) {
        grouped[todo.status].push(todo);
      }
    });

    return grouped;
  }, [todos, filters, statuses]);

  // Find the currently dragged todo
  const activeTodo = useMemo(() => {
    if (!activeId) return undefined;
    return todos.find((todo) => todo.id === activeId);
  }, [activeId, todos]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Can add visual feedback here if needed
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        setActiveId(null);
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;

      // Check if dragged over a column (status ID)
      const validStatusIds = statuses.map((s) => s.id);
      if (validStatusIds.includes(overId)) {
        // Update todo status
        onUpdate(activeId, { status: overId });
      }

      setActiveId(null);
    },
    [onUpdate, statuses]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return {
    todosByStatus,
    sensors,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    activeTodo,
  };
};
