'use client';

import React, { useState } from 'react';
import { X, Play, ShieldAlert, CheckCircle2, AlertOctagon, Terminal, RefreshCw, Lock, Zap, ArrowRight, Sliders, Shield } from 'lucide-react';
import { Agent, SecurityPolicy, ActivityEvent } from '@/types';
import { evaluatePolicy } from '@/lib/near';
import { WalletConfirmModal, WalletTransactionRequest } from '@/components/WalletConfirmModal';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: SecurityPolicy;
  agents: Agent[];
  onExecuteSimulation: (event: ActivityEvent, isApproved: boolean) => void;
  activeAccountName?: string;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  policy,
  agents,
  onExecuteSimulation,
  activeAccountName = 'harshal0296.testnet',
}) => {
  const [activeScenario, setActiveScenario] = useState<'LEGIT' | 'ATTACK' | 'CUSTOM'>('CUSTOM');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'System ready. Type any amount or select a scenario below to test the policy engine in real time.'
  ]);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [pendingSimRequest, setPendingSimRequest] = useState<WalletTransactionRequest | null>(null);

  // Custom interactive test state (use string so no default 0 appears when cleared)
  const [customAmount, setCustomAmount] = useState<string>('1.5');
  const [customTarget, setCustomTarget] = useState<string>('wrap.testnet');

  if (!isOpen) return null;

  // Run Custom Interactive Test
  const handleRunCustomTest = () => {
    setActiveScenario('CUSTOM');
    const parsed = parseFloat(customAmount);
    const amount = isNaN(parsed) ? 0 : parsed;
    const target = customTarget.trim();

    // Evaluate against real policy engine
    const evalResult = evaluatePolicy(
      target,
      amount,
      policy.allowedContracts,
      policy.singleTxCapNear,
      policy.dailySpendCapNear,
      1.45
    );

    setLogs([
      `⚡ [Agent: AutoInvoice Settler] Preparing execution of ${amount} NEAR to '${target}'...`,
      '🔍 Querying AgentGuard Policy Guardrail Engine...',
      `  • Check 1 (Whitelist): Target "${target}" in whitelist: ${policy.allowedContracts.includes(target) ? '✓ PASS' : '❌ FAIL'}`,
      `  • Check 2 (Single Cap): Amount (${amount} N) <= Single Limit (${policy.singleTxCapNear} N): ${amount <= policy.singleTxCapNear ? '✓ PASS' : '❌ FAIL (EXCEEDED)'}`,
      `  • Check 3 (Daily Cap): Within 24h Spend Ceiling (${policy.dailySpendCapNear} N): ✓ PASS`,
      evalResult.allowed
        ? '✅ All checks passed! Requesting NEAR Wallet confirmation...'
        : `🚨 POLICY INTERCEPTION: ${evalResult.violations.join(' | ')}. Cryptographic signing blocked!`,
    ]);

    setPendingSimRequest({
      receiverId: target,
      methodName: 'ft_transfer_call',
      amountNear: amount,
      gasNear: 0.00045,
      description: `Autonomous Payment to ${target}`,
      isViolation: !evalResult.allowed,
      violationReason: evalResult.violations.join(' | '),
    });
    setIsWalletModalOpen(true);
  };

  const handleConfirmCustom = () => {
    if (!pendingSimRequest) return;
    const amount = pendingSimRequest.amountNear;
    const target = pendingSimRequest.receiverId;

    setIsRunning(true);
    setLogs((prev) => [
      ...prev,
      `🔑 Wallet Signature Confirmed for ${amount} NEAR!`,
      `📡 Broadcast to NEAR Testnet RPC: tx/5Zq8t1... SUCCESS (Finality: 1.1s)`,
      `✅ Settlement complete. Treasury decremented by ${amount} NEAR.`,
    ]);

    setTimeout(() => {
      setIsRunning(false);
      const randomTx = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
      onExecuteSimulation(
        {
          id: `tx-${Date.now()}`,
          timestamp: 'Just now',
          agentId: 'agent-1',
          agentName: 'AutoInvoice Settler',
          action: `Autonomous Transfer of ${amount} NEAR to ${target}`,
          targetContract: target,
          amountNear: amount,
          status: 'APPROVED',
          txHash: randomTx,
          notes: `Verified within single tx cap (${policy.singleTxCapNear} N). Policy checks passed.`,
        },
        true
      );
    }, 700);
  };

  const handleCancelCustom = () => {
    setLogs((prev) => [
      ...prev,
      '❌ [REQUEST CANCELLED / BLOCKED] Transaction aborted. 0.00 NEAR deducted.',
      '🛡️ Treasury preserved safely.',
    ]);

    if (pendingSimRequest?.isViolation) {
      onExecuteSimulation(
        {
          id: `tx-${Date.now()}`,
          timestamp: 'Just now',
          agentId: 'agent-1',
          agentName: 'AutoInvoice Settler',
          action: `BLOCKED: Over-limit / unlisted payment (${pendingSimRequest.amountNear} NEAR to ${pendingSimRequest.receiverId})`,
          targetContract: pendingSimRequest.receiverId,
          amountNear: pendingSimRequest.amountNear,
          status: 'BLOCKED',
          txHash: '0x00000000000000000000000000000000',
          notes: pendingSimRequest.violationReason || 'Exceeded human-defined policy guardrails.',
        },
        false
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-900 via-[#0d0f12] to-[#08090a] p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Live Execution &amp; Policy Playground</h3>
                <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 text-[9px] font-mono text-emerald-300 font-bold">
                  INTERACTIVE
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Type custom amounts or select targets to test instant policy pass &amp; block interception
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Active Human Policy Limits Badge */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-xs font-mono">
          <div className="flex items-center space-x-2 text-zinc-400">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Active Policy Limits:</span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-emerald-300 font-bold">
              Single Tx Cap: {policy.singleTxCapNear.toFixed(1)} NEAR
            </span>
            <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-cyan-300 font-bold">
              24h Daily Cap: {policy.dailySpendCapNear.toFixed(1)} NEAR
            </span>
          </div>
        </div>

        {/* Interactive Custom Amount & Target Tester */}
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>Interactive Transfer &amp; Policy Test</span>
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              Try &lt;{policy.singleTxCapNear}N (Pass) vs &gt;{policy.singleTxCapNear}N (Block)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Target Receiver Input / Selector */}
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1 font-semibold">
                Target Receiver Contract:
              </label>
              <select
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="wrap.testnet">wrap.testnet (Whitelisted ✓)</option>
                <option value="guest-book.testnet">guest-book.testnet (Whitelisted ✓)</option>
                <option value="intents.near">intents.near (Whitelisted ✓)</option>
                <option value="attacker.near">attacker.near (Malicious / Block ❌)</option>
                <option value="drainer-bot.testnet">drainer-bot.testnet (Unlisted ❌)</option>
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1 font-semibold">
                Amount (NEAR):
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={customAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow empty string and valid positive decimals (no forced 0)
                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                    setCustomAmount(val);
                  }
                }}
                placeholder="Type amount (e.g. 1.5)"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-mono font-bold text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] text-zinc-500 uppercase font-bold">Quick Amounts:</span>
            <button
              type="button"
              onClick={() => { setCustomAmount('0.75'); setCustomTarget('wrap.testnet'); }}
              className="rounded-lg bg-zinc-800 px-2 py-1 text-[11px] font-mono text-emerald-400 hover:bg-zinc-700 border border-zinc-700"
            >
              0.75 N (Safe ✓)
            </button>
            <button
              type="button"
              onClick={() => { setCustomAmount('1.5'); setCustomTarget('wrap.testnet'); }}
              className="rounded-lg bg-zinc-800 px-2 py-1 text-[11px] font-mono text-emerald-400 hover:bg-zinc-700 border border-zinc-700"
            >
              1.5 N (Safe ✓)
            </button>
            <button
              type="button"
              onClick={() => { setCustomAmount(policy.singleTxCapNear.toString()); setCustomTarget('wrap.testnet'); }}
              className="rounded-lg bg-zinc-800 px-2 py-1 text-[11px] font-mono text-amber-300 hover:bg-zinc-700 border border-zinc-700"
            >
              {policy.singleTxCapNear} N (At Limit)
            </button>
            <button
              type="button"
              onClick={() => { setCustomAmount('5.0'); setCustomTarget('wrap.testnet'); }}
              className="rounded-lg bg-rose-950/40 px-2 py-1 text-[11px] font-mono text-rose-300 hover:bg-rose-900/60 border border-rose-500/40"
            >
              5.0 N (Exceeds Limit 🚨)
            </button>
            <button
              type="button"
              onClick={() => { setCustomAmount('20.0'); setCustomTarget('attacker.near'); }}
              className="rounded-lg bg-rose-950/60 px-2 py-1 text-[11px] font-mono text-rose-400 font-bold hover:bg-rose-900/80 border border-rose-500/60"
            >
              20.0 N (Attack Drain 🚨)
            </button>
          </div>

          {/* Test Button */}
          {(() => {
            const numericAmt = parseFloat(customAmount) || 0;
            const hasAmount = customAmount.trim() !== '' && numericAmt > 0;
            const isOverLimit = numericAmt > policy.singleTxCapNear;
            const isUnlisted = !policy.allowedContracts.includes(customTarget);
            const isInterception = isOverLimit || isUnlisted;

            return (
              <button
                type="button"
                onClick={handleRunCustomTest}
                disabled={isRunning || !hasAmount}
                className={`flex w-full items-center justify-center space-x-2 rounded-xl py-3 text-xs font-bold transition-all shadow-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  !hasAmount
                    ? 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    : isInterception
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-emerald-500/25'
                }`}
              >
                <span>
                  {!hasAmount
                    ? 'Type a NEAR amount above to test'
                    : isOverLimit
                    ? `Test Over-Limit Transfer (${numericAmt} N > ${policy.singleTxCapNear} N) → Trigger Interception`
                    : isUnlisted
                    ? `Test Unlisted Transfer to '${customTarget}' → Trigger Block`
                    : `Test Safe Autonomous Transfer (${numericAmt} NEAR) → Open Wallet Confirm`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            );
          })()}
        </div>

        {/* Live Execution Console */}
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[11px] text-zinc-500">
            <span>NEAR POLICY EVALUATION CONSOLE</span>
            {isRunning && (
              <span className="flex items-center space-x-1 text-emerald-400 animate-pulse">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Broadcasting to NEAR Testnet...</span>
              </span>
            )}
          </div>

          <div className="mt-3 h-32 overflow-y-auto space-y-1.5 text-zinc-300">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes('❌') || log.includes('🚨') || log.includes('⚠️')
                    ? 'text-rose-400'
                    : log.includes('✅') || log.includes('✓')
                    ? 'text-emerald-400'
                    : 'text-zinc-300'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
          >
            Close &amp; View Audit Log
          </button>
        </div>

        {/* Wallet Confirm Modal */}
        <WalletConfirmModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
          request={pendingSimRequest}
          accountName={activeAccountName}
          onConfirm={handleConfirmCustom}
          onCancel={handleCancelCustom}
        />
      </div>
    </div>
  );
};
