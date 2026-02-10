export type TransactionType =
  | "transfer"
  | "swap"
  | "nft"
  | "approval"
  | "contract_interaction"
  | "spam"
  | "unknown";

export type TransactionDirection = "in" | "out" | "self";

export interface ParsedTransaction {
  hash: string;
  timestamp: number;
  date: string;
  type: TransactionType;
  direction: TransactionDirection;
  value: string;
  valueUsd?: string;
  token?: string;
  tokenSymbol?: string;
  from: string;
  fromLabel?: string;
  to: string;
  toLabel?: string;
  gasUsed: string;
  gasUsd?: string;
  status: "success" | "failed";
  isSpam: boolean;
  isPoisoning: boolean;
  poisoningTarget?: string;
  description: string;
  chain: string;
  blockNumber: number;
  explorerUrl: string;
}

export interface WalletSummary {
  address: string;
  chain: string;
  totalTransactions: number;
  spamCount: number;
  poisoningCount: number;
  transactions: ParsedTransaction[];
}

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: number;
}
