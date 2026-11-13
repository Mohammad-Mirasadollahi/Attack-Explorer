export type ShortcutCategoryId =
  | 'ALL'
  | 'TOOLS_SELECTION'
  | 'CANVAS_NAVIGATION'
  | 'SIMULATION_VIEWS';

export type ShortcutCommandId =
  | 'TOOL_BOX_SELECT'
  | 'TOOL_PAN_PAGE'
  | 'HOLD_RIGHT_BOX_SELECT'
  | 'HOLD_LEFT_PAN_PAGE'
  | 'SELECT_ALL_NODES'
  | 'MULTI_SELECT_TOGGLE'
  | 'ESCAPE'
  | 'ZOOM_IN'
  | 'ZOOM_OUT'
  | 'RESET_CANVAS'
  | 'AUTO_LAYOUT_NODES'
  | 'WHEEL_ZOOM'
  | 'PAN_DIRECTIONAL'
  | 'PAN_UP'
  | 'PAN_DOWN'
  | 'PAN_LEFT'
  | 'PAN_RIGHT'
  | 'TOGGLE_AUTOCAM'
  | 'TOGGLE_TACTICAL'
  | 'TOGGLE_LEGEND'
  | 'PLAY_PAUSE_SEQUENCE'
  | 'STEP_BACKWARD'
  | 'STEP_FORWARD'
  | 'VIEW_TOPOLOGY'
  | 'VIEW_SEQUENCE'
  | 'VIEW_PROCESS_MEMORY'
  | 'VIEW_RAW_TABLES'
  | 'SWITCH_VIEW_1_4'
  | 'TOGGLE_SHORTCUTS_HELP';

export interface KeyboardShortcutItem {
  id: ShortcutCommandId;
  category: Exclude<ShortcutCategoryId, 'ALL'>;
  title: string;
  description: string;
  keys: string[];
  secondaryKeys?: string[];
  badge: string;
  canTriggerFromOverlay: boolean;
}

export interface ShortcutCategoryMeta {
  id: ShortcutCategoryId;
  label: string;
  shortLabel: string;
  description: string;
}

export const SHORTCUT_CATEGORIES: ShortcutCategoryMeta[] = [
  {
    id: 'ALL',
    label: 'All Shortcuts',
    shortLabel: 'All',
    description: 'Complete reference of tool hotkeys, mouse-hold gestures, and canvas navigation',
  },
  {
    id: 'TOOLS_SELECTION',
    label: 'Tools & Selection',
    shortLabel: 'Tools',
    description: 'Switch between Box Select (B), Pan / Pen Page (P), and multi-node group selection',
  },
  {
    id: 'CANVAS_NAVIGATION',
    label: 'Canvas & Camera',
    shortLabel: 'Navigation',
    description: 'Zoom in/out, directional viewport panning, AutoCam tracking, and layout reset',
  },
  {
    id: 'SIMULATION_VIEWS',
    label: 'Simulation & Views',
    shortLabel: 'Simulation',
    description: 'Attack sequence playback, stage stepping, and workbench view mode switching',
  },
];

