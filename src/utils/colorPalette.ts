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
 * Status color palette with warm, earthy tones
 * 12 distinct colors from the warm palette for maximum visual differentiation
 */
export const STATUS_COLOR_PALETTE: ColorConfig[] = [
  {
    id: 'color-1',
    name: 'Terracotta',
    cssClass: 'status-color-1',
    hexValue: '#d4764f',
    textColor: '#ffffff',
  },
  {
    id: 'color-2',
    name: 'Sage',
    cssClass: 'status-color-2',
    hexValue: '#8a9a7b',
    textColor: '#ffffff',
  },
  {
    id: 'color-3',
    name: 'Golden Sand',
    cssClass: 'status-color-3',
    hexValue: '#e8c68f',
    textColor: '#2d2520',
  },
  {
    id: 'color-4',
    name: 'Deep Earth',
    cssClass: 'status-color-4',
    hexValue: '#4a3f35',
    textColor: '#ffffff',
  },
  {
    id: 'color-5',
    name: 'Rust',
    cssClass: 'status-color-5',
    hexValue: '#b85d38',
    textColor: '#ffffff',
  },
  {
    id: 'color-6',
    name: 'Olive',
    cssClass: 'status-color-6',
    hexValue: '#6b7a5d',
    textColor: '#ffffff',
  },
  {
    id: 'color-7',
    name: 'Warm Amber',
    cssClass: 'status-color-7',
    hexValue: '#d89b5a',
    textColor: '#2d2520',
  },
  {
    id: 'color-8',
    name: 'Forest Moss',
    cssClass: 'status-color-8',
    hexValue: '#4d5c3e',
    textColor: '#ffffff',
  },
  {
    id: 'color-9',
    name: 'Clay',
    cssClass: 'status-color-9',
    hexValue: '#a67c52',
    textColor: '#ffffff',
  },
  {
    id: 'color-10',
    name: 'Stone',
    cssClass: 'status-color-10',
    hexValue: '#7a7165',
    textColor: '#ffffff',
  },
  {
    id: 'color-11',
    name: 'Soft Cream',
    cssClass: 'status-color-11',
    hexValue: '#c9b896',
    textColor: '#2d2520',
  },
  {
    id: 'color-12',
    name: 'Warm Brown',
    cssClass: 'status-color-12',
    hexValue: '#6b5444',
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
 * Get default color (Terracotta)
 * @returns Default ColorConfig
 */
export function getDefaultColor(): ColorConfig {
  return STATUS_COLOR_PALETTE[0]; // Terracotta
}
