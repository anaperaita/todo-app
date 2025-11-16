import { useMemo } from 'react';
import { Status } from '../../types';

interface KanbanColumnViewModel {
  title: string;
  count: number;
  isEmpty: boolean;
  statusClass: string;
}

interface UseKanbanColumnViewModelProps {
  status: Status;
  todoCount: number;
}

/**
 * ViewModel for KanbanColumn component.
 * Provides column metadata based on status.
 */
export const useKanbanColumnViewModel = ({
  status,
  todoCount,
}: UseKanbanColumnViewModelProps): KanbanColumnViewModel => {
  const title = useMemo(() => {
    return status.label;
  }, [status]);

  const statusClass = useMemo(() => {
    return `status__${status.value}`;
  }, [status]);

  const count = todoCount;
  const isEmpty = todoCount === 0;

  return {
    title,
    count,
    isEmpty,
    statusClass,
  };
};
