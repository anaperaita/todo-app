/**
 * AdminPanel component for managing custom statuses
 * Allows users to add, edit, delete, and reorder statuses
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminPanelViewModel } from './useAdminPanelViewModel';
import { StatusForm } from './StatusForm';
import styles from './AdminPanel.module.css';

export function AdminPanel(): JSX.Element {
  const navigate = useNavigate();
  const viewModel = useAdminPanelViewModel();

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
            <button
              onClick={viewModel.handleCreateNew}
              disabled={!viewModel.canAddMore}
              className={styles.addButton}
            >
              + Add Status
            </button>
          </div>
          <div className={styles.statusList}>
            {viewModel.statuses.map((status) => (
              <div
                key={status.id}
                className={`${styles.statusItem} ${viewModel.selectedStatusId === status.id ? styles.selected : ''}`}
                onClick={() => viewModel.handleSelectStatus(status.id)}
              >
                <div className={styles.statusInfo}>
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
            ))}
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>{viewModel.isEditing ? 'Edit Status' : 'Add Status'}</h2>
          <StatusForm
            statusId={viewModel.selectedStatusId}
            onSave={viewModel.handleSaveStatus}
            onCancel={viewModel.handleCancelEdit}
          />
        </div>
      </div>
    </div>
  );
}
