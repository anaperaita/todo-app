import React from 'react';
import { Todo } from '../../types';
import { useTodoStatsViewModel } from './useTodoStatsViewModel';
import styles from './TodoStats.module.css';

export interface TodoStatsProps {
  todos: Todo[];
}

/**
 * Statistics display component showing total, active, and completed task counts.
 */
export const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const { stats } = useTodoStatsViewModel({ todos });

  return (
    <div className={styles.stats} role="region" aria-label="Task statistics">
      <div className={styles.statCard}>
        <div className={styles.statNumber}>{stats.total}</div>
        <div className={styles.statLabel}>Total</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statNumber}>{stats.active}</div>
        <div className={styles.statLabel}>Active</div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statNumber}>{stats.completed}</div>
        <div className={styles.statLabel}>Completed</div>
      </div>
    </div>
  );
};