export const KEYBOARD_SHORTCUT_ITEMS: KeyboardShortcutItem[] = [
  // 1. TOOLS & SELECTION
  {
    id: 'TOOL_BOX_SELECT',
    category: 'TOOLS_SELECTION',
    title: 'Box Select Tool',
    description:
      'Switch pointer mode to rubber-band Box Select for grouping and moving multiple nodes together',
    keys: ['B'],
    badge: 'TOOL · SELECT',
    canTriggerFromOverlay: true,
  },
  {
    id: 'TOOL_PAN_PAGE',
    category: 'TOOLS_SELECTION',
    title: 'Pan Page / Pen Tool',
    description:
      'Switch pointer mode to Pan Page (Pen / Hand) for smooth 60/120fps schematic board navigation',
    keys: ['P'],
    secondaryKeys: ['H'],
    badge: 'TOOL · PAN',
    canTriggerFromOverlay: true,
  },
  {
    id: 'HOLD_RIGHT_BOX_SELECT',
    category: 'TOOLS_SELECTION',
    title: 'Momentary Box Select (Right-Click Hold)',
    description:
      'Hold Right-Click and drag on empty canvas space to immediately draw a marquee selection box',
    keys: ['Right-Click', 'Hold + Drag'],
    badge: 'MOUSE HOLD',
    canTriggerFromOverlay: false,
  },
  {
    id: 'HOLD_LEFT_PAN_PAGE',
    category: 'TOOLS_SELECTION',
    title: 'Momentary Pan Page (Left-Click Hold)',
    description:
      'Hold Left-Click and drag on empty canvas space to smoothly pan across the network topology',
    keys: ['Left-Click', 'Hold + Drag'],
    badge: 'MOUSE HOLD',
    canTriggerFromOverlay: false,
  },
  {
    id: 'SELECT_ALL_NODES',
    category: 'TOOLS_SELECTION',
    title: 'Select / Deselect All Nodes',
    description:
      'Select all hosts, processes, and appliances on the current diagram to reposition as one group',
    keys: ['Ctrl', 'A'],
    secondaryKeys: ['⌘', 'A'],
    badge: 'GROUP',
    canTriggerFromOverlay: true,
  },
  {
    id: 'MULTI_SELECT_TOGGLE',
    category: 'TOOLS_SELECTION',
    title: 'Add / Remove Node from Selection',
    description:
      'Hold Shift and click any network node (or its selection checkbox) to toggle group membership',
    keys: ['Shift', 'Click'],
    badge: 'MULTI-NODE',
    canTriggerFromOverlay: false,
  },
  {
    id: 'ESCAPE',
    category: 'TOOLS_SELECTION',
    title: 'Clear Selection / Close Overlay',
    description:
      'Deselect all multi-selected nodes, cancel active marquee selection, or dismiss open modals',
    keys: ['Esc'],
    badge: 'RESET',
    canTriggerFromOverlay: true,
  },

  // 2. CANVAS & CAMERA NAVIGATION
  {
    id: 'ZOOM_IN',
    category: 'CANVAS_NAVIGATION',
    title: 'Zoom In Canvas',
    description:
      'Increase diagram magnification smoothly by +15% up to 250% maximum detail scale',
    keys: ['+'],
    secondaryKeys: ['='],
    badge: 'ZOOM +15%',
    canTriggerFromOverlay: true,
  },
  {
    id: 'ZOOM_OUT',
    category: 'CANVAS_NAVIGATION',
    title: 'Zoom Out Canvas',
    description:
      'Decrease diagram magnification smoothly by -15% down to 45% wide-angle topology scale',
    keys: ['-'],
    badge: 'ZOOM -15%',
    canTriggerFromOverlay: true,
  },
  {
    id: 'RESET_CANVAS',
    category: 'CANVAS_NAVIGATION',
    title: 'Reset Canvas Zoom, Pan & Layout',
    description:
      'Restore 100% zoom scale, recenter pan offset (0px, 0px), and reset moved node/zone positions',
    keys: ['0'],
    secondaryKeys: ['R'],
    badge: '100% DEFAULT',
    canTriggerFromOverlay: true,
  },
  {
    id: 'AUTO_LAYOUT_NODES',
    category: 'CANVAS_NAVIGATION',
    title: 'Force-Directed Auto-Layout',
    description:
      'Automatically organize attack graph nodes using Coulomb repulsion and Hooke spring forces for maximum readability',
    keys: ['A'],
    badge: 'FORCE LAYOUT',
    canTriggerFromOverlay: true,
  },
  {
    id: 'WHEEL_ZOOM',
    category: 'CANVAS_NAVIGATION',
    title: 'Gradual Cursor-Centered Zoom',
    description:
      'Scroll mouse wheel up or down to zoom smoothly (~5% per step) anchored toward your cursor',
    keys: ['Mouse Wheel'],
    badge: 'SMOOTH 5%',
    canTriggerFromOverlay: false,
  },
  {
    id: 'PAN_DIRECTIONAL',
    category: 'CANVAS_NAVIGATION',
    title: 'Directional Canvas Nudge (Pan)',
    description:
      'Use arrow keys to pan the schematic board in 48px increments in any direction',
    keys: ['↑', '↓', '←', '→'],
    badge: 'PAN 48PX',
    canTriggerFromOverlay: false,
  },
  {
    id: 'TOGGLE_AUTOCAM',
    category: 'CANVAS_NAVIGATION',
    title: 'Toggle AutoCam Stage Tracking',
    description:
      'Enable or disable automatic cinematic camera framing as attack stages progress',
    keys: ['C'],
    badge: 'CAMERA',
    canTriggerFromOverlay: true,
  },
  {
    id: 'TOGGLE_TACTICAL',
    category: 'CANVAS_NAVIGATION',
    title: 'Toggle Tactical Grid Overlay',
    description:
      'Switch between warm Excalidraw schematic board and high-contrast cyber tactical grid mode',
    keys: ['T'],
    badge: 'TACTICAL',
    canTriggerFromOverlay: true,
  },
  {
    id: 'TOGGLE_LEGEND',
    category: 'CANVAS_NAVIGATION',
    title: 'Toggle Operational Visual Legend',
    description:
      'Show or hide the bottom-left visual semantics & color-coded flow legend panel',
    keys: ['L'],
    badge: 'LEGEND',
    canTriggerFromOverlay: true,
  },
  // 3. SIMULATION & WORKBENCH VIEWS
  {
    id: 'PLAY_PAUSE_SEQUENCE',
    category: 'SIMULATION_VIEWS',
    title: 'Play / Pause Attack Walkthrough',
    description:
      'Start, pause, or resume the step-by-step animated attack kill-chain sequence',
    keys: ['Space'],
    badge: 'PLAYBACK',
    canTriggerFromOverlay: true,
  },
  {
    id: 'STEP_BACKWARD',
    category: 'SIMULATION_VIEWS',
    title: 'Previous Attack Stage',
    description:
      'Step backward one stage in the current scenario kill-chain timeline',
    keys: ['['],
    badge: 'STAGE -1',
    canTriggerFromOverlay: true,
  },
  {
    id: 'STEP_FORWARD',
    category: 'SIMULATION_VIEWS',
    title: 'Next Attack Stage',
    description:
      'Advance forward one stage in the current scenario kill-chain timeline',
    keys: [']'],
    badge: 'STAGE +1',
    canTriggerFromOverlay: true,
  },
  {
    id: 'SWITCH_VIEW_1_4',
    category: 'SIMULATION_VIEWS',
    title: 'Switch Primary Workbench View (1–4)',
    description:
      'Press 1 for Diagram, 2 for Sequence, 3 for Process Memory, or 4 for Tables & Packets',
    keys: ['1', '2', '3', '4'],
    badge: 'VIEWS',
    canTriggerFromOverlay: false,
  },
  {
    id: 'TOGGLE_SHORTCUTS_HELP',
    category: 'SIMULATION_VIEWS',
    title: 'Keyboard Shortcuts & Hotkeys Overlay',
    description:
      'Open or close this interactive keyboard shortcut and pointer gesture reference sheet',
    keys: ['?'],
    secondaryKeys: ['/'],
    badge: 'HELP HUD',
    canTriggerFromOverlay: true,
  },
];

