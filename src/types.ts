export interface ScanTarget {
  id: string;
  url: string;
  targetType: 'web_app' | 'api_endpoint' | 'source_code' | 'cloud_infrastructure';
  frameworks: string[];
  status: 'idle' | 'scanning' | 'completed' | 'failed';
  lastScannedAt?: string;
  riskScore: number; // 0-100
  vulnerabilitiesCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  cveId?: string;
  category: 'OWASP Top 10' | 'API Security' | 'Configuration' | 'Dependency' | 'Authentication';
  description: string;
  affectedEndpoint: string;
  remediationSteps: string[];
  codeSnippet?: string;
  fixSnippet?: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl?: string; // base64 preview for images, video, audio
  textContent?: string; // plain text content for txt, json, csv, code, md
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system' | 'agent';
  agentName?: string;
  content: string;
  timestamp: string;
  scanResult?: ScanReport;
  attachments?: AttachedFile[];
  actionButtons?: { label: string; action: string; payload?: any }[];
  isStreaming?: boolean;
}

export interface ScanReport {
  scanId: string;
  targetUrl: string;
  timestamp: string;
  overallScore: number;
  summary: string;
  toolsExecuted: string[];
  vulnerabilities: Vulnerability[];
  recommendations: string[];
}

export interface SubAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'running' | 'paused' | 'error';
  assignedTask: string;
  taskProgress: number; // 0 - 100
  metrics: {
    scansCompleted: number;
    threatsFound: number;
    uptime: string;
  };
  logs: string[];
}

export interface MemoryVector {
  id: string;
  query: string;
  response?: string;
  context?: string;
  tags: string[];
  relevanceScore?: number;
  createdAt: string;
}

export interface ArchitecturePhase {
  phaseNumber: number;
  title: string;
  timeframe: string;
  objectives: string[];
  status: 'planning' | 'in_progress' | 'completed';
}
