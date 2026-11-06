import { KeyPair } from 'near-api-js';

export interface NearConnectionConfig {
  networkId: string;
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  explorerUrl: string;
}

export const TESTNET_CONFIG: NearConnectionConfig = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://testnet.mynearwallet.com',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://testnet.nearblocks.io',
};

/**
 * Generate a cryptographically secure ed25519 keypair for an autonomous agent.
 * This key is designed to be added as a Function Call Access Key to a NEAR account,
 * ensuring the agent cannot sign full-access transfers.
 */
export function generateAgentKeyPair(): {
  publicKey: string;
  secretKey: string;
} {
  const keyPair = KeyPair.fromRandom('ed25519');
  return {
    publicKey: keyPair.getPublicKey().toString(),
    secretKey: keyPair.toString(),
  };
}

/**
 * Validates a candidate agent transaction against human-defined security policies
 */
export interface PolicyEvaluationResult {
  allowed: boolean;
  violations: string[];
}

export function evaluatePolicy(
  targetContract: string,
  amountNear: number,
  allowedContracts: string[],
  singleTxCapNear: number,
  dailySpendCapNear: number,
  currentDailySpendNear: number
): PolicyEvaluationResult {
  const violations: string[] = [];

  // Check 1: Whitelisted contracts
  const isWhitelisted = allowedContracts.some(
    (allowed) => allowed.toLowerCase() === targetContract.toLowerCase()
  );
  if (!isWhitelisted) {
    violations.push(`Target contract "${targetContract}" is not on the authorized whitelist.`);
  }

  // Check 2: Single transaction velocity cap
  if (amountNear > singleTxCapNear) {
    violations.push(
      `Requested amount (${amountNear} NEAR) exceeds the single transaction limit of ${singleTxCapNear} NEAR.`
    );
  }

  // Check 3: Daily spend allowance
  if (currentDailySpendNear + amountNear > dailySpendCapNear) {
    violations.push(
      `Transaction would exceed the 24h spending ceiling (${dailySpendCapNear} NEAR).`
    );
  }

  return {
    allowed: violations.length === 0,
    violations,
  };
}

/**
 * Format explorer URL for verification
 */
export function getExplorerTxUrl(txHash: string): string {
  return `${TESTNET_CONFIG.explorerUrl}/txns/${txHash}`;
}

