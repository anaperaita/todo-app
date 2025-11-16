/**
 * Color palette configuration for status customization
 * Provides 12 status-oriented semantic colors for workflow states
 */

export interface ColorConfig {
  id: string;
  name: string;           // Semantic name (e.g., "Success Green")
  cssClass: string;       // CSS class for styling
  hexValue: string;       // Hex color code
  textColor: string;      // Text color for contrast (white or black)
}

/**
 * Status-oriented color palette with semantic names
 * 12 colors covering common workflow states
 */
export const STATUS_COLOR_PALETTE: ColorConfig[] = [
  {
    id: 'success-green',
    name: 'Success Green',
    cssClass: 'status-color-success-green',
    hexValue: '#10b981',
    textColor: '#ffffff',
  },
  {
    id: 'in-progress-blue',
    name: 'In Progress Blue',
    cssClass: 'status-color-in-progress-blue',
    hexValue: '#3b82f6',
    textColor: '#ffffff',
  },
  {
    id: 'blocked-red',
    name: 'Blocked Red',
    cssClass: 'status-color-blocked-red',
    hexValue: '#ef4444',
    textColor: '#ffffff',
  },
  {
    id: 'warning-yellow',
    name: 'Warning Yellow',
    cssClass: 'status-color-warning-yellow',
    hexValue: '#f59e0b',
    textColor: '#000000',
  },
  {
    id: 'review-orange',
    name: 'Review Orange',
    cssClass: 'status-color-review-orange',
    hexValue: '#f97316',
    textColor: '#ffffff',
  },
  {
    id: 'waiting-purple',
    name: 'Waiting Purple',
    cssClass: 'status-color-waiting-purple',
    hexValue: '#a855f7',
    textColor: '#ffffff',
  },
  {
    id: 'pending-indigo',
    name: 'Pending Indigo',
    cssClass: 'status-color-pending-indigo',
    hexValue: '#6366f1',
    textColor: '#ffffff',
  },
  {
    id: 'testing-teal',
    name: 'Testing Teal',
    cssClass: 'status-color-testing-teal',
    hexValue: '#14b8a6',
    textColor: '#ffffff',
  },
  {
    id: 'approved-emerald',
    name: 'Approved Emerald',
    cssClass: 'status-color-approved-emerald',
    hexValue: '#059669',
    textColor: '#ffffff',
  },
  {
    id: 'neutral-gray',
    name: 'Neutral Gray',
    cssClass: 'status-color-neutral-gray',
    hexValue: '#6b7280',
    textColor: '#ffffff',
  },
  {
    id: 'urgent-pink',
    name: 'Urgent Pink',
    cssClass: 'status-color-urgent-pink',
    hexValue: '#ec4899',
    textColor: '#ffffff',
  },
  {
    id: 'archived-slate',
    name: 'Archived Slate',
    cssClass: 'status-color-archived-slate',
    hexValue: '#475569',
    textColor: '#ffffff',
  },
];

/**
 * Get color configuration by ID
 * @param colorId - The unique color identifier
 * @returns ColorConfig or undefined if not found
 */
export function getColorById(colorId: string): ColorConfig | undefined {
  return STATUS_COLOR_PALETTE.find((color) => color.id === colorId);
}

/**
 * Get default color (In Progress Blue)
 * @returns Default ColorConfig
 */
export function getDefaultColor(): ColorConfig {
  return STATUS_COLOR_PALETTE[1]; // In Progress Blue
}
