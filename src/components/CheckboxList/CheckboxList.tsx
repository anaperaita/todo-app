import React from 'react';
import styles from './CheckboxList.module.css';

export interface CheckboxOption {
  id: string;
  label: string;
  color?: string; // Optional color for status items
}

export interface CheckboxListProps {
  options: CheckboxOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  ariaLabel: string;
  emptyMessage?: string;
}

export const CheckboxList: React.FC<CheckboxListProps> = ({
  options,
  selectedIds,
  onChange,
  ariaLabel,
  emptyMessage = 'No options available',
}) => {
  const handleToggle = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    onChange(newSelection);
  };

  if (options.length === 0) {
    return <p className={styles.emptyMessage}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.checkboxList} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const isChecked = selectedIds.includes(option.id);
        return (
          <label key={option.id} className={styles.checkboxItem}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleToggle(option.id)}
              className={styles.checkbox}
              aria-label={option.label}
            />
            {option.color && (
              <span
                className={styles.colorIndicator}
                style={{ backgroundColor: option.color }}
                aria-hidden="true"
              />
            )}
            <span className={styles.label}>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};
