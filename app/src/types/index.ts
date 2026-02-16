export interface Project {
  id: string;
  code: string;
  name: string;
  clientName: string | null;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimeBlock {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: 15 | 30 | 60;
  projectId: string;
  comment: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string | null;
  createdAt: string;
}

export interface Settings {
  id: string; // always 'singleton'
  dailyReminderTime: string; // HH:mm
  defaultBlockSize: 15 | 30 | 60;
  workDayStart: string; // HH:mm
  workDayEnd: string; // HH:mm
  defaultTags: string[];
  theme: 'light' | 'dark';
}

export interface ProjectImportRow {
  project_code: string;
  project_name: string;
  client_name?: string;
}

export interface TimelineSlot {
  type: 'block' | 'gap';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  block?: TimeBlock;
}

export interface DaySummary {
  date: string;
  totalMinutes: number;
  blocks: TimeBlock[];
  projectTotals: ProjectTotal[];
}

export interface ProjectTotal {
  projectId: string;
  projectCode: string;
  projectName: string;
  clientName: string | null;
  totalMinutes: number;
  comments: string[];
}

export interface WeekSummary {
  weekNumber: number;
  year: number;
  days: DaySummary[];
  totalMinutes: number;
}

export interface AddTimeFormData {
  projectId: string;
  durationMinutes: 15 | 30 | 60;
  comment: string;
  tags: string[];
  startTime?: string; // optional override
}
