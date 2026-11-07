'use client';

import React from 'react';
import { ShieldCheck, Bot, TrendingUp, AlertOctagon, CheckCircle2, ArrowUpRight, Lock, ChevronRight, Sparkles } from 'lucide-react';
import { TreasuryMetrics } from '@/types';

interface StatsOverviewProps {
  metrics: TreasuryMetrics;
  emergencyFrozen: boolean;
  onClickTreasury?: () => void;
  onClickAgents?: () => void;
  onClickDailySpend?: () => void;
  onClickPolicyShield?: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  metrics,
  emergencyFrozen,
  onClickTreasury,
  onClickAgents,
  onClickDailySpend,
  onClickPolicyShield,
}) => {
  const dailySpendPercent = Math.min(
    100,
    Math.round((metrics.dailySpendUsedNear / metrics.dailySpendCapNear) * 100)
  );

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Treasury Reserve Balance (Emerald Theme) */}
      <button
        type="button"
        onClick={onClickTreasury}
        className="group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/25 via-zinc-900/60 to-zinc-950/80 p-5 text-left shadow-lg shadow-emerald-950/20 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/60 hover:shadow-emerald-900/40 hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90 flex items-center space-x-1.5">
            <span>Treasury Reserve</span>
            <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
              OPEN VAULT
            </span>
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] group-hover:bg-emerald-500 group-hover:text-black transition-all">
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
          <div className="mt-3.5 flex items-center justify-between border-t border-emerald-500/15 pt-2.5 text-[11px] text-emerald-400/90 font-medium">
            <span>View Vault Breakdown</span>
            <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>

      {/* 2. Autonomous Agent Swarm (Electric Cyan Theme) */}
      <button
        type="button"
        onClick={onClickAgents}
        className="group relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/25 via-zinc-900/60 to-zinc-950/80 p-5 text-left shadow-lg shadow-cyan-950/20 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/60 hover:shadow-cyan-900/40 hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90 flex items-center space-x-1.5">
            <span>Active AI Agents</span>
            <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
              VIEW SWARM
            </span>
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)] group-hover:bg-cyan-500 group-hover:text-black transition-all">
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
            <span>Function Call Keys &bull; No Private Key</span>
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-cyan-500/15 pt-2.5 text-[11px] text-cyan-400/90 font-medium">
            <span>Inspect Agent Keys &amp; Swarm</span>
            <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>

      {/* 3. 24h Spend vs Human Policy Cap (Vibrant Amber Theme) */}
      <button
        type="button"
        onClick={onClickDailySpend}
        className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/25 via-zinc-900/60 to-zinc-950/80 p-5 text-left shadow-lg shadow-amber-950/20 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/60 hover:shadow-amber-900/40 hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 flex items-center space-x-1.5">
            <span>Daily Spend Cap</span>
            <span className="rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-mono text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
              SET LIMITS
            </span>
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)] group-hover:bg-amber-500 group-hover:text-black transition-all">
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
              {(metrics.dailySpendCapNear - metrics.dailySpendUsedNear).toFixed(2)} NEAR left
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-amber-500/15 pt-2 text-[11px] text-amber-400/90 font-medium">
            <span>Adjust Ceilings &amp; Whitelist</span>
            <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>

      {/* 4. Security Health & Interceptions (Violet / Rose Theme) */}
      <button
        type="button"
        onClick={onClickPolicyShield}
        className="group relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-950/25 via-zinc-900/60 to-zinc-950/80 p-5 text-left shadow-lg shadow-violet-950/20 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/60 hover:shadow-violet-900/40 hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl pointer-events-none group-hover:bg-violet-500/20 transition-all"></div>
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400/90 flex items-center space-x-1.5">
            <span>Policy Shield</span>
            <span className="rounded bg-violet-500/15 border border-violet-500/30 px-1.5 py-0.2 text-[9px] font-mono text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">
              RADAR
            </span>
          </span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
              emergencyFrozen
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-violet-500/20 border-violet-500/30 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.25)] group-hover:bg-violet-500 group-hover:text-black'
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
          <div className="mt-3 flex items-center justify-between border-t border-violet-500/15 pt-2.5 text-[11px] text-violet-400/90 font-medium">
            <span>Open Threat Radar &amp; Vectors</span>
            <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>
    </div>
  );
};
