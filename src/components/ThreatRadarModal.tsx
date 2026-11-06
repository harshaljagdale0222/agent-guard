'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Terminal, X, Lock, CheckCircle2, Cpu } from 'lucide-react';

interface ThreatRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreatRadarModal: React.FC<ThreatRadarModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const threatVectors = [
    {
      name: 'Adversarial Prompt Injection',
      risk: 'CRITICAL',
      status: 'INTERCEPTED',
      confidence: '99.8%',
      details: 'Attacker prompt attempted to override agent system instructions via delimiter injection.',
      remedy: 'Cryptographic policy check failed before signing. Zero network broadcast.',
    },
    {
      name: 'Scope Exfiltration & Master Key Drain',
      risk: 'HIGH',
      status: 'PREVENTED BY DESIGN',
      confidence: '100%',
      details: 'Agent attempted to call full-access Transfer method on root account.',
      remedy: 'NEAR Protocol FunctionCallPermission natively rejects Transfer calls at consensus layer.',
    },
    {
      name: 'Unlisted Receiver Phishing Trap',
      risk: 'HIGH',
      status: 'BLOCKED',
      confidence: '98.5%',
      details: 'Receiver address attacker.near was not found in human-authorized contract whitelist.',
      remedy: 'Deterministic address comparison intercepted call in middleware.',
    },
    {
      name: 'Velocity Overspend / Flash Drain',
      risk: 'MEDIUM',
      status: 'CAPPED',
      confidence: '100%',
      details: 'Requested 20.0 NEAR exceeded single transaction cap (3.0 NEAR).',
      remedy: 'Velocity governor triggered instant auto-freeze.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-900 to-[#09090b] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">AI Threat Radar &amp; Security Explainer</h3>
                <span className="rounded bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-mono text-rose-300">
                  REAL-TIME DEFENSE
                </span>
              </div>
              <p className="text-xs text-zinc-400">Deep telemetry of prompt injection defenses &amp; NEAR consensus guardrails</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Attack Vector Cards */}
        <div className="mt-5 space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {threatVectors.map((tv, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 transition-all hover:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-zinc-200">{tv.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                    Confidence: {tv.confidence}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    {tv.status}
                  </span>
                </div>
              </div>

              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{tv.details}</p>

              <div className="mt-2.5 flex items-center space-x-1.5 rounded-lg bg-zinc-900/90 px-3 py-1.5 text-[11px] font-mono text-emerald-400">
                <Lock className="h-3 w-3 shrink-0" />
                <span>NEAR Defense: {tv.remedy}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">
          <div className="flex items-center space-x-2 text-[11px] text-zinc-500 font-mono">
            <Cpu className="h-3.5 w-3.5 text-zinc-400" />
            <span>Verifiable Defense Model v2.4</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
          >
            Close Radar
          </button>
        </div>
      </div>
    </div>
  );
};

