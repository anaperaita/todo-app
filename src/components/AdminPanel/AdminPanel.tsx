/**
 * AdminPanel component for managing custom statuses
 * Allows users to add, edit, delete, and reorder statuses
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAdminPanelViewModel } from './useAdminPanelViewModel';
import { StatusForm } from './StatusForm';
import { Status } from '../../types/todo.types';
import styles from './AdminPanel.module.css';

// Sortable status item component
interface SortableStatusItemProps {
  status: Status;
  isSelected: boolean;
  onSelect: () => void;
}

function SortableStatusItem({ status, isSelected, onSelect }: SortableStatusItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: status.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.statusItem} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      onClick={onSelect}
      {...attributes}
      {...listeners}
    >
      <div className={styles.statusInfo}>
        <div className={styles.dragHandle} aria-label="Drag to reorder">
          ⋮⋮
        </div>
        <div
          className={styles.colorIndicator}
          style={{ backgroundColor: `var(--color-${status.color})` }}
        />
        <div>
          <div className={styles.statusLabel}>{status.label}</div>
          <div className={styles.statusDescription}>{status.description}</div>
        </div>
      </div>
    </div>
  );
}

export function AdminPanel(): JSX.Element {
  const navigate = useNavigate();
  const viewModel = useAdminPanelViewModel();

  // Set up drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = viewModel.statuses.findIndex((s) => s.id === active.id);
      const newIndex = viewModel.statuses.findIndex((s) => s.id === over.id);

      const newOrder = arrayMove(viewModel.statuses, oldIndex, newIndex);
      viewModel.handleReorderStatuses(newOrder.map((s) => s.id));
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button
            onClick={() => navigate('/')}
            className={styles.backButton}
            aria-label="Back to app"
          >
            ← Back to App
          </button>
        </div>
        <h1>Status Management</h1>
        <p className={styles.description}>
          Manage your custom statuses. Each status will appear as a column in the Kanban board and as a filter option in the list view.
        </p>
      </header>

      <div className={styles.content}>
        <div className={styles.statusListSection}>
          <div className={styles.sectionHeader}>
            <h2>Status List ({viewModel.statusCount}/7)</h2>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={viewModel.statuses.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className={styles.statusList}>
                {viewModel.statuses.map((status) => (
                  <SortableStatusItem
                    key={status.id}
                    status={status}
                    isSelected={viewModel.selectedStatusId === status.id}
                    onSelect={() => viewModel.handleSelectStatus(status.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className={styles.formSection}>
          <h2>{viewModel.isEditing ? 'Edit Status' : 'Add Status'}</h2>
          <StatusForm
            statusId={viewModel.selectedStatusId}
            onSave={viewModel.handleSaveStatus}
            onCancel={viewModel.handleCancelEdit}
            onDelete={viewModel.selectedStatusId ? (id) => viewModel.handleDeleteStatus(id, '') : undefined}
            canDelete={viewModel.selectedStatusId ? viewModel.canDelete(viewModel.selectedStatusId) : false}
          />
        </div>
      </div>
    </div>
  );
}
