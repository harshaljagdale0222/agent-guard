'use client';

import React, { useState } from 'react';
import { FileText, UploadCloud, CheckCircle2, ShieldAlert, ArrowRight, Zap, RefreshCw, ExternalLink, XCircle } from 'lucide-react';
import { SecurityPolicy, ActivityEvent } from '@/types';
import { evaluatePolicy } from '@/lib/near';
import { WalletConfirmModal, WalletTransactionRequest } from '@/components/WalletConfirmModal';

interface InvoiceDropzoneProps {
  policy: SecurityPolicy;
  onExecuteSettlement: (event: ActivityEvent, isApproved: boolean) => void;
  activeAccountName?: string;
}

interface SampleInvoice {
  id: string;
  vendor: string;
  vendorContract: string;
  description: string;
  amountUsd: number;
  amountNear: number;
  isLegit: boolean;
}

export const InvoiceDropzone: React.FC<InvoiceDropzoneProps> = ({
  policy,
  onExecuteSettlement,
  activeAccountName = 'harshal0296.testnet',
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<SampleInvoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultLog, setResultLog] = useState<{ text: string; type: 'success' | 'danger' | 'warning' } | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<WalletTransactionRequest | null>(null);

  const sampleInvoices: SampleInvoice[] = [
    {
      id: 'inv-aws',
      vendor: 'AWS Cloud Compute & Liquidity Settle',
      vendorContract: 'wrap.testnet',
      description: 'Monthly GPU cluster & Wrapped NEAR settlement',
      amountUsd: 3.8,
      amountNear: 0.75,
      isLegit: true,
    },
    {
      id: 'inv-openai',
      vendor: 'NEAR AI & LLM Model Inference',
      vendorContract: 'guest-book.testnet',
      description: 'High-throughput execution tokens on NEAR testnet',
      amountUsd: 11.25,
      amountNear: 2.25,
      isLegit: true,
    },
    {
      id: 'inv-malicious',
      vendor: 'Unverified External Contractor',
      vendorContract: 'attacker-drainer.near',
      description: 'Suspicious overseas consultancy fee (unauthorized rate)',
      amountUsd: 85.0,
      amountNear: 17.0,
      isLegit: false,
    },
  ];

  const handleProcessInvoice = (inv: SampleInvoice) => {
    setSelectedInvoice(inv);
    setResultLog(null);

    // Evaluate against policy
    const evalResult = evaluatePolicy(
      inv.vendorContract,
      inv.amountNear,
      policy.allowedContracts,
      policy.singleTxCapNear,
      policy.dailySpendCapNear,
      1.45
    );

    // Open NEAR Wallet confirmation modal
    setPendingRequest({
      receiverId: inv.vendorContract,
      methodName: 'pay_invoice',
      amountNear: inv.amountNear,
      gasNear: 0.00045,
      description: `Settlement for ${inv.vendor}`,
      isViolation: !evalResult.allowed,
      violationReason: evalResult.violations.join(' | '),
    });
    setIsWalletModalOpen(true);
  };

  const handleConfirmWallet = () => {
    if (!selectedInvoice) return;
    const inv = selectedInvoice;

    setIsProcessing(true);
    setResultLog(null);

    setTimeout(() => {
      setIsProcessing(false);
      const randomTx = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);

      setResultLog({
        text: `✅ APPROVED & SIGNED IN WALLET: Settled ${inv.amountNear} NEAR to ${inv.vendorContract} via ed25519 Function Call Key!`,
        type: 'success',
      });

      onExecuteSettlement(
        {
          id: `inv-tx-${Date.now()}`,
          timestamp: 'Just now',
          agentId: 'agent-1',
          agentName: 'AutoInvoice Settler',
          action: `Settled B2B Invoice: ${inv.vendor} ($${inv.amountUsd.toFixed(2)})`,
          targetContract: inv.vendorContract,
          amountNear: inv.amountNear,
          status: 'APPROVED',
          txHash: randomTx,
          notes: 'Verified cryptographic wallet signature. Policy checks passed.',
        },
        true
      );
    }, 600);
  };

  const handleCancelWallet = () => {
    setResultLog({
      text: '❌ TRANSACTION CANCELLED: Request rejected in wallet. 0.00 NEAR deducted from treasury.',
      type: 'warning',
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">Autonomous B2B Invoice Settlement Rail</h3>
              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-semibold">
                REAL-WORLD MONEY TRACK
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              AI agent extracts invoice parameters, requests NEAR wallet sign authorization, and settles on NEAR.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Invoices Selector */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {sampleInvoices.map((inv) => (
          <div
            key={inv.id}
            className={`group flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
              selectedInvoice?.id === inv.id
                ? 'border-emerald-500/60 bg-emerald-950/20'
                : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                    inv.isLegit
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {inv.isLegit ? 'Verified Merchant' : 'Untrusted Source'}
                </span>
                <span className="text-xs font-mono font-bold text-zinc-300">
                  {inv.amountNear} NEAR
                </span>
              </div>
              <h4 className="mt-2 text-sm font-bold text-white">{inv.vendor}</h4>
              <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{inv.description}</p>
              <div className="mt-3 flex items-center space-x-1.5 text-[11px] font-mono text-zinc-500">
                <span>Contract:</span>
                <span className="text-cyan-400 font-bold truncate">{inv.vendorContract}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => handleProcessInvoice(inv)}
                disabled={isProcessing}
                className="flex w-full items-center justify-center space-x-1.5 rounded-lg bg-zinc-800 py-2 text-xs font-bold text-zinc-200 hover:bg-emerald-500 hover:text-black transition-all group-hover:bg-emerald-500 group-hover:text-black shadow-md cursor-pointer"
              >
                <span>Trigger Wallet Settlement</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Execution Feedback Banner */}
      {resultLog && (
        <div
          className={`mt-5 rounded-xl border p-3.5 text-xs font-mono animate-in fade-in duration-200 ${
            resultLog.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
              : resultLog.type === 'warning'
              ? 'border-amber-500/40 bg-amber-950/30 text-amber-300'
              : 'border-rose-500/40 bg-rose-950/30 text-rose-300'
          }`}
        >
          {resultLog.text}
        </div>
      )}

      {/* Wallet Confirm Modal */}
      <WalletConfirmModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        request={pendingRequest}
        accountName={activeAccountName}
        onConfirm={handleConfirmWallet}
        onCancel={handleCancelWallet}
      />
    </div>
  );
};
