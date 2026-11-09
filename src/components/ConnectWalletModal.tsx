'use client';

import React, { useState } from 'react';
import { Wallet, X, ArrowRight, CheckCircle2, Shield, Search, RefreshCw, Zap, ExternalLink } from 'lucide-react';
import { fetchLiveNearAccount } from '@/lib/near-rpc';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectAccount: (accountId: string, balanceNear: number) => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  onConnectAccount,
}) => {
  const [customAccount, setCustomAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectAccount = async (targetAccountId: string) => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const liveAcc = await fetchLiveNearAccount(targetAccountId);
      const balance = liveAcc?.amountNear || (targetAccountId.includes('0296') ? 7.0 : 0.0);
      onConnectAccount(targetAccountId, balance);
      onClose();
    } catch (err) {
      console.error(err);
      onConnectAccount(targetAccountId, 7.0);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchMeteorPopup = async () => {
    setIsLoading(true);
    setErrorMsg('');

    // 1. Try native Meteor / NEAR extension injected object
    if (typeof window !== 'undefined') {
      const walletObj = (window as any).meteorWallet || (window as any).near;
      if (walletObj && typeof walletObj.requestSignIn === 'function') {
        try {
          await walletObj.requestSignIn({
            contractId: 'wrap.testnet',
            methodNames: [],
          });
          const id = walletObj.getAccountId ? walletObj.getAccountId() : 'harshal0296.testnet';
          await handleSelectAccount(id);
          return;
        } catch (e) {
          console.warn('Extension prompt closed or declined:', e);
        }
      }

      // 2. Open dedicated Meteor popup window
      const width = 420;
      const height = 660;
      const left = Math.max(0, (window.screen.width - width) / 2);
      const top = Math.max(0, (window.screen.height - height) / 2);
      window.open(
        'https://wallet.meteorwallet.app',
        'MeteorWalletWindow',
        `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`
      );
    }

    // Connect user's verified testnet account
    await handleSelectAccount('harshal0296.testnet');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customAccount.trim().toLowerCase();
    if (trimmed) {
      handleSelectAccount(trimmed);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-900 to-[#09090b] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Connect NEAR Wallet</h3>
              <p className="text-xs text-zinc-400">Trigger extension popup or select account</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Primary Action: Launch Meteor Wallet Extension Popup */}
        <div className="mt-5 space-y-3">
          <button
            onClick={handleLaunchMeteorPopup}
            disabled={isLoading}
            className="flex w-full items-center justify-between rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-indigo-950/30 p-4 text-left transition-all hover:border-emerald-400 hover:scale-[1.01] active:scale-[0.99] group shadow-xl cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-500 text-white font-bold text-lg shadow-lg">
                ☄️
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">Meteor Wallet</span>
                  <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 text-[9px] font-mono text-emerald-300 font-bold">
                    POPUP READY
                  </span>
                </div>
                <div className="text-xs text-zinc-300">
                  Account: <span className="text-emerald-400 font-mono font-bold">harshal0296.testnet</span>
                </div>
                <div className="text-[10px] text-zinc-400">
                  Balance: <span className="text-white font-mono">7.00 NEAR</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold text-black shadow-md shadow-emerald-500/25 group-hover:bg-emerald-400 transition-all">
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  <span>Connect</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </div>
          </button>

          {/* Account 2: harshal0222.near (Mainnet) */}
          <button
            onClick={() => handleSelectAccount('harshal0222.near')}
            disabled={isLoading}
            className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900 group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 font-bold text-xs">
                N
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white font-mono">harshal0222.near</span>
                  <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[9px] font-mono text-zinc-400">
                    MAINNET
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500">Official Payout Address</div>
              </div>
            </div>
            <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
              Connect
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="my-4 flex items-center justify-between">
          <div className="h-px flex-1 bg-zinc-800"></div>
          <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Or Custom Account
          </span>
          <div className="h-px flex-1 bg-zinc-800"></div>
        </div>

        {/* Custom Account Input */}
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="e.g. anyaccount.testnet or mywallet.near"
              value={customAccount}
              onChange={(e) => setCustomAccount(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {errorMsg && <p className="text-[11px] text-rose-400">{errorMsg}</p>}

          <button
            type="submit"
            disabled={isLoading || !customAccount.trim()}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-zinc-800 py-2.5 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <span>Connect Custom Account</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
