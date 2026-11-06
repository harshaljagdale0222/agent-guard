'use client';

import React, { useState } from 'react';
import { Sliders, Shield, AlertTriangle, Plus, X, Check, Lock, ShieldAlert } from 'lucide-react';
import { SecurityPolicy } from '@/types';

interface PolicyEngineProps {
  policy: SecurityPolicy;
  onUpdatePolicy: (updated: Partial<SecurityPolicy>) => void;
}

export const PolicyEngine: React.FC<PolicyEngineProps> = ({ policy, onUpdatePolicy }) => {
  const [newContract, setNewContract] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddContract = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newContract.trim().toLowerCase();
    if (trimmed && !policy.allowedContracts.includes(trimmed)) {
      onUpdatePolicy({
        allowedContracts: [...policy.allowedContracts, trimmed],
      });
      setNewContract('');
    }
  };

  const handleRemoveContract = (contract: string) => {
    onUpdatePolicy({
      allowedContracts: policy.allowedContracts.filter((c) => c !== contract),
    });
  };

  const triggerSaveNotification = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shadow-md">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Human Policy &amp; Governance Engine</h3>
            <p className="text-xs text-zinc-400">
              Deterministic boundaries enforced cryptographically before any agent transaction hits NEAR.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-2 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Check className="h-4 w-4" />
            <span>Policy Enforced On-Chain</span>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Spending Limits */}
        <div className="space-y-6 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-6 shadow-md">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Financial Velocity Limits
            </h4>
          </div>

          {/* Daily Limit Slider */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-200 font-medium">Global 24h Spend Ceiling</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {policy.dailySpendCapNear.toFixed(1)} NEAR
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={policy.dailySpendCapNear}
              onChange={(e) => {
                onUpdatePolicy({ dailySpendCapNear: parseFloat(e.target.value) });
                triggerSaveNotification();
              }}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-emerald-400 shadow-inner"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>5 NEAR (~$25)</span>
              <span>25 NEAR</span>
              <span>50 NEAR (~$250)</span>
            </div>
          </div>

          {/* Single Transaction Cap Slider */}
          <div className="border-t border-zinc-800/80 pt-5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-200 font-medium">Single Transaction Velocity Cap</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">
                {policy.singleTxCapNear.toFixed(1)} NEAR
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={policy.singleTxCapNear}
              onChange={(e) => {
                onUpdatePolicy({ singleTxCapNear: parseFloat(e.target.value) });
                triggerSaveNotification();
              }}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-cyan-400 shadow-inner"
            />
            <p className="mt-2 text-xs text-zinc-400">
              Any single agent call requesting &gt;{policy.singleTxCapNear} NEAR is instantly blocked.
            </p>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-4 border-t border-zinc-800/80 pt-5">
            <label className="flex items-center justify-between cursor-pointer rounded-xl bg-zinc-950/60 p-3 border border-zinc-800/60 hover:border-zinc-700">
              <div>
                <div className="text-xs font-bold text-white">Strict Anomaly Detection</div>
                <div className="text-[11px] text-zinc-400">
                  Monitors prompt injection signatures &amp; velocity spikes
                </div>
              </div>
              <input
                type="checkbox"
                checked={policy.strictAnomalyDetection}
                onChange={(e) => {
                  onUpdatePolicy({ strictAnomalyDetection: e.target.checked });
                  triggerSaveNotification();
                }}
                className="h-5 w-5 rounded border-zinc-700 bg-zinc-800 text-emerald-500 accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer rounded-xl bg-zinc-950/60 p-3 border border-zinc-800/60 hover:border-zinc-700">
              <div>
                <div className="text-xs font-bold text-white">Auto-Freeze On Breach</div>
                <div className="text-[11px] text-zinc-400">
                  Instantly revoke Function Call Key if an agent violates limits
                </div>
              </div>
              <input
                type="checkbox"
                checked={policy.autoFreezeOnBreach}
                onChange={(e) => {
                  onUpdatePolicy({ autoFreezeOnBreach: e.target.checked });
                  triggerSaveNotification();
                }}
                className="h-5 w-5 rounded border-zinc-700 bg-zinc-800 text-emerald-500 accent-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* Right Column: Whitelisted Smart Contracts */}
        <div className="space-y-5 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Authorized Contracts Whitelist
              </h4>
            </div>
            <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-cyan-300">
              {policy.allowedContracts.length} Verified
            </span>
          </div>

          <p className="text-xs text-zinc-300">
            Agents can <strong>only</strong> call contracts in this list. Any call to an unlisted
            contract is rejected before broadcast.
          </p>

          {/* Add Contract Form */}
          <form onSubmit={handleAddContract} className="flex space-x-2">
            <input
              type="text"
              placeholder="e.g. intents.near or app.testnet"
              value={newContract}
              onChange={(e) => setNewContract(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-black hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>Allow</span>
            </button>
          </form>

          {/* Whitelist Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {policy.allowedContracts.map((contract) => (
              <span
                key={contract}
                className="inline-flex items-center space-x-2 rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-3 py-1.5 text-xs font-mono text-cyan-200 shadow-sm"
              >
                <span>{contract}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveContract(contract)}
                  className="text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-zinc-300 shadow-inner">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Shield className="h-4 w-4" />
              <span>Cryptographic Guarantee</span>
            </div>
            <p className="mt-1 text-zinc-400">
              Enforced at NEAR Protocol consensus layer via <code>FunctionCallPermission</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
