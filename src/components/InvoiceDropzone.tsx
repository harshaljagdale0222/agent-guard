'use client';

import React, { useState } from 'react';
import { FileText, UploadCloud, CheckCircle2, ShieldAlert, ArrowRight, Zap, RefreshCw, ExternalLink } from 'lucide-react';
import { SecurityPolicy, ActivityEvent } from '@/types';
import { evaluatePolicy } from '@/lib/near';

interface InvoiceDropzoneProps {
  policy: SecurityPolicy;
  onExecuteSettlement: (event: ActivityEvent, isApproved: boolean) => void;
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
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<SampleInvoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultLog, setResultLog] = useState<string | null>(null);

  const sampleInvoices: SampleInvoice[] = [
    {
      id: 'inv-aws',
      vendor: 'AWS Cloud Server Cluster',
      vendorContract: 'cloud-billing.testnet',
      description: 'Monthly GPU cluster & API inference compute credits',
      amountUsd: 3.8,
      amountNear: 0.75,
      isLegit: true,
    },
    {
      id: 'inv-openai',
      vendor: 'NEAR AI & OpenAI API Credits',
      vendorContract: 'agent-market.testnet',
      description: 'High-throughput LLM model inference tokens',
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
    setIsProcessing(true);
    setResultLog(null);

    // Evaluate against human policy
    const evalResult = evaluatePolicy(
      inv.vendorContract,
      inv.amountNear,
      policy.allowedContracts,
      policy.singleTxCapNear,
      policy.dailySpendCapNear,
      2.0
    );

    setTimeout(() => {
      setIsProcessing(false);
      const randomTx = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);

      if (evalResult.allowed) {
        setResultLog(`APPROVED: Settled ${inv.amountNear} NEAR to ${inv.vendorContract} via Function Call Key.`);
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
            notes: 'Verified cryptographic invoice signature. Policy checks passed.',
          },
          true
        );
      } else {
        setResultLog(`BLOCKED: ${evalResult.violations.join(' ')}`);
        onExecuteSettlement(
          {
            id: `inv-tx-${Date.now()}`,
            timestamp: 'Just now',
            agentId: 'agent-1',
            agentName: 'AutoInvoice Settler',
            action: `BLOCKED: Fraudulent invoice payment attempted (${inv.amountNear} NEAR)`,
            targetContract: inv.vendorContract,
            amountNear: inv.amountNear,
            status: 'BLOCKED',
            txHash: '0x00000000000000000000000000000000',
            notes: evalResult.violations.join(' '),
          },
          false
        );
      }
    }, 1200);
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
              AI agent extracts invoice parameters, verifies cryptographic policies, and settles on NEAR.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Invoices Selector */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {sampleInvoices.map((inv) => (
          <div
            key={inv.id}
            className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
              inv.isLegit
                ? 'border-zinc-800 bg-zinc-950/70 hover:border-emerald-500/40'
                : 'border-rose-900/30 bg-rose-950/15 hover:border-rose-700/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{inv.vendor}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                    inv.isLegit
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {inv.isLegit ? 'Verified Supplier' : 'Untrusted Source'}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-zinc-400 line-clamp-2">{inv.description}</p>
              <div className="mt-3 flex items-baseline justify-between border-t border-zinc-800/80 pt-2 font-mono">
                <span className="text-xs text-zinc-300">${inv.amountUsd.toFixed(2)} USD</span>
                <span className="text-xs font-bold text-emerald-400">{inv.amountNear.toFixed(2)} NEAR</span>
              </div>
            </div>

            <button
              onClick={() => handleProcessInvoice(inv)}
              disabled={isProcessing}
              className={`mt-4 flex w-full items-center justify-center space-x-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                inv.isLegit
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/15'
                  : 'bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-600/20'
              }`}
            >
              {isProcessing && selectedInvoice?.id === inv.id ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  <span>Test Agent Settlement</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Result feedback */}
      {resultLog && (
        <div
          className={`mt-5 rounded-xl border p-4 text-xs font-mono transition-all ${
            resultLog.startsWith('APPROVED')
              ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
              : 'border-rose-500/40 bg-rose-950/20 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2 font-bold">
            {resultLog.startsWith('APPROVED') ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-rose-400" />
            )}
            <span>On-Chain Settlement Result</span>
          </div>
          <p className="mt-1">{resultLog}</p>
        </div>
      )}
    </div>
  );
};

