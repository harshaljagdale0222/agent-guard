'use client';

import React, { useState, useEffect } from 'react';
import { Database, Search, RefreshCw, Key, CheckCircle, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import {
  fetchLiveNearAccount,
  fetchLiveAccessKeys,
  fetchLiveNetworkStatus,
  LiveNearAccount,
  LiveAccessKey,
  LiveNetworkStatus,
} from '@/lib/near-rpc';

interface LiveOnChainInspectorProps {
  onSyncWithLiveAccount: (account: LiveNearAccount, keys: LiveAccessKey[]) => void;
}

export const LiveOnChainInspector: React.FC<LiveOnChainInspectorProps> = ({
  onSyncWithLiveAccount,
}) => {
  const [inputAccount, setInputAccount] = useState('guest-book.testnet');
  const [activeAccount, setActiveAccount] = useState<LiveNearAccount | null>(null);
  const [accessKeys, setAccessKeys] = useState<LiveAccessKey[]>([]);
  const [networkStatus, setNetworkStatus] = useState<LiveNetworkStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(false);

  // Initial load
  useEffect(() => {
    loadLiveAccount('guest-book.testnet');
  }, []);

  const loadLiveAccount = async (targetId: string) => {
    setLoading(true);
    setSynced(false);
    try {
      const [acc, keys, net] = await Promise.all([
        fetchLiveNearAccount(targetId),
        fetchLiveAccessKeys(targetId),
        fetchLiveNetworkStatus(),
      ]);
      setActiveAccount(acc);
      setAccessKeys(keys);
      setNetworkStatus(net);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAccount.trim()) {
      loadLiveAccount(inputAccount.trim().toLowerCase());
    }
  };

  const handleSyncToDashboard = () => {
    if (activeAccount) {
      onSyncWithLiveAccount(activeAccount, accessKeys);
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 via-zinc-900/90 to-zinc-950 p-6 shadow-2xl backdrop-blur-xl">
      {/* Glow orb */}
      <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>100% LIVE ON-CHAIN</span>
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Connected: rpc.testnet.near.org
            </span>
          </div>
          <h3 className="mt-1 text-lg font-black text-white sm:text-xl">
            Live NEAR Protocol Testnet Inspector
          </h3>
          <p className="text-xs text-zinc-400">
            Directly interrogating consensus state, real block height, and on-chain access keys without mocks.
          </p>
        </div>

        {/* Live Network Pill */}
        {networkStatus && (
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 font-mono text-xs">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Block Height</div>
              <div className="font-bold text-emerald-400">
                #{networkStatus.latestBlockHeight.toLocaleString()}
              </div>
            </div>
            <div className="h-6 w-px bg-zinc-800"></div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Chain ID</div>
              <div className="text-zinc-200">{networkStatus.chainId}</div>
            </div>
          </div>
        )}
      </div>

      {/* Account Query Search Bar */}
      <form onSubmit={handleSearch} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={inputAccount}
            onChange={(e) => setInputAccount(e.target.value)}
            placeholder="Enter any real NEAR Testnet account (e.g. guest-book.testnet, myaccount.testnet)..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-2.5 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Query Live RPC</span>
            </>
          )}
        </button>
      </form>

      {/* Live Data Display */}
      {activeAccount ? (
        <div className="mt-6 space-y-5">
          {/* Real Metrics Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                On-Chain Balance (Testnet)
              </span>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-white font-mono">
                  {activeAccount.amountNear.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">NEAR</span>
              </div>
              <p className="mt-1 text-[10px] font-mono text-zinc-500 truncate">
                Raw: {activeAccount.rawAmountYocto} yoctoNEAR
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                Last Verified Block
              </span>
              <div className="mt-1 font-mono text-lg font-bold text-cyan-400">
                #{activeAccount.blockHeight.toLocaleString()}
              </div>
              <p className="mt-1 text-[10px] font-mono text-zinc-500 truncate">
                Hash: {activeAccount.blockHash.substring(0, 16)}...
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                On-Chain Access Keys
              </span>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-white font-mono">
                  {accessKeys.length}
                </span>
                <span className="text-xs text-zinc-400">Keys Registered</span>
              </div>
              <p className="mt-1 text-[10px] text-emerald-400">
                {accessKeys.filter((k) => k.permissionType === 'FunctionCall').length} Function Call Keys
              </p>
            </div>
          </div>

          {/* Sync Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Sync AgentGuard Dashboard with this Real On-Chain Account
                </div>
                <div className="text-[11px] text-zinc-400">
                  Updates treasury balance, active account, and registers its on-chain Function Call Keys.
                </div>
              </div>
            </div>

            <button
              onClick={handleSyncToDashboard}
              className="inline-flex items-center space-x-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
            >
              {synced ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Synced Successfully!</span>
                </>
              ) : (
                <>
                  <span>Load into Dashboard</span>
                </>
              )}
            </button>
          </div>

          {/* Real On-Chain Access Keys Table */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h4 className="text-xs font-bold text-zinc-200">
                Live On-Chain Cryptographic Keys ({accessKeys.length})
              </h4>
              <a
                href={`https://testnet.nearblocks.io/address/${activeAccount.accountId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] text-cyan-400 hover:underline"
              >
                <span>View on NearBlocks Explorer</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[10px]">
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Public Key</th>
                    <th className="py-2 px-3">Restricted Receiver</th>
                    <th className="py-2 px-3 text-right">Allowance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                  {accessKeys.slice(0, 5).map((key, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/40">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {key.permissionType === 'FunctionCall' ? (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            <Key className="h-3 w-3" />
                            <span>FunctionCall</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400">
                            <span>FullAccess</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-300">
                        {key.publicKey.substring(0, 24)}...
                      </td>
                      <td className="py-2.5 px-3 text-cyan-300">
                        {key.receiverId || <span className="text-zinc-600">None (Full Access)</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right text-zinc-200">
                        {key.allowanceNear !== undefined
                          ? `${key.allowanceNear.toFixed(2)} NEAR`
                          : 'Unlimited'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 text-center py-8 text-xs text-zinc-500">
          Account not found on NEAR Testnet RPC. Try &apos;guest-book.testnet&apos; or &apos;testnet&apos;.
        </div>
      )}
    </div>
  );
};

