'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { AgentList } from '@/components/AgentList';
import { PolicyEngine } from '@/components/PolicyEngine';
import { ActivityLog } from '@/components/ActivityLog';
import { SimulatorModal } from '@/components/SimulatorModal';
import { NetworkVisualizer } from '@/components/NetworkVisualizer';
import { LiveOnChainInspector } from '@/components/LiveOnChainInspector';
import { InvoiceDropzone } from '@/components/InvoiceDropzone';
import { TelegramAlertConfig } from '@/components/TelegramAlertConfig';
import { ThreatRadarModal } from '@/components/ThreatRadarModal';
import { TreasuryModal } from '@/components/TreasuryModal';
import {
  initialAgents,
  initialPolicy,
  initialActivities,
  initialMetrics,
} from '@/lib/mock-data';
import { Agent, SecurityPolicy, ActivityEvent } from '@/types';
import { LiveNearAccount, LiveAccessKey, fetchLiveNearAccount } from '@/lib/near-rpc';
import {
  Play,
  Sparkles,
  Shield,
  Cpu,
  Activity,
  Sliders,
  Database,
  FileText,
  Smartphone,
  ShieldAlert,
} from 'lucide-react';

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [policy, setPolicy] = useState<SecurityPolicy>(initialPolicy);
  const [activities, setActivities] = useState<ActivityEvent[]>(initialActivities);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [activeAccountName, setActiveAccountName] = useState('treasury.agentguard.testnet');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isThreatRadarOpen, setIsThreatRadarOpen] = useState(false);
  const [isTreasuryOpen, setIsTreasuryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'network' | 'invoicing' | 'telegram' | 'onchain' | 'agents' | 'policy' | 'audit'
  >('network');

  const scrollToTabs = () => {
    setTimeout(() => {
      const el = document.getElementById('tab-navigation-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Listen for dApp redirect authorization query params from Meteor or MyNearWallet
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const accountId = params.get('account_id');
      if (accountId) {
        fetchLiveNearAccount(accountId).then((acc: LiveNearAccount | null) => {
          handleConnectWallet(accountId, acc?.amountNear || 7.0);
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      }
    }
  }, []);

  // Emergency Freeze Toggle
  const handleToggleEmergencyFreeze = () => {
    const newFreeze = !policy.emergencyFrozen;
    setPolicy((prev) => ({ ...prev, emergencyFrozen: newFreeze }));

    setAgents((prev) =>
      prev.map((a) => ({
        ...a,
        status: newFreeze ? 'paused' : 'active',
      }))
    );
  };

  // Agent Status Toggle
  const handleToggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a))
    );
  };

  // Add New Agent
  const handleAddAgent = (
    newAgentData: Omit<Agent, 'id' | 'totalExecutions' | 'lastActive' | 'spentTodayNear'>
  ) => {
    const newAgent: Agent = {
      ...newAgentData,
      id: `agent-${Date.now()}`,
      spentTodayNear: 0,
      totalExecutions: 0,
      lastActive: 'Just registered',
    };
    setAgents((prev) => [newAgent, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      activeAgentsCount: prev.activeAgentsCount + 1,
    }));
  };

  // Update Policy
  const handleUpdatePolicy = (updated: Partial<SecurityPolicy>) => {
    setPolicy((prev) => ({ ...prev, ...updated }));
  };

  // Handle Connect Wallet via Modal
  const handleConnectWallet = (accountId: string, balanceNear: number) => {
    setActiveAccountName(accountId);
    setIsWalletConnected(true);

    if (balanceNear > 0) {
      setMetrics((prev) => ({
        ...prev,
        totalBalanceNear: balanceNear,
      }));
    }

    setActivities((prev) => [
      {
        id: `wallet-conn-${Date.now()}`,
        timestamp: 'Just now',
        agentId: 'user',
        agentName: 'Wallet Connector',
        action: `Connected NEAR Wallet: "${accountId}"`,
        targetContract: 'near-wallet',
        amountNear: balanceNear,
        status: 'APPROVED',
        txHash: `conn_${Date.now().toString(36)}`,
        notes: `Wallet linked. Live on-chain balance synchronized (${balanceNear.toFixed(2)} NEAR).`,
      },
      ...prev,
    ]);
  };

  // Handle Disconnect Wallet
  const handleDisconnectWallet = () => {
    setIsWalletConnected(false);
    setActiveAccountName('treasury.agentguard.testnet');
    setMetrics((prev) => ({
      ...prev,
      totalBalanceNear: initialMetrics.totalBalanceNear,
    }));
  };

  // Sync with real on-chain account from NEAR RPC
  const handleSyncWithLiveAccount = (liveAcc: LiveNearAccount, liveKeys: LiveAccessKey[]) => {
    handleConnectWallet(liveAcc.accountId, liveAcc.amountNear);

    const functionKeys = liveKeys.filter((k) => k.permissionType === 'FunctionCall');
    if (functionKeys.length > 0) {
      const realAgents: Agent[] = functionKeys.map((k, idx) => ({
        id: `onchain-agent-${idx}`,
        name: `On-Chain Agent #${idx + 1}`,
        role: `Restricted receiver: ${k.receiverId || 'Custom Contract'}`,
        publicKey: k.publicKey,
        status: 'active',
        dailyAllowanceNear: k.allowanceNear || 10.0,
        spentTodayNear: 0,
        allowedContracts: k.receiverId ? [k.receiverId] : ['cloud-billing.testnet'],
        totalExecutions: k.nonce,
        lastActive: 'Verified on-chain',
      }));
      setAgents(realAgents);
      setMetrics((prev) => ({
        ...prev,
        activeAgentsCount: realAgents.length,
      }));
    }
  };

  // Simulation execution callback
  const handleExecuteSimulation = (event: ActivityEvent, isApproved: boolean) => {
    setActivities((prev) => [event, ...prev]);

    if (isApproved) {
      setMetrics((prev) => ({
        ...prev,
        totalBalanceNear: Math.max(0, prev.totalBalanceNear - event.amountNear),
        dailySpendUsedNear: prev.dailySpendUsedNear + event.amountNear,
      }));

      setAgents((prev) =>
        prev.map((a) =>
          a.id === event.agentId
            ? {
                ...a,
                spentTodayNear: a.spentTodayNear + event.amountNear,
                totalExecutions: a.totalExecutions + 1,
                lastActive: 'Just now',
              }
            : a
        )
      );
    } else {
      setMetrics((prev) => ({
        ...prev,
        blockedAttemptsCount: prev.blockedAttemptsCount + 1,
      }));

      if (policy.autoFreezeOnBreach) {
        setAgents((prev) =>
          prev.map((a) => (a.id === event.agentId ? { ...a, status: 'paused' } : a))
        );
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060709] bg-mesh-grid text-zinc-100 flex flex-col">
      {/* Top Header with Connect Wallet button and live active account */}
      <Header
        emergencyFrozen={policy.emergencyFrozen}
        onToggleEmergencyFreeze={handleToggleEmergencyFreeze}
        treasuryBalance={metrics.totalBalanceNear}
        activeAccountName={activeAccountName}
        isWalletConnected={isWalletConnected}
        onConnectAccount={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Hackathon Demo Hero Ribbon with Rich Color & Ambient Glow */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900/90 to-cyan-950/40 p-7 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -top-12 -left-12 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                  <span>NEAR HACKATHON 2026</span>
                </span>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-mono text-cyan-300">
                  Track: Security &bull; Business &bull; Agents &bull; Real-World
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Cryptographic Guardrails for the{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Autonomous Agent Economy
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                Empowering AI agents to autonomously execute micropayments, SaaS subscriptions, and
                invoicing on NEAR Protocol — bounded by zero-trust human policies and Function Call Keys.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsThreatRadarOpen(true)}
                className="inline-flex items-center justify-center space-x-2 rounded-2xl border border-rose-500/40 bg-rose-950/30 px-4 py-3 text-xs font-bold text-rose-300 hover:bg-rose-950/60 transition-all hover:scale-[1.02]"
              >
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span>AI Threat Radar</span>
              </button>

              <button
                onClick={() => setIsSimulatorOpen(true)}
                className="inline-flex items-center justify-center space-x-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-black shadow-xl shadow-emerald-500/25 hover:from-emerald-300 hover:to-teal-400 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Launch Live Simulator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <StatsOverview
          metrics={metrics}
          emergencyFrozen={policy.emergencyFrozen}
          onClickTreasury={() => setIsTreasuryOpen(true)}
          onClickAgents={() => {
            setActiveTab('agents');
            scrollToTabs();
          }}
          onClickDailySpend={() => {
            setActiveTab('policy');
            scrollToTabs();
          }}
          onClickPolicyShield={() => setIsThreatRadarOpen(true)}
        />

        {/* Tab Navigation with Vibrant Active Indicators */}
        <div id="tab-navigation-section" className="border-b border-zinc-800 scroll-mt-6">
          <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('network')}
              className={`flex items-center space-x-2 pb-3.5 px-3 text-xs font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'network'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Pipeline &amp; Swarm</span>
            </button>

            <button
              onClick={() => setActiveTab('invoicing')}
              className={`flex items-center space-x-2 pb-3.5 px-3 text-xs font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'invoicing'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>B2B Invoicing (Real-World)</span>
            </button>

            <button
              onClick={() => setActiveTab('telegram')}
              className={`flex items-center space-x-2 pb-3.5 px-3 text-xs font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'telegram'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>Telegram Alerts</span>
            </button>

            <button
              onClick={() => setActiveTab('onchain')}
              className={`flex items-center space-x-2 pb-3.5 px-3 text-xs font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'onchain'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Database className="h-4 w-4" />
              <span>On-Chain RPC (Real)</span>
            </button>

            <button
              onClick={() => setActiveTab('agents')}
              className={`flex items-center space-x-2 pb-3.5 px-3 text-xs font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'agents'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>Delegated Agents ({agents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('policy')}
              className={`flex items-center space-x-2 pb-3.5 px-3 text-xs font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'policy'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>Policy Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 pb-3.5 px-3 text-xs font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'audit'
                  ? 'border-violet-400 text-violet-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Audit Trail ({activities.length})</span>
            </button>
          </nav>
        </div>

        {/* Tab 1: Live Architecture Pipeline & Swarm */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <NetworkVisualizer
              emergencyFrozen={policy.emergencyFrozen}
              allowedContracts={policy.allowedContracts}
            />
            <InvoiceDropzone policy={policy} onExecuteSettlement={handleExecuteSimulation} />
            <AgentList
              agents={agents}
              onToggleAgentStatus={handleToggleAgentStatus}
              onAddAgent={handleAddAgent}
            />
            <PolicyEngine policy={policy} onUpdatePolicy={handleUpdatePolicy} />
            <ActivityLog activities={activities.slice(0, 5)} />
          </div>
        )}

        {/* Tab 2: B2B Invoicing */}
        {activeTab === 'invoicing' && (
          <div className="space-y-6">
            <InvoiceDropzone policy={policy} onExecuteSettlement={handleExecuteSimulation} />
            <ActivityLog activities={activities} />
          </div>
        )}

        {/* Tab 3: Telegram Alerts */}
        {activeTab === 'telegram' && (
          <div className="space-y-6">
            <TelegramAlertConfig />
          </div>
        )}

        {/* Tab 4: Live On-Chain Inspector */}
        {activeTab === 'onchain' && (
          <div className="space-y-6">
            <LiveOnChainInspector onSyncWithLiveAccount={handleSyncWithLiveAccount} />
          </div>
        )}

        {/* Tab 5: Agents */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <AgentList
              agents={agents}
              onToggleAgentStatus={handleToggleAgentStatus}
              onAddAgent={handleAddAgent}
            />
            <ActivityLog activities={activities.slice(0, 5)} />
          </div>
        )}

        {/* Tab 6: Policy Engine */}
        {activeTab === 'policy' && (
          <PolicyEngine policy={policy} onUpdatePolicy={handleUpdatePolicy} />
        )}

        {/* Tab 7: Full Audit Trail */}
        {activeTab === 'audit' && <ActivityLog activities={activities} />}
      </main>

      {/* Simulator Modal */}
      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        policy={policy}
        agents={agents}
        onExecuteSimulation={handleExecuteSimulation}
      />

      {/* Threat Radar Modal */}
      <ThreatRadarModal
        isOpen={isThreatRadarOpen}
        onClose={() => setIsThreatRadarOpen(false)}
      />

      {/* Treasury Vault Breakdown Modal */}
      <TreasuryModal
        isOpen={isTreasuryOpen}
        onClose={() => setIsTreasuryOpen(false)}
        metrics={metrics}
        activeAccount={isWalletConnected ? activeAccountName : null}
        onNavigateToInvoicing={() => {
          setActiveTab('invoicing');
          scrollToTabs();
        }}
      />

      {/* High-End Minimalist Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-[#060709]/90 py-6 text-xs text-zinc-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
            <span className="font-bold text-zinc-200">AgentGuard Protocol</span>
            <span>&bull; Built for NEAR Hackathon 2026</span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span className="text-emerald-400 font-semibold">RPC: testnet.near.org</span>
            <span className="text-zinc-700">|</span>
            <a
              href="https://docs.near.org/concepts/basics/accounts/access-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              NEAR Access Keys Documentation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
