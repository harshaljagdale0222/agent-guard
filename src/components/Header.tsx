'use client';

import React, { useState } from 'react';
import { Shield, ShieldAlert, Zap, AlertTriangle, Radio, Wallet, LogOut, ChevronDown, Check } from 'lucide-react';
import { ConnectWalletModal } from '@/components/ConnectWalletModal';

interface HeaderProps {
  emergencyFrozen: boolean;
  onToggleEmergencyFreeze: () => void;
  treasuryBalance: number;
  activeAccountName?: string;
  isWalletConnected?: boolean;
  onConnectAccount?: (accountId: string, balanceNear: number) => void;
  onDisconnectWallet?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  emergencyFrozen,
  onToggleEmergencyFreeze,
  treasuryBalance,
  activeAccountName = 'treasury.agentguard.testnet',
  isWalletConnected = false,
  onConnectAccount = () => {},
  onDisconnectWallet = () => {},
}) => {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#060709]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand Logo & Radiant Accent */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-cyan-500/10 p-[1px] shadow-lg shadow-emerald-950/40">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-zinc-950/90">
                <Shield className="h-5 w-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-lg font-bold tracking-tight text-white bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Agent<span className="text-emerald-400">Guard</span>
                </span>
                <span className="inline-flex items-center space-x-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>NEAR PROTOCOL</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400">Policy-Guarded Autonomous Treasury & Execution Rail</p>
            </div>
          </div>

          {/* Status, Account & Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Testnet Badge */}
            <div className="hidden items-center space-x-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs md:flex shadow-inner">
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span className="font-mono text-zinc-300">testnet.near.org</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
            </div>

            {/* Connect Wallet Button OR Connected Account Pill */}
            {isWalletConnected ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-zinc-900/90 to-zinc-950 px-3.5 py-2 shadow-md hover:border-emerald-500/60 transition-all"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-1 text-xs font-mono font-medium text-zinc-200">
                      <span>{activeAccountName}</span>
                      <ChevronDown className="h-3 w-3 text-zinc-500" />
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                      {treasuryBalance.toFixed(2)} NEAR{' '}
                      <span className="text-zinc-400 font-normal">
                        (${(treasuryBalance * 5.1).toFixed(2)})
                      </span>
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl z-50">
                    <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                      Connected Account
                    </div>
                    <div className="px-2 py-1 text-xs font-mono text-zinc-200 truncate">
                      {activeAccountName}
                    </div>
                    <div className="my-1 border-t border-zinc-800"></div>
                    <button
                      onClick={() => {
                        setIsConnectModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-2 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    >
                      <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Switch Account</span>
                    </button>
                    <button
                      onClick={() => {
                        onDisconnectWallet();
                        setIsDropdownOpen(false);
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-black shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all hover:scale-[1.02]"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </button>
            )}

            {/* Emergency Kill Switch Button */}
            <button
              onClick={onToggleEmergencyFreeze}
              className={`flex items-center space-x-2 rounded-xl border px-4 py-2 text-xs font-semibold tracking-wide transition-all shadow-lg ${
                emergencyFrozen
                  ? 'border-rose-500 bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-rose-950/60 animate-pulse'
                  : 'border-rose-900/50 bg-rose-950/20 text-rose-300 hover:border-rose-600/80 hover:bg-rose-900/40 hover:text-white shadow-black/40'
              }`}
            >
              {emergencyFrozen ? (
                <>
                  <ShieldAlert className="h-4 w-4 text-white" />
                  <span>ALL KEYS FROZEN</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  <span className="hidden sm:inline">Emergency Freeze</span>
                  <span className="sm:hidden">Freeze</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnectAccount={(acc, bal) => {
          onConnectAccount(acc, bal);
        }}
      />
    </>
  );
};
