export interface AuditResult {
  score: number;
  status: 'passed' | 'failed' | 'pending';
  details?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