export interface KeyboardEventLike {
  key: string;
  code?: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  targetTagName?: string | null;
  isContentEditable?: boolean;
}

/**
 * Returns true if the active DOM target is an interactive text input where single-key hotkeys should not fire.
 */
export function isEditableKeyboardTarget(
  targetTagName?: string | null,
  isContentEditable?: boolean
): boolean {
  if (isContentEditable) return true;
  if (!targetTagName) return false;
  const upper = targetTagName.toUpperCase();
  return upper === 'INPUT' || upper === 'TEXTAREA' || upper === 'SELECT';
}

/**
 * Filters keyboard shortcut definitions by category and search query.
 */
export function filterKeyboardShortcuts(
  query: string,
  category: ShortcutCategoryId = 'ALL',
  items: KeyboardShortcutItem[] = KEYBOARD_SHORTCUT_ITEMS
): KeyboardShortcutItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    if (category !== 'ALL' && item.category !== category) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    const haystack = [
      item.title,
      item.description,
      item.badge,
      ...item.keys,
      ...(item.secondaryKeys || []),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

/**
 * Resolves a keyboard event into a deterministic workbench/canvas command ID, or null if unhandled.
 */
export function resolveKeyboardShortcutCommand(
  event: KeyboardEventLike
): ShortcutCommandId | null {
  if (event.key === 'Escape') {
    return 'ESCAPE';
  }

  if (isEditableKeyboardTarget(event.targetTagName, event.isContentEditable)) {
    return null;
  }

  // Ctrl+A / Cmd+A -> Select All Nodes
  if ((event.ctrlKey || event.metaKey) && !event.altKey) {
    if (event.key.toLowerCase() === 'a') {
      return 'SELECT_ALL_NODES';
    }
    return null;
  }

  if (event.altKey) {
    return null;
  }

  const key = event.key;
  const lower = key.toLowerCase();

  // Help Overlay (? or /)
  if (key === '?' || key === '/') {
    return 'TOGGLE_SHORTCUTS_HELP';
  }

  // Tool Switching: B = Box Select, P or H = Pan Page / Pen
  if (lower === 'b') {
    return 'TOOL_BOX_SELECT';
  }
  if (lower === 'p' || lower === 'h') {
    return 'TOOL_PAN_PAGE';
  }

  // Zoom & Reset: + / =, - / _, 0 / R
  if (key === '+' || key === '=') {
    return 'ZOOM_IN';
  }
  if (key === '-' || key === '_') {
    return 'ZOOM_OUT';
  }
  if (key === '0' || lower === 'r') {
    return 'RESET_CANVAS';
  }

  // Directional Canvas Panning
  if (key === 'ArrowUp') return 'PAN_UP';
  if (key === 'ArrowDown') return 'PAN_DOWN';
  if (key === 'ArrowLeft') return 'PAN_LEFT';
  if (key === 'ArrowRight') return 'PAN_RIGHT';

  // Camera, Tactical, Legend & Force-Directed Auto-Layout Toggles
  if (lower === 'a') return 'AUTO_LAYOUT_NODES';
  if (lower === 'c') return 'TOGGLE_AUTOCAM';
  if (lower === 't') return 'TOGGLE_TACTICAL';
  if (lower === 'l') return 'TOGGLE_LEGEND';

  // Simulation Stage Stepping & Playback
  if (key === '[') return 'STEP_BACKWARD';
  if (key === ']') return 'STEP_FORWARD';
  if (key === ' ' || event.code === 'Space') return 'PLAY_PAUSE_SEQUENCE';

  // Primary View Mode Switching (1-4)
  if (key === '1') return 'VIEW_TOPOLOGY';
  if (key === '2') return 'VIEW_SEQUENCE';
  if (key === '3') return 'VIEW_PROCESS_MEMORY';
  if (key === '4') return 'VIEW_RAW_TABLES';

  return null;
}

export const KEYBOARD_PAN_STEP_PX = 48;
