import React from 'react';
import styles from './FilterTabs.module.css';

export interface FilterTabsProps {
  activeTab: 'basic' | 'advanced';
  onTabChange: (tab: 'basic' | 'advanced') => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.tabContainer} role="tablist" aria-label="Filter categories">
      <button
        role="tab"
        aria-selected={activeTab === 'basic'}
        aria-controls="basic-tab-panel"
        id="basic-tab"
        className={`${styles.tab} ${activeTab === 'basic' ? styles.active : ''}`}
        onClick={() => onTabChange('basic')}
      >
        Basic
      </button>
      <button
        role="tab"
        aria-selected={activeTab === 'advanced'}
        aria-controls="advanced-tab-panel"
        id="advanced-tab"
        className={`${styles.tab} ${activeTab === 'advanced' ? styles.active : ''}`}
        onClick={() => onTabChange('advanced')}
      >
        Advanced
      </button>
    </div>
  );
};
