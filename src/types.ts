export interface Comment {
  id: string;
  authorName: string;
  authorType: 'human' | 'agent';
  authorRole: string; // e.g. "Scout Agent", "UI Designer", etc.
  avatar?: string;
  text: string;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  stage: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface Lead {
  id: string;
  businessName: string;
  city: string;
  niche: string;
  website: string;
  contactEmail: string;
  status: 'scouted' | 'diagnosed' | 'building' | 'filming' | 'pitching' | 'qa_check' | 'complete';
  originalPageSpeed: number;
  newPageSpeed?: number;
  accessibilityScore: number;
  auditIssues: string[];
  auditFixes: string[];
  redesignPageUrl?: string;
  heyGenVideoUrl?: string;
  heyGenStatus: 'none' | 'pending_approval' | 'rendering' | 'ready';
  heyGenCost: number;
  outreachChannel: 'instagram' | 'facebook' | 'email';
  conversionStatus: 'pipeline' | 'replied_interested' | 'converted' | 'unresponsive';
  comments: Comment[];
  history: HistoryItem[];
  assignedTo: string; // Human or Agent assignment
}

export interface AgentLog {
  id: string;
  agentName: string;
  action: string;
  status: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  details?: string;
}

export interface SystemMetrics {
  scoutedLeadsCount: number;
  convertedClientsCount: number;
  totalApiSpent: number;
  conversionRate: number; // e.g., 4.7
  metaHourCount: number; // e.g., messages sent in last hour (limit 200)
  pageSpeedApiStatus: 'online' | 'throttled' | 'cooldown';
  pageSpeedCooldownRemaining: number; // seconds
  totalTokenUsage: number;
}

export interface RemoteTeamMember {
  id: string;
  name: string;
  type: 'human' | 'agent';
  role: string;
  status: 'online' | 'offline' | 'busy' | 'processing';
  avatarColor: string;
  lastActive: string;
}
