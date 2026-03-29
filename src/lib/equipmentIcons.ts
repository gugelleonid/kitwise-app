/**
 * Equipment Icons for KitWise Visual Equipment Board
 * Provides SVG icons and helper functions for equipment categories
 */

// SVG icon definitions for all equipment categories and subcategories
const EQUIPMENT_ICONS: Record<string, Record<string, string>> = {
  Camera: {
    Mirrorless: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="5" width="16" height="14" rx="1" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="16" cy="8" r="1.5" />
    </svg>`,
    Cinema: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12c0-1.1.9-2 2-2h2l3-3h6l3 3h2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-6z" />
      <circle cx="12" cy="12" r="3" />
    </svg>`,
    Compact: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="6" width="14" height="10" rx="1" />
      <circle cx="12" cy="11" r="2.5" />
      <rect x="7" y="5" width="10" height="1" />
    </svg>`,
    Action: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="7" width="12" height="10" rx="0.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M8 8l-1.5-1.5M16 8l1.5-1.5" />
    </svg>`,
    Vlog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="5" width="16" height="14" rx="1" />
      <circle cx="12" cy="10" r="3" />
      <path d="M8 17h8" />
      <path d="M14 5v3" stroke-width="1" />
    </svg>`,
    "Medium Format": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <circle cx="12" cy="12" r="4.5" />
      <rect x="6" y="6" width="3" height="2" />
    </svg>`,
  },
  Lens: {
    Prime: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4" />
    </svg>`,
    Zoom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M7 12h-4M21 12h-4" />
    </svg>`,
    Wide: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M4 12h5M15 12h5" />
      <path d="M8 8h8" stroke-width="1" />
    </svg>`,
    Telephoto: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 1v4M12 19v4" />
      <path d="M8 5l2.8 2.8M14.2 16.2l2.8 2.8" stroke-width="1.2" />
    </svg>`,
    Macro: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 7v10M7 12h10" stroke-width="1" />
    </svg>`,
    Specialty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M8 8l-2.5-2.5M16 16l2.5 2.5M8 16l-2.5 2.5M16 8l2.5-2.5" stroke-width="1" />
    </svg>`,
  },
  Flash: {
    Speedlight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="2" width="12" height="16" rx="1" />
      <path d="M10 8l4-4l-2 8l4 2h-8l2-6z" fill="currentColor" opacity="0.5" />
      <rect x="7" y="19" width="10" height="2" />
    </svg>`,
    Strobe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.5 4.5l2.1 2.1M17.4 17.4l2.1 2.1M2 12h3M19 12h3M4.5 19.5l2.1-2.1M17.4 6.6l2.1-2.1" stroke-width="1" />
    </svg>`,
  },
  Lighting: {
    "LED Panel": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="5" width="18" height="12" rx="1" />
      <line x1="6" y1="8" x2="6" y2="14" />
      <line x1="12" y1="8" x2="12" y2="14" />
      <line x1="18" y1="8" x2="18" y2="14" />
    </svg>`,
    "LED Fresnel": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2l-6 8h4v8h4v-8h4z" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="9" y1="13" x2="15" y2="13" />
    </svg>`,
    "Ring Light": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h2" stroke-width="1" />
    </svg>`,
    Tube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="8" width="20" height="8" rx="4" />
      <path d="M4 6v2M20 6v2M4 16v2M20 16v2" stroke-width="1" />
    </svg>`,
  },
  Audio: {
    Wireless: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 18h0.01" />
      <rect x="10" y="10" width="4" height="6" rx="0.5" />
      <path d="M7 14c1.66-1.33 4.34-1.33 6 0" stroke-width="1" />
      <path d="M5 12c2.66-2.67 7.34-2.67 10 0" stroke-width="1" />
    </svg>`,
    Shotgun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 10v4M8 8v8M12 6v12M16 8v8M20 10v4" />
      <rect x="3" y="14" width="18" height="3" rx="0.5" />
    </svg>`,
    Lavalier: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="6" r="2" />
      <path d="M12 8v8" />
      <path d="M9 10h6" />
      <path d="M10 14h4" />
      <path d="M11 18h2" />
    </svg>`,
    Recorder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="4" width="14" height="16" rx="1" />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
      <path d="M8 16h8" />
      <path d="M8 19h8" />
    </svg>`,
  },
  Support: {
    Tripod: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3v8" />
      <circle cx="12" cy="4" r="1.5" />
      <path d="M12 11l-6 9M12 11l6 9" />
      <path d="M7 20h10" stroke-width="1" />
    </svg>`,
    Gimbal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="6" />
      <path d="M3 12h18M12 3v18" stroke-width="1" />
      <path d="M5 5l12 12M19 5l-12 12" stroke-width="1" />
    </svg>`,
    Monopod: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="4" r="1.5" />
      <path d="M12 5v14" />
      <path d="M10 18l4 2l-4 2" />
      <path d="M14 18l-4 2l4 2" />
    </svg>`,
    Slider: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" stroke-width="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9v6M18 9v6" />
    </svg>`,
  },
  Storage: {
    CFexpress: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="7" y="5" width="10" height="14" rx="1" />
      <path d="M9 8h6M9 11h6M9 14h6" />
      <line x1="10" y1="17" x2="14" y2="17" stroke-width="1" />
    </svg>`,
    "SD Card": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="4" width="12" height="16" rx="1" />
      <path d="M9 7h1v4h-1zM12 7h1v4h-1zM15 7h1v4h-1z" />
      <line x1="8" y1="13" x2="16" y2="13" stroke-width="1" />
    </svg>`,
    SSD: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="7" width="16" height="10" rx="1" />
      <circle cx="8" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="16" cy="12" r="1" fill="currentColor" />
      <path d="M6 14h12" stroke-width="1" />
    </svg>`,
    HDD: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="8" width="18" height="9" rx="1" />
      <circle cx="7" cy="12.5" r="2" />
      <path d="M11 12.5h6" stroke-width="1" />
      <circle cx="19" cy="12.5" r="0.5" fill="currentColor" />
    </svg>`,
  },
  Drone: {
    Consumer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="2.5" />
      <path d="M5 5l2 2M19 5l-2 2M5 19l2-2M19 19l-2-2" stroke-width="1.2" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>`,
    FPV: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 4l6 3v6l-6 3l-6-3v-6z" />
      <path d="M12 10l3 1.5l-3 1.5l-3-1.5z" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>`,
  },
  Computer: {
    Laptop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 18h20v-10h-20z" />
      <path d="M2 18l3 2h12l3-2" />
      <line x1="6" y1="13" x2="18" y2="13" stroke-width="1" />
    </svg>`,
    Desktop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="13" rx="1" />
      <path d="M8 16h8M9 20h6" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </svg>`,
    Tablet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
      <rect x="6" y="5" width="12" height="12" />
    </svg>`,
    Monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="1" />
      <path d="M8 17h8M9 20h6M12 17v3" />
    </svg>`,
    Calibration: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <rect x="6" y="6" width="4" height="4" />
      <rect x="14" y="6" width="4" height="4" />
      <rect x="6" y="14" width="4" height="4" />
      <rect x="14" y="14" width="4" height="4" />
    </svg>`,
  },
  Bag: {
    Backpack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="4" width="14" height="15" rx="1" />
      <path d="M8 4l1-2h6l1 2" />
      <rect x="9" y="8" width="6" height="6" rx="0.5" />
      <path d="M7 19h10" />
    </svg>`,
    Shoulder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10l2-4h14l2 4" />
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M8 10l-2-5M16 10l2-5" stroke-width="1" />
    </svg>`,
    Rolling: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="2" width="14" height="16" rx="1" />
      <path d="M7 18v2h10v-2" />
      <circle cx="9" cy="20" r="1" fill="currentColor" />
      <circle cx="15" cy="20" r="1" fill="currentColor" />
    </svg>`,
    Insert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M6 6h12M6 11h12M6 16h12" stroke-width="1" />
      <path d="M6 8h3v2h-3zM6 13h3v2h-3zM6 18h3v2h-3z" />
    </svg>`,
  },
  Accessory: {
    Filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 7v10M7 12h10" stroke-width="1" />
    </svg>`,
    Battery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="6" width="12" height="12" rx="1" />
      <rect x="17" y="9" width="2" height="6" rx="0.5" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="11" y1="10" x2="11" y2="14" />
      <line x1="14" y1="10" x2="14" y2="14" />
    </svg>`,
    Remote: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
      <path d="M10 13h4M10 17h4" />
    </svg>`,
    Strap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 8l2-4h12l2 4" />
      <path d="M4 8v10h16v-10" />
      <path d="M8 8l-1 10M16 8l1 10" stroke-width="1" />
    </svg>`,
  },
};

// Emoji fallbacks for equipment categories and subcategories
const EQUIPMENT_EMOJIS: Record<string, Record<string, string>> = {
  Camera: {
    Mirrorless: "📷",
    Cinema: "🎥",
    Compact: "📷",
    Action: "📹",
    Vlog: "📱",
    "Medium Format": "📷",
  },
  Lens: {
    Prime: "🔍",
    Zoom: "🔭",
    Wide: "📐",
    Telephoto: "🔭",
    Macro: "🔬",
    Specialty: "✨",
  },
  Flash: {
    Speedlight: "⚡",
    Strobe: "💡",
  },
  Lighting: {
    "LED Panel": "💡",
    "LED Fresnel": "🔦",
    "Ring Light": "💡",
    Tube: "💡",
  },
  Audio: {
    Wireless: "🎤",
    Shotgun: "🎙️",
    Lavalier: "🎤",
    Recorder: "🎙️",
  },
  Support: {
    Tripod: "🎯",
    Gimbal: "🎬",
    Monopod: "🎯",
    Slider: "📹",
  },
  Storage: {
    CFexpress: "💾",
    "SD Card": "💾",
    SSD: "💾",
    HDD: "💾",
  },
  Drone: {
    Consumer: "🚁",
    FPV: "🚁",
  },
  Computer: {
    Laptop: "💻",
    Desktop: "🖥️",
    Tablet: "📱",
    Monitor: "🖥️",
    Calibration: "🎨",
  },
  Bag: {
    Backpack: "🎒",
    Shoulder: "👜",
    Rolling: "🧳",
    Insert: "📦",
  },
  Accessory: {
    Filter: "🔍",
    Battery: "🔋",
    Remote: "🎮",
    Strap: "🎀",
  },
};

// Category colors for visual identification
const CATEGORY_COLORS: Record<string, string> = {
  Camera: "#3b82f6",
  Lens: "#8b5cf6",
  Flash: "#f59e0b",
  Lighting: "#eab308",
  Audio: "#ef4444",
  Support: "#6b7280",
  Storage: "#10b981",
  Drone: "#06b6d4",
  Computer: "#a855f7",
  Bag: "#78716c",
  Accessory: "#64748b",
};

/**
 * Get SVG string for equipment icon
 * @param category - Equipment category (e.g., "Camera", "Lens")
 * @param subcategory - Equipment subcategory (e.g., "Mirrorless", "Prime")
 * @returns Inline SVG string or empty string if not found
 */
export function getEquipmentSVG(category: string, subcategory: string): string {
  return EQUIPMENT_ICONS[category]?.[subcategory] || "";
}

/**
 * Get emoji fallback for equipment
 * @param category - Equipment category
 * @param subcategory - Equipment subcategory
 * @returns Emoji string or generic fallback
 */
export function getEquipmentIcon(category: string, subcategory: string): string {
  return EQUIPMENT_EMOJIS[category]?.[subcategory] || "📦";
}

/**
 * Get color for equipment category
 * @param category - Equipment category
 * @returns Hex color string
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || "#6b7280";
}

/**
 * Get all available categories
 * @returns Array of category names
 */
export function getCategories(): string[] {
  return Object.keys(EQUIPMENT_ICONS);
}

/**
 * Get all subcategories for a category
 * @param category - Equipment category
 * @returns Array of subcategory names
 */
export function getSubcategories(category: string): string[] {
  return Object.keys(EQUIPMENT_ICONS[category] || {});
}
