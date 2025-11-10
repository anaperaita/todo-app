import { useMemo } from 'react';
import { Todo, TodoStats } from '../../types';

interface TodoStatsViewModel {
  stats: TodoStats;
}

interface UseTodoStatsViewModelProps {
  todos: Todo[];
}

/**
 * ViewModel for TodoStats component.
 * Calculates statistics from the todo list.
 */
export const useTodoStatsViewModel = ({
  todos,
}: UseTodoStatsViewModelProps): TodoStatsViewModel => {
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;

    return {
      total,
      active,
      completed,
    };
  }, [todos]);

  return {
    stats,
  };
};
