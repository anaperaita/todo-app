import React, { useEffect } from 'react';
import styles from './SlideInPanel.module.css';

export interface SlideInPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Slide-in panel component that appears from the right side of the screen.
 */
export const SlideInPanel: React.FC<SlideInPanelProps> = ({ isOpen, onClose, title, children }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
      >
        <div className={styles.header}>
          <h2 id="panel-title" className={styles.title}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </>
  );
};
