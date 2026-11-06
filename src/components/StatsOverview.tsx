'use client';

import React from 'react';
import { ShieldCheck, Bot, TrendingUp, AlertOctagon, CheckCircle2, ArrowUpRight, Lock } from 'lucide-react';
import { TreasuryMetrics } from '@/types';

interface StatsOverviewProps {
  metrics: TreasuryMetrics;
  emergencyFrozen: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ metrics, emergencyFrozen }) => {
  const dailySpendPercent = Math.min(
    100,
    Math.round((metrics.dailySpendUsedNear / metrics.dailySpendCapNear) * 100)
  );

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Treasury Reserve Balance (Emerald Theme) */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/25 via-zinc-900/60 to-zinc-950/80 p-5 shadow-lg shadow-emerald-950/20 backdrop-blur-xl transition-all hover:border-emerald-500/50 hover:shadow-emerald-900/20">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
            Treasury Reserve
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
              {metrics.totalBalanceNear.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-emerald-400 font-mono">NEAR</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-zinc-400 font-mono">
              ≈ ${(metrics.totalBalanceNear * 5.1).toFixed(2)} USD
            </p>
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-400">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              +100% Free Faucet
            </span>
          </div>
        </div>
      </div>

      {/* 2. Autonomous Agent Swarm (Electric Cyan Theme) */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/25 via-zinc-900/60 to-zinc-950/80 p-5 shadow-lg shadow-cyan-950/20 backdrop-blur-xl transition-all hover:border-cyan-500/50 hover:shadow-cyan-900/20">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90">
            Active AI Agents
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <Bot className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
              {metrics.activeAgentsCount}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                emergencyFrozen
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {emergencyFrozen ? 'FROZEN' : 'SWARM ONLINE'}
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-400 flex items-center space-x-1">
            <Lock className="h-3 w-3 text-cyan-400 inline" />
            <span>Function Call Keys &bull; No Master Private Key</span>
          </p>
        </div>
      </div>

      {/* 3. 24h Spend vs Human Policy Cap (Vibrant Amber Theme) */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/25 via-zinc-900/60 to-zinc-950/80 p-5 shadow-lg shadow-amber-950/20 backdrop-blur-xl transition-all hover:border-amber-500/50 hover:shadow-amber-900/20">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">
            Daily Spend Cap
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
              {metrics.dailySpendUsedNear.toFixed(2)}
            </span>
            <span className="text-xs font-mono font-semibold text-amber-400">
              / {metrics.dailySpendCapNear.toFixed(1)} NEAR
            </span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-zinc-800/80 border border-zinc-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              style={{ width: `${dailySpendPercent}%` }}
            ></div>
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-zinc-400">
            <span>{dailySpendPercent}% consumed</span>
            <span className="text-zinc-500 font-mono">
              {(metrics.dailySpendCapNear - metrics.dailySpendUsedNear).toFixed(2)} NEAR remaining
            </span>
          </div>
        </div>
      </div>

      {/* 4. Security Health & Interceptions (Violet / Rose Theme) */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-950/25 via-zinc-900/60 to-zinc-950/80 p-5 shadow-lg shadow-violet-950/20 backdrop-blur-xl transition-all hover:border-violet-500/50 hover:shadow-violet-900/20">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400/90">
            Policy Shield
          </span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
              emergencyFrozen
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-violet-500/20 border-violet-500/30 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
            }`}
          >
            {emergencyFrozen ? (
              <AlertOctagon className="h-4 w-4" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
              {metrics.securityHealthScore}%
            </span>
            <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
              OPTIMAL
            </span>
          </div>
          <p className="mt-2 text-xs font-mono text-rose-400 font-medium">
            🛡️ {metrics.blockedAttemptsCount} rogue drain attempts intercepted
          </p>
        </div>
      </div>
    </div>
  );
};
