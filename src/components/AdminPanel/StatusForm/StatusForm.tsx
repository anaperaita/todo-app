/**
 * StatusForm component for adding/editing statuses
 * Includes validation and color selection
 */

import React, { useState, useEffect } from 'react';
import { CreateStatusInput, UpdateStatusInput, MIN_STATUS_LABEL_LENGTH, MAX_STATUS_LABEL_LENGTH } from '../../../types/todo.types';
import { STATUS_COLOR_PALETTE } from '../../../utils/colorPalette';
import { useStatuses } from '../../../context/StatusContext';
import styles from './StatusForm.module.css';

export interface StatusFormProps {
  statusId: string | null; // null for create, id for edit
  onSave: (input: CreateStatusInput | UpdateStatusInput) => void;
  onCancel: () => void;
}

export function StatusForm({ statusId, onSave, onCancel }: StatusFormProps): JSX.Element {
  const { statuses, getStatusById } = useStatuses();
  const existingStatus = statusId ? getStatusById(statusId) : null;
  const isEditing = statusId !== null;

  // Form state
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [colorId, setColorId] = useState(STATUS_COLOR_PALETTE[0].id);

  // Validation errors
  const [errors, setErrors] = useState<{
    label?: string;
    description?: string;
  }>({});

  // Initialize form with existing status data when editing
  useEffect(() => {
    if (existingStatus) {
      setLabel(existingStatus.label);
      setDescription(existingStatus.description);
      setColorId(existingStatus.color);
    } else {
      // Reset form for new status
      setLabel('');
      setDescription('');
      setColorId(STATUS_COLOR_PALETTE[0].id);
    }
    setErrors({});
  }, [existingStatus, statusId]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate label
    if (!label.trim()) {
      newErrors.label = 'Label is required';
    } else if (label.length < MIN_STATUS_LABEL_LENGTH) {
      newErrors.label = `Label must be at least ${MIN_STATUS_LABEL_LENGTH} characters`;
    } else if (label.length > MAX_STATUS_LABEL_LENGTH) {
      newErrors.label = `Label must be at most ${MAX_STATUS_LABEL_LENGTH} characters`;
    } else if (!/^[\x20-\x7E]+$/.test(label)) {
      newErrors.label = 'Label must contain only printable characters';
    } else {
      // Check for duplicate label (case-insensitive, excluding current status when editing)
      const duplicate = statuses.find(
        s => s.label.toLowerCase() === label.trim().toLowerCase() && s.id !== statusId
      );
      if (duplicate) {
        newErrors.label = 'A status with this label already exists';
      }
    }

    // Validate description (optional but has constraints if provided)
    if (description && description.length > 100) {
      newErrors.description = 'Description must be at most 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const colorConfig = STATUS_COLOR_PALETTE.find(c => c.id === colorId);
    if (!colorConfig) return;

    const input = {
      label: label.trim(),
      description: description.trim(),
      color: colorId,
      colorName: colorConfig.name,
      position: existingStatus?.position ?? statuses.length + 1,
    };

    onSave(input);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Label input */}
      <div className={styles.formGroup}>
        <label htmlFor="status-label" className={styles.label}>
          Label <span className={styles.required}>*</span>
        </label>
        <input
          id="status-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className={`${styles.input} ${errors.label ? styles.inputError : ''}`}
          placeholder="e.g., In Progress, Done, Blocked"
          maxLength={MAX_STATUS_LABEL_LENGTH}
        />
        {errors.label && <div className={styles.error}>{errors.label}</div>}
        <div className={styles.hint}>
          {label.length}/{MAX_STATUS_LABEL_LENGTH} characters
        </div>
      </div>

      {/* Description input */}
      <div className={styles.formGroup}>
        <label htmlFor="status-description" className={styles.label}>
          Description
        </label>
        <textarea
          id="status-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
          placeholder="Brief description of this status"
          rows={3}
          maxLength={100}
        />
        {errors.description && <div className={styles.error}>{errors.description}</div>}
        <div className={styles.hint}>
          {description.length}/100 characters
        </div>
      </div>

      {/* Color selection */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Color <span className={styles.required}>*</span>
        </label>
        <div className={styles.colorGrid}>
          {STATUS_COLOR_PALETTE.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`${styles.colorOption} ${colorId === color.id ? styles.colorSelected : ''}`}
              onClick={() => setColorId(color.id)}
              style={{ backgroundColor: color.hexValue }}
              aria-label={color.name}
              title={color.name}
            />
          ))}
        </div>
        <div className={styles.selectedColorName}>
          {STATUS_COLOR_PALETTE.find(c => c.id === colorId)?.name}
        </div>
      </div>

      {/* Action buttons */}
      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={styles.saveButton}>
          {isEditing ? 'Save Changes' : 'Add Status'}
        </button>
      </div>
    </form>
  );
}
