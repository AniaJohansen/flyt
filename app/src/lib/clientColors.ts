import type { Project, ProjectType } from '@/types';

/**
 * Deterministic hue for a client name using a simple hash.
 * Distributes hues evenly across the color wheel.
 */
function hashToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Ensure positive, map to 0-360
  return ((hash % 360) + 360) % 360;
}

/**
 * Base hues chosen for good visual separation.
 * Used when we have few clients so they get maximally distinct colors.
 */
const PRESET_HUES = [
  215, // blue
  25,  // orange
  265, // purple
  155, // green
  350, // red/rose
  45,  // amber
  185, // teal
  310, // magenta
  90,  // lime
  195, // cyan
];

/**
 * Returns shade variants based on project type.
 * Each type gets a distinct tone of the client's base hue.
 */
function typeToShade(type: ProjectType | null): { s: number; l: number } {
  switch (type) {
    case 'Fastpris':
      return { s: 72, l: 48 };  // vivid, punchy
    case 'T&M':
      return { s: 55, l: 60 };  // softer, lighter
    case 'Lisens':
      return { s: 80, l: 36 };  // deep, rich
    default:
      return { s: 65, l: 52 };  // balanced default
  }
}

export interface ClientColorMap {
  /** Get the computed color for a specific project */
  getColor: (projectId: string) => string;
  /** Get the base hue for a client name */
  getClientHue: (clientName: string) => number;
  /** Get the HSL color string for a client + type combo */
  getClientTypeColor: (clientName: string | null, projectType: ProjectType | null) => string;
}

/**
 * Builds a color mapping for all projects based on their clientName.
 * Same client → same hue family. Project type → different shade.
 */
export function buildClientColorMap(projects: Project[]): ClientColorMap {
  // Collect unique client names (excluding null/empty)
  const clientNames = [...new Set(
    projects
      .map((p) => p.clientName)
      .filter((name): name is string => !!name)
  )].sort((a, b) => a.localeCompare(b, 'nb'));

  // Assign hues: use presets for first N clients, hash for extras
  const clientHueMap = new Map<string, number>();
  clientNames.forEach((name, i) => {
    if (i < PRESET_HUES.length) {
      clientHueMap.set(name, PRESET_HUES[i]);
    } else {
      clientHueMap.set(name, hashToHue(name));
    }
  });

  // Build project → color map
  const projectColorMap = new Map<string, string>();
  for (const project of projects) {
    const hue = project.clientName
      ? (clientHueMap.get(project.clientName) ?? hashToHue(project.clientName))
      : 0; // grey for no client
    const { s, l } = typeToShade(project.projectType);

    const color = project.clientName
      ? `hsl(${hue}, ${s}%, ${l}%)`
      : `hsl(0, 0%, ${l}%)`; // achromatic for orphan projects

    projectColorMap.set(project.id, color);
  }

  return {
    getColor(projectId: string): string {
      return projectColorMap.get(projectId) ?? 'hsl(0, 0%, 50%)';
    },
    getClientHue(clientName: string): number {
      return clientHueMap.get(clientName) ?? hashToHue(clientName);
    },
    getClientTypeColor(clientName: string | null, projectType: ProjectType | null): string {
      if (!clientName) {
        const { l } = typeToShade(projectType);
        return `hsl(0, 0%, ${l}%)`;
      }
      const hue = clientHueMap.get(clientName) ?? hashToHue(clientName);
      const { s, l } = typeToShade(projectType);
      return `hsl(${hue}, ${s}%, ${l}%)`;
    },
  };
}
