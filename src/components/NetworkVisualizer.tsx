'use client';

import React from 'react';
import { Bot, Shield, CheckCircle2, ArrowRight, Zap, Database } from 'lucide-react';

interface NetworkVisualizerProps {
  emergencyFrozen: boolean;
  allowedContracts: string[];
}

export const NetworkVisualizer: React.FC<NetworkVisualizerProps> = ({
  emergencyFrozen,
  allowedContracts,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-zinc-950 p-6 shadow-xl backdrop-blur-xl">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-zinc-800/80 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Live Architecture Pipeline
          </span>
          <h3 className="text-base font-bold text-white">
            Autonomous Multi-Agent Cryptographic Flow
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-mono text-zinc-400">Real-time Policy Interception Active</span>
        </div>
      </div>

      {/* Visual Pipeline Grid */}
      <div className="mt-6 grid grid-cols-1 items-center gap-6 md:grid-cols-3">
        {/* Step 1: Autonomous AI Agents */}
        <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
            <span className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-cyan-400" />
              <span>1. Autonomous Agents</span>
            </span>
            <span className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300">
              ed25519 Keys
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-lg bg-zinc-950/80 p-2 border border-zinc-800/60">
              <span className="text-zinc-200">AutoInvoice Settler</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-950/80 p-2 border border-zinc-800/60">
              <span className="text-zinc-200">Compute Refiller</span>
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]"></span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-950/80 p-2 border border-zinc-800/60">
              <span className="text-zinc-200">DeFi Swarm Bot</span>
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_6px_#8b5cf6]"></span>
            </div>
          </div>
        </div>

        {/* Step 2: AgentGuard Policy Shield (Centerpiece) */}
        <div className="relative flex flex-col items-center justify-center rounded-xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-zinc-900 to-zinc-950 p-6 text-center shadow-lg shadow-emerald-950/30">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Shield className="h-7 w-7" />
          </div>
          <h4 className="mt-3 text-sm font-bold text-white">AgentGuard Shield Engine</h4>
          <p className="mt-1 text-[11px] text-zinc-400">
            {emergencyFrozen ? (
              <span className="text-rose-400 font-semibold">ALL SESSIONS FROZEN</span>
            ) : (
              <span>Spending Cap &bull; Anomaly Radar &bull; Whitelist</span>
            )}
          </p>
          <div className="mt-3 inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[10px] font-mono text-emerald-300">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>Cryptographic Verification</span>
          </div>
        </div>

        {/* Step 3: NEAR Protocol Settlement */}
        <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
            <span className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-emerald-400" />
              <span>3. NEAR Settlement Rails</span>
            </span>
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-mono text-emerald-300">
              1.2s Finality
            </span>
          </div>
          <div className="space-y-2 text-xs">
            {allowedContracts.slice(0, 3).map((contract) => (
              <div
                key={contract}
                className="flex items-center justify-between rounded-lg bg-zinc-950/80 p-2 border border-zinc-800/60 font-mono text-[11px] text-zinc-300"
              >
                <span>{contract}</span>
                <Zap className="h-3 w-3 text-amber-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

