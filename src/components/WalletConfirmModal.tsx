'use client';

import React, { useState } from 'react';
import { Shield, X, AlertTriangle, CheckCircle2, ArrowRight, Lock, Key, Zap, RefreshCw } from 'lucide-react';

export interface WalletTransactionRequest {
  receiverId: string;
  methodName?: string;
  amountNear: number;
  gasNear?: number;
  description: string;
  isViolation?: boolean;
  violationReason?: string;
}

interface WalletConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: WalletTransactionRequest | null;
  accountName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const WalletConfirmModal: React.FC<WalletConfirmModalProps> = ({
  isOpen,
  onClose,
  request,
  accountName,
  onConfirm,
  onCancel,
}) => {
  const [isSigning, setIsSigning] = useState(false);

  if (!isOpen || !request) return null;

  const gas = request.gasNear || 0.00045;
  const isBlocked = !!request.isViolation;

  const handleApprove = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      onConfirm();
      onClose();
    }, 700);
  };

  const handleReject = () => {
    onCancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-900 via-[#0d0f12] to-[#07080a] p-6 shadow-2xl shadow-black/80">
        {/* Glow */}
        <div
          className={`absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full blur-3xl pointer-events-none ${
            isBlocked ? 'bg-rose-500/20' : 'bg-emerald-500/15'
          }`}
        ></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-md">
              ☄️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">NEAR Wallet Sign Request</h3>
                <span className="rounded bg-zinc-800 border border-zinc-700 px-1.5 py-0.2 text-[9px] font-mono text-zinc-300">
                  TESTNET
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400 truncate max-w-[220px]">
                {accountName}
              </p>
            </div>
          </div>
          <button
            onClick={handleReject}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Alert Banner */}
        {isBlocked ? (
          <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-300 flex items-start space-x-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-200">Policy Breach Intercepted!</div>
              <div className="mt-0.5 text-[11px] text-rose-300/90 leading-tight">
                {request.violationReason || 'Contract not in whitelist or single transaction limit exceeded.'}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-medium">Policy Shield: Verified Within 24h Spend Cap</span>
            </div>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
              SAFE
            </span>
          </div>
        )}

        {/* Transaction Parameters Card */}
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
            <span className="text-zinc-500 font-sans text-[11px]">Action</span>
            <span className="font-semibold text-zinc-200">
              {request.methodName ? `${request.methodName}()` : 'FunctionCall Settlement'}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
            <span className="text-zinc-500 font-sans text-[11px]">Receiver Contract</span>
            <span className="font-bold text-cyan-300 truncate max-w-[200px]">
              {request.receiverId}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
            <span className="text-zinc-500 font-sans text-[11px]">Signing Key</span>
            <span className="text-[11px] text-zinc-400 flex items-center space-x-1">
              <Key className="h-3 w-3 text-emerald-400" />
              <span>ed25519 Function Call</span>
            </span>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="text-zinc-400 font-sans text-xs font-semibold">Total Amount</span>
            <div className="text-right">
              <span className={`text-xl font-black ${isBlocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                {request.amountNear.toFixed(2)} NEAR
              </span>
              <div className="text-[10px] text-zinc-500">
                ≈ ${(request.amountNear * 5.1).toFixed(2)} USD
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
            <span>Estimated Network Gas Fee</span>
            <span>{gas.toFixed(5)} NEAR (&lt;$0.001)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleReject}
            disabled={isSigning}
            className="flex items-center justify-center space-x-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5 text-rose-400" />
            <span>Cancel Request</span>
          </button>

          {isBlocked ? (
            <button
              type="button"
              disabled
              className="flex items-center justify-center space-x-1.5 rounded-xl bg-rose-600/30 border border-rose-500/50 py-2.5 text-xs font-bold text-rose-300 cursor-not-allowed opacity-60"
            >
              <Lock className="h-3.5 w-3.5 text-rose-400" />
              <span>Signature Blocked</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApprove}
              disabled={isSigning}
              className="flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-xs font-bold text-black hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
            >
              {isSigning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Signing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>Confirm &amp; Sign</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
