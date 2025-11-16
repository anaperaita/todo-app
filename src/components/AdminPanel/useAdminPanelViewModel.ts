/**
 * ViewModel for AdminPanel component
 * Manages state and business logic for status management
 */

import { useState, useCallback, useEffect } from 'react';
import { useStatuses } from '../../context/StatusContext';
import { CreateStatusInput, UpdateStatusInput, MAX_STATUSES } from '../../types/todo.types';

export interface AdminPanelViewModel {
  // Status list
  statuses: ReturnType<typeof useStatuses>['statuses'];
  statusCount: number;
  canAddMore: boolean;

  // Selected status for editing
  selectedStatusId: string | null;
  isEditing: boolean;

  // Form state
  hasUnsavedChanges: boolean;

  // Actions
  handleSelectStatus: (id: string) => void;
  handleCreateNew: () => void;
  handleSaveStatus: (input: CreateStatusInput | UpdateStatusInput) => void;
  handleDeleteStatus: (id: string, reassignToId: string) => void;
  handleReorderStatuses: (orderedIds: string[]) => void;
  handleCancelEdit: () => void;

  // Validation
  canDelete: (id: string) => boolean;
}

export function useAdminPanelViewModel(): AdminPanelViewModel {
  const statusContext = useStatuses();
  const { statuses, addStatus, updateStatus, deleteStatus, reorderStatuses } = statusContext;

  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const statusCount = statuses.length;
  const canAddMore = statusCount < MAX_STATUSES;
  const isEditing = selectedStatusId !== null;

  // Handle status selection
  const handleSelectStatus = useCallback((id: string) => {
    if (hasUnsavedChanges) {
      // TODO: Show warning dialog in component
      const confirmed = window.confirm('You have unsaved changes. Do you want to discard them?');
      if (!confirmed) return;
    }
    setSelectedStatusId(id);
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges]);

  // Handle create new status
  const handleCreateNew = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to discard them?');
      if (!confirmed) return;
    }
    if (!canAddMore) {
      alert(`You can only have a maximum of ${MAX_STATUSES} statuses.`);
      return;
    }
    setSelectedStatusId(null);
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges, canAddMore]);

  // Handle save status (create or update)
  const handleSaveStatus = useCallback((input: CreateStatusInput | UpdateStatusInput) => {
    try {
      if (selectedStatusId) {
        // Update existing status
        updateStatus(selectedStatusId, input as UpdateStatusInput);
      } else {
        // Create new status
        addStatus(input as CreateStatusInput);
      }
      setHasUnsavedChanges(false);
      setSelectedStatusId(null);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      }
    }
  }, [selectedStatusId, addStatus, updateStatus]);

  // Handle delete status with reassignment
  const handleDeleteStatus = useCallback((id: string, reassignToId: string) => {
    try {
      deleteStatus(id);
      // TODO: Implement reassignment in useTodoStorage
      if (selectedStatusId === id) {
        setSelectedStatusId(null);
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      }
    }
  }, [deleteStatus, selectedStatusId]);

  // Handle reorder statuses
  const handleReorderStatuses = useCallback((orderedIds: string[]) => {
    reorderStatuses(orderedIds);
  }, [reorderStatuses]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to discard them?');
      if (!confirmed) return;
    }
    setSelectedStatusId(null);
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges]);

  // Check if a status can be deleted
  const canDelete = useCallback((id: string) => {
    // TODO: Check if any todos use this status
    // For now, allow deletion of any status except if it's the only one
    return statuses.length > 1;
  }, [statuses.length]);

  // Reset selection if selected status is deleted
  useEffect(() => {
    if (selectedStatusId && !statuses.find(s => s.id === selectedStatusId)) {
      setSelectedStatusId(null);
      setHasUnsavedChanges(false);
    }
  }, [selectedStatusId, statuses]);

  return {
    statuses,
    statusCount,
    canAddMore,
    selectedStatusId,
    isEditing,
    hasUnsavedChanges,
    handleSelectStatus,
    handleCreateNew,
    handleSaveStatus,
    handleDeleteStatus,
    handleReorderStatuses,
    handleCancelEdit,
    canDelete,
  };
}
