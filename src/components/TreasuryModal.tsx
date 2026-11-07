'use client';

import React from 'react';
import { X, Vault, ShieldCheck, ArrowUpRight, Lock, ExternalLink, RefreshCw, Coins, Landmark } from 'lucide-react';
import { TreasuryMetrics } from '@/types';

interface TreasuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: TreasuryMetrics;
  activeAccount: string | null;
  onNavigateToInvoicing: () => void;
}

export const TreasuryModal: React.FC<TreasuryModalProps> = ({
  isOpen,
  onClose,
  metrics,
  activeAccount,
  onNavigateToInvoicing,
}) => {
  if (!isOpen) return null;

  const total = metrics.totalBalanceNear;
  const agentPool = 45.0;
  const gasBuffer = 7.0;
  const coldVault = Math.max(0, total - agentPool - gasBuffer);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-zinc-900 via-[#0a0f0d] to-[#060807] p-6 shadow-2xl shadow-emerald-950/40 sm:p-7 max-h-[90vh] overflow-y-auto">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Vault className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">Treasury Reserve Vault</h3>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-bold uppercase">
                  Consensus Protected
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Cryptographic allocation breakdown &amp; real-world liquidity on NEAR Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Vault Balance Hero */}
        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-zinc-900/50 to-black p-5 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
                Total Protocol Reserves
              </span>
              <div className="mt-1 flex items-baseline space-x-3">
                <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
                  {total.toFixed(2)}
                </span>
                <span className="text-xl font-bold text-emerald-400 font-mono">NEAR</span>
                <span className="text-sm text-zinc-400 font-mono">
                  ≈ ${(total * 5.1).toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2">
              <div className="text-[10px] uppercase font-bold text-zinc-500">Connected Wallet</div>
              <div className="text-xs font-mono font-bold text-emerald-300">
                {activeAccount || 'harshal0296.testnet'}
              </div>
            </div>
          </div>

          {/* Allocation Progress Bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-zinc-400 mb-2">
              <span className="font-semibold text-zinc-300">Reserve Allocation Breakdown</span>
              <span className="font-mono text-emerald-400">100% Accounted</span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-800 border border-zinc-700/60 p-0.5">
              <div
                style={{ width: `${(coldVault / total) * 100}%` }}
                className="h-full rounded-l-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                title="Cold Vault"
              ></div>
              <div
                style={{ width: `${(agentPool / total) * 100}%` }}
                className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                title="Agent Sandboxes"
              ></div>
              <div
                style={{ width: `${(gasBuffer / total) * 100}%` }}
                className="h-full rounded-r-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                title="Gas Buffer"
              ></div>
            </div>
          </div>
        </div>

        {/* 3 Compartments Breakdown */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* 1. Cold Reserve Vault */}
          <div className="rounded-xl border border-emerald-500/25 bg-zinc-950/60 p-3.5">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Landmark className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Cold Vault</span>
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-white">
              {coldVault.toFixed(2)} <span className="text-xs text-emerald-400">NEAR</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              Multi-sig protected offline reserve. Autonomous agents cannot access.
            </p>
          </div>

          {/* 2. Sandboxed Agent Pool */}
          <div className="rounded-xl border border-cyan-500/25 bg-zinc-950/60 p-3.5">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Coins className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Agent Pool</span>
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-white">
              {agentPool.toFixed(2)} <span className="text-xs text-cyan-400">NEAR</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              Allocated to 3 AI agents via restricted ed25519 Function Call Keys.
            </p>
          </div>

          {/* 3. Gas & Settlement Buffer */}
          <div className="rounded-xl border border-amber-500/25 bg-zinc-950/60 p-3.5">
            <div className="flex items-center space-x-2 text-amber-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Gas Buffer</span>
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-white">
              {gasBuffer.toFixed(2)} <span className="text-xs text-amber-400">NEAR</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              Live Testnet transaction fee reserve. Predictable &lt;$0.001 per call.
            </p>
          </div>
        </div>

        {/* Security Rules for Treasury */}
        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-xs font-bold text-zinc-200 flex items-center space-x-2">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span>Treasury Protection Guarantees</span>
          </div>
          <ul className="mt-2 space-y-1.5 text-xs text-zinc-400">
            <li className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span><strong>Consensus-Level Key Sandboxing:</strong> Agents hold zero master private keys.</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span><strong>Deterministic Velocity Caps:</strong> Daily spend hard stop at 15.0 NEAR.</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span><strong>Instant Hardware Freeze:</strong> One click completely revokes signing authority.</span>
            </li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800 pt-4">
          <a
            href="https://testnet.nearblocks.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 hover:underline"
          >
            <span>Verify on NearBlocks Explorer</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onNavigateToInvoicing();
              }}
              className="flex-1 sm:flex-initial rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
            >
              Open B2B Invoicing Rail &rarr;
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
