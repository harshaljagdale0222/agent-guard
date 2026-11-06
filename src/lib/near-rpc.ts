/**
 * Real NEAR Protocol Multi-Network JSON-RPC Client
 * Seamlessly supports both Testnet and Mainnet based on account suffix
 */

export interface LiveNearAccount {
  accountId: string;
  amountNear: number;
  rawAmountYocto: string;
  blockHeight: number;
  blockHash: string;
  storageUsage: number;
  network: 'mainnet' | 'testnet';
}

export interface LiveAccessKey {
  publicKey: string;
  permissionType: 'FullAccess' | 'FunctionCall';
  receiverId?: string;
  allowanceNear?: number;
  methodNames?: string[];
  nonce: number;
}

export interface LiveNetworkStatus {
  chainId: string;
  latestBlockHeight: number;
  latestBlockHash: string;
  epochStartHeight: number;
}

export const TESTNET_RPC = 'https://rpc.testnet.near.org';
export const MAINNET_RPC = 'https://rpc.mainnet.near.org';

export function getRpcUrl(accountId: string): string {
  if (accountId.endsWith('.near') && !accountId.endsWith('.testnet')) {
    return MAINNET_RPC;
  }
  return TESTNET_RPC;
}

/**
 * Fetch real live account state from NEAR RPC (Mainnet or Testnet)
 */
export async function fetchLiveNearAccount(accountId: string): Promise<LiveNearAccount | null> {
  const rpcUrl = getRpcUrl(accountId);
  const network = rpcUrl === MAINNET_RPC ? 'mainnet' : 'testnet';

  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'agentguard-query-account',
        method: 'query',
        params: {
          request_type: 'view_account',
          finality: 'final',
          account_id: accountId,
        },
      }),
    });

    const data = await res.json();
    if (data.error || !data.result) {
      console.warn(`Account not found on ${network}:`, data.error);
      return null;
    }

    const yoctoStr = data.result.amount || '0';
    const nearAmount = formatYoctoToNear(yoctoStr);

    return {
      accountId,
      amountNear: nearAmount,
      rawAmountYocto: yoctoStr,
      blockHeight: data.result.block_height,
      blockHash: data.result.block_hash,
      storageUsage: data.result.storage_usage,
      network,
    };
  } catch (err) {
    console.error(`Failed to query NEAR ${network} RPC:`, err);
    return null;
  }
}

/**
 * Fetch real live access keys registered on-chain for a NEAR account
 */
export async function fetchLiveAccessKeys(accountId: string): Promise<LiveAccessKey[]> {
  const rpcUrl = getRpcUrl(accountId);

  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'agentguard-query-keys',
        method: 'query',
        params: {
          request_type: 'view_access_key_list',
          finality: 'final',
          account_id: accountId,
        },
      }),
    });

    const data = await res.json();
    if (data.error || !data.result || !data.result.keys) {
      return [];
    }

    return data.result.keys.map((k: any) => {
      const isFunctionCall = typeof k.access_key.permission === 'object' && k.access_key.permission?.FunctionCall;
      if (isFunctionCall) {
        const fc = k.access_key.permission.FunctionCall;
        return {
          publicKey: k.public_key,
          permissionType: 'FunctionCall',
          receiverId: fc.receiver_id,
          allowanceNear: fc.allowance ? formatYoctoToNear(fc.allowance) : undefined,
          methodNames: fc.method_names || [],
          nonce: k.access_key.nonce,
        };
      }
      return {
        publicKey: k.public_key,
        permissionType: 'FullAccess',
        nonce: k.access_key.nonce,
      };
    });
  } catch (err) {
    console.error('Failed to query access keys:', err);
    return [];
  }
}

/**
 * Fetch real network status from NEAR Testnet
 */
export async function fetchLiveNetworkStatus(): Promise<LiveNetworkStatus | null> {
  try {
    const res = await fetch(`${TESTNET_RPC}/status`, {
      method: 'GET',
    });
    const data = await res.json();
    if (!data.sync_info) return null;

    return {
      chainId: data.chain_id,
      latestBlockHeight: data.sync_info.latest_block_height,
      latestBlockHash: data.sync_info.latest_block_hash,
      epochStartHeight: data.sync_info.epoch_start_height,
    };
  } catch (err) {
    console.error('Failed to get status:', err);
    return null;
  }
}

/**
 * Helper to convert yoctoNEAR (10^24) to human-readable NEAR
 */
export function formatYoctoToNear(yocto: string): number {
  if (!yocto || yocto === '0') return 0;
  const padded = yocto.padStart(25, '0');
  const whole = padded.slice(0, padded.length - 24);
  const frac = padded.slice(padded.length - 24, padded.length - 20);
  return parseFloat(`${whole}.${frac}`);
}
