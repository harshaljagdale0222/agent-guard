'use client';

import React, { useState } from 'react';
import { Bot, Key, Pause, Play, Plus, Shield, Clock, Cpu } from 'lucide-react';
import { Agent } from '@/types';
import { generateAgentKeyPair } from '@/lib/near';

interface AgentListProps {
  agents: Agent[];
  onToggleAgentStatus: (agentId: string) => void;
  onAddAgent: (agent: Omit<Agent, 'id' | 'totalExecutions' | 'lastActive' | 'spentTodayNear'>) => void;
}

export const AgentList: React.FC<AgentListProps> = ({
  agents,
  onToggleAgentStatus,
  onAddAgent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentAllowance, setNewAgentAllowance] = useState('5.0');
  const [selectedContracts, setSelectedContracts] = useState<string[]>([
    'intents.near',
    'wrap.testnet',
  ]);

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentRole) return;

    const keypair = generateAgentKeyPair();
    const generatedKey = keypair.publicKey;

    onAddAgent({
      name: newAgentName,
      role: newAgentRole,
      publicKey: generatedKey,
      status: 'active',
      dailyAllowanceNear: parseFloat(newAgentAllowance) || 5.0,
      allowedContracts: selectedContracts,
    });

    setNewAgentName('');
    setNewAgentRole('');
    setNewAgentAllowance('5.0');
    setIsModalOpen(false);
  };

  const agentColorProfiles = [
    {
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      gradient: 'from-emerald-950/30 via-zinc-900/90 to-zinc-950',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      accentText: 'text-emerald-400',
      progress: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    },
    {
      border: 'border-cyan-500/30 hover:border-cyan-500/60',
      gradient: 'from-cyan-950/30 via-zinc-900/90 to-zinc-950',
      iconBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      accentText: 'text-cyan-400',
      progress: 'bg-gradient-to-r from-cyan-500 to-blue-400',
    },
    {
      border: 'border-violet-500/30 hover:border-violet-500/60',
      gradient: 'from-violet-950/30 via-zinc-900/90 to-zinc-950',
      iconBg: 'bg-violet-500/15 border-violet-500/30 text-violet-400',
      accentText: 'text-violet-400',
      progress: 'bg-gradient-to-r from-violet-500 to-purple-400',
    },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="text-lg font-bold text-white">Delegated AI Agents &amp; Keys</h3>
            <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-mono font-semibold text-zinc-300">
              {agents.length} Provisioned
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Agents transact autonomously using restricted NEAR Function Call Keys with strict spending caps.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/15 hover:from-emerald-400 hover:to-teal-400 transition-all hover:scale-[1.02] whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span>Provision New Agent</span>
        </button>
      </div>

      {/* Agents Grid - Responsive & Roomy */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent, index) => {
          const profile = agentColorProfiles[index % agentColorProfiles.length];
          const spendPercent = Math.min(
            100,
            Math.round((agent.spentTodayNear / agent.dailyAllowanceNear) * 100)
          );

          // Clean key formatter: ed25519:6V87Qk...62hQfK
          const formattedKey = agent.publicKey.length > 20
            ? `${agent.publicKey.slice(0, 14)}...${agent.publicKey.slice(-6)}`
            : agent.publicKey;

          return (
            <div
              key={agent.id}
              className={`relative flex flex-col justify-between rounded-2xl border bg-gradient-to-b p-5 shadow-lg backdrop-blur-xl transition-all duration-300 overflow-hidden min-w-0 ${
                agent.status === 'active'
                  ? `${profile.border} ${profile.gradient}`
                  : 'border-zinc-800/50 bg-zinc-950/60 opacity-60'
              }`}
            >
              <div className="min-w-0">
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-md ${profile.iconBg}`}
                    >
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{agent.name}</h4>
                      <p className="text-[11px] text-zinc-400 truncate">{agent.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleAgentStatus(agent.id)}
                    title={agent.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
                    className={`shrink-0 rounded-xl border p-2 transition-all ${
                      agent.status === 'active'
                        ? 'border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:border-amber-500 hover:text-amber-400 hover:bg-amber-950/20'
                        : 'border-emerald-600 bg-emerald-950/50 text-emerald-400 hover:bg-emerald-900/60'
                    }`}
                  >
                    {agent.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Key & Status (Fixed to prevent wrapping/overflow glitches) */}
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-800/60 pt-3 text-[11px] min-w-0">
                  <div className="flex items-center space-x-1.5 font-mono text-zinc-400 min-w-0">
                    <Key className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                    <span className="text-zinc-300 truncate" title={agent.publicKey}>
                      {formattedKey}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      agent.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        agent.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
                      }`}
                    ></span>
                    <span>{agent.status === 'active' ? 'OPERATIONAL' : 'PAUSED'}</span>
                  </span>
                </div>

                {/* Daily Spend Allowance Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400 font-medium">Daily Allowance</span>
                    <span className="font-mono text-white font-semibold">
                      {agent.spentTodayNear.toFixed(2)}{' '}
                      <span className="text-zinc-400 font-normal">
                        / {agent.dailyAllowanceNear.toFixed(1)} NEAR
                      </span>
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-800/80 border border-zinc-700/40">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${profile.progress}`}
                      style={{ width: `${spendPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Whitelisted Scope */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Cryptographically Allowed Calls
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
                    {agent.allowedContracts.map((contract) => (
                      <span
                        key={contract}
                        className="rounded-lg border border-zinc-800 bg-zinc-950/90 px-2 py-0.5 text-[10px] font-mono text-zinc-300 shadow-sm"
                      >
                        {contract}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Meta */}
              <div className="mt-5 flex items-center justify-between border-t border-zinc-800/60 pt-3 text-[11px] text-zinc-400 font-mono">
                <span className="flex items-center space-x-1">
                  <Cpu className="h-3 w-3 text-zinc-500 shrink-0" />
                  <span>{agent.totalExecutions} executions</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-zinc-500 shrink-0" />
                  <span>{agent.lastActive}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Provision Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-900 to-[#09090b] p-6 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Provision Autonomous Agent</h3>
                <p className="text-xs text-zinc-400">Generate a sandboxed NEAR Function Call Access Key</p>
              </div>
            </div>

            <form onSubmit={handleCreateAgent} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-200">Agent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subscriptions Manager"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-200">Role &amp; Task Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pays SaaS and cloud server invoices"
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-200">
                  Daily Spend Allowance (NEAR)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="50"
                  required
                  value={newAgentAllowance}
                  onChange={(e) => setNewAgentAllowance(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-xs font-mono text-zinc-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400"
                >
                  Generate Key &amp; Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
