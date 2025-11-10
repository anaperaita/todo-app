import { useMemo } from 'react';
import { KanbanStatus } from '../../types';

interface KanbanColumnViewModel {
  title: string;
  count: number;
  isEmpty: boolean;
  statusClass: string;
  indicatorClass: string;
}

interface UseKanbanColumnViewModelProps {
  status: KanbanStatus;
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
    switch (status) {
      case KanbanStatus.TODO:
        return 'To Do';
      case KanbanStatus.IN_PROGRESS:
        return 'In Progress';
      case KanbanStatus.DONE:
        return 'Done';
      default:
        return 'Unknown';
    }
  }, [status]);

  const statusClass = useMemo(() => {
    switch (status) {
      case KanbanStatus.TODO:
        return 'status__todo';
      case KanbanStatus.IN_PROGRESS:
        return 'status__inProgress';
      case KanbanStatus.DONE:
        return 'status__done';
      default:
        return '';
    }
  }, [status]);

  const indicatorClass = useMemo(() => {
    switch (status) {
      case KanbanStatus.TODO:
        return 'todo';
      case KanbanStatus.IN_PROGRESS:
        return 'inProgress';
      case KanbanStatus.DONE:
        return 'done';
      default:
        return '';
    }
  }, [status]);

  const count = todoCount;
  const isEmpty = todoCount === 0;

  return {
    title,
    count,
    isEmpty,
    statusClass,
    indicatorClass,
  };
};
