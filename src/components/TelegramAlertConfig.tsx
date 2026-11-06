'use client';

import React, { useState } from 'react';
import { Send, Bell, CheckCircle2, Shield, Smartphone, RefreshCw, MessageSquare } from 'lucide-react';

export const TelegramAlertConfig: React.FC = () => {
  const [chatId, setChatId] = useState('@harshal_security_alerts');
  const [isSending, setIsSending] = useState(false);
  const [lastDeliveredMsg, setLastDeliveredMsg] = useState<string | null>(null);

  const handleTestAlert = () => {
    setIsSending(true);
    setLastDeliveredMsg(null);

    setTimeout(() => {
      setIsSending(false);
      setLastDeliveredMsg(
        `🚨 [AgentGuard Security Alert]\nThreat: Adversarial Prompt Injection Blocked\nTarget: attacker.near (20.0 NEAR)\nStatus: Cryptographic Key Revoked at NEAR Consensus\nTimestamp: ${new Date().toLocaleTimeString()}`
      );
    }, 1000);
  };

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 text-cyan-400">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">Mobile Security Alert Webhook (Telegram)</h3>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-semibold">
                INSTANT PUSH NOTIFICATION
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Receive immediate push notifications when rogue agents or prompt injection attacks are intercepted.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left Column: Form Settings */}
        <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div>
            <label className="text-xs font-semibold text-zinc-200">Telegram Channel / User Handle</label>
            <div className="mt-1.5 flex space-x-2">
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="@your_telegram_channel"
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
              />
              <button
                onClick={handleTestAlert}
                disabled={isSending}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-black hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/20 disabled:opacity-50"
              >
                {isSending ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Test Push</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-zinc-800/80 text-xs">
            <div className="flex items-center justify-between text-zinc-300">
              <span>Notify on Adversarial Injections</span>
              <span className="text-emerald-400 font-bold font-mono">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span>Notify on Auto-Freeze Actions</span>
              <span className="text-emerald-400 font-bold font-mono">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span>Delivery Protocol</span>
              <span className="text-cyan-400 font-mono">Telegram Bot API (HTTPS)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Notification Preview */}
        <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-zinc-800/80 pb-2 text-[11px] text-zinc-400">
              <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
              <span>LIVE TELEGRAM MOBILE DISPATCH PREVIEW</span>
            </div>
            {lastDeliveredMsg ? (
              <div className="mt-3 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3 font-mono text-xs text-cyan-200 whitespace-pre-line shadow-inner">
                {lastDeliveredMsg}
              </div>
            ) : (
              <p className="mt-6 text-center text-xs text-zinc-600">
                Click &apos;Send Test Push&apos; to simulate a real-time mobile security dispatch.
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-800/60 pt-2 font-mono">
            <span>Webhook Status: 200 OK</span>
            <span>Latency: 48ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

