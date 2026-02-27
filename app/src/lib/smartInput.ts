import type { Project, Tag } from '@/types';

export interface ParsedInput {
  projectQuery: string | null;
  projectId: string | null;
  durationMinutes: 15 | 30 | 60 | null;
  comment: string;
  tags: string[];
}

const DURATION_PATTERNS: { pattern: RegExp; minutes: 15 | 30 | 60 }[] = [
  { pattern: /\b15\s*(?:m(?:in)?)\b/i, minutes: 15 },
  { pattern: /\b30\s*(?:m(?:in)?)\b/i, minutes: 30 },
  { pattern: /\b60\s*(?:m(?:in)?)\b/i, minutes: 60 },
  { pattern: /\b1\s*(?:t(?:ime)?)\b/i, minutes: 60 },
  { pattern: /\b0[,.]25\s*t\b/i, minutes: 15 },
  { pattern: /\b0[,.]5\s*t\b/i, minutes: 30 },
];

export function parseSmartInput(
  text: string,
  _projects: Project[],
  tags: Tag[],
): ParsedInput {
  const result: ParsedInput = {
    projectQuery: null,
    projectId: null,
    durationMinutes: null,
    comment: '',
    tags: [],
  };

  let remaining = text.trim();

  // Extract project query (starts with /)
  const projectMatch = remaining.match(/^\/(\S*)/);
  if (projectMatch) {
    result.projectQuery = projectMatch[1];
    remaining = remaining.slice(projectMatch[0].length).trim();
  }

  // Extract duration
  for (const { pattern, minutes } of DURATION_PATTERNS) {
    if (pattern.test(remaining)) {
      result.durationMinutes = minutes;
      remaining = remaining.replace(pattern, '').trim();
      break;
    }
  }

  // Extract tags by matching known tag names (case-insensitive)
  // Tag word is kept in remaining so it appears in the comment too
  for (const tag of tags) {
    const tagPattern = new RegExp(`\\b${escapeRegex(tag.name)}\\b`, 'i');
    if (tagPattern.test(remaining)) {
      result.tags.push(tag.name);
    }
  }

  // Clean up remaining as comment
  result.comment = remaining.replace(/\s+/g, ' ').trim();

  return result;
}

export function searchProjects(query: string, projects: Project[]): Project[] {
  if (!query) return projects.filter((p) => p.isActive);
  const q = query.toLowerCase();
  return projects
    .filter((p) => p.isActive)
    .filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.clientName && p.clientName.toLowerCase().includes(q)),
    )
    .slice(0, 10);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
