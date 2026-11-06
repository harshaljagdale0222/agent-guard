export type AgentStatus = 'active' | 'paused' | 'alert';

export interface Agent {
  id: string;
  name: string;
  role: string;
  publicKey: string;
  status: AgentStatus;
  dailyAllowanceNear: number;
  spentTodayNear: number;
  allowedContracts: string[];
  totalExecutions: number;
  lastActive: string;
}

export interface SecurityPolicy {
  dailySpendCapNear: number;
  singleTxCapNear: number;
  allowedContracts: string[];
  strictAnomalyDetection: boolean;
  autoFreezeOnBreach: boolean;
  emergencyFrozen: boolean;
}

export type TxStatus = 'APPROVED' | 'BLOCKED' | 'PENDING_APPROVAL';

export interface ActivityEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  targetContract: string;
  amountNear: number;
  status: TxStatus;
  txHash: string;
  notes?: string;
}

export interface TreasuryMetrics {
  totalBalanceNear: number;
  activeAgentsCount: number;
  dailySpendUsedNear: number;
  dailySpendCapNear: number;
  blockedAttemptsCount: number;
  securityHealthScore: number;
}

