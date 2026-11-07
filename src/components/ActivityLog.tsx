'use client';

import React, { useState } from 'react';
import { Activity, ExternalLink, ShieldCheck, ShieldAlert, Clock, Filter } from 'lucide-react';
import { ActivityEvent, TxStatus } from '@/types';

interface ActivityLogProps {
  activities: ActivityEvent[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const [filter, setFilter] = useState<'ALL' | TxStatus>('ALL');

  const filtered = activities.filter((act) => {
    if (filter === 'ALL') return true;
    return act.status === filter;
  });

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-blue-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Autonomous Execution &amp; Audit Trail</h3>
            <p className="text-xs text-zinc-400">
              Immutable on-chain logs of every agent attempt, policy check, and settlement.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({activities.length})
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('BLOCKED')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === 'BLOCKED' ? 'bg-rose-500/20 text-rose-300' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Blocked
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 font-medium">
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Agent</th>
              <th className="py-2.5 px-3">Action Details</th>
              <th className="py-2.5 px-3">Contract</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3 text-right">On-Chain Proof</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors">
                {/* Status Badge */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {item.status === 'APPROVED' ? (
                    <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      <ShieldCheck className="h-3 w-3" />
                      <span>APPROVED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-medium text-rose-400">
                      <ShieldAlert className="h-3 w-3" />
                      <span>INTERCEPTED</span>
                    </span>
                  )}
                </td>

                {/* Agent Name */}
                <td className="py-3 px-3 font-sans font-medium text-zinc-200 whitespace-nowrap">
                  {item.agentName}
                </td>

                {/* Action Details & Reason */}
                <td className="py-3 px-3 font-sans text-zinc-300">
                  <div className="font-medium text-zinc-200">{item.action}</div>
                  {item.notes && (
                    <div className="mt-0.5 text-[11px] text-zinc-500 line-clamp-1">{item.notes}</div>
                  )}
                </td>

                {/* Target Contract */}
                <td className="py-3 px-3 text-zinc-400 whitespace-nowrap">{item.targetContract}</td>

                {/* Amount */}
                <td className="py-3 px-3 text-right text-zinc-200 whitespace-nowrap">
                  {item.amountNear > 0 ? `${item.amountNear.toFixed(2)} NEAR` : '0.00'}
                </td>

                {/* Explorer Link */}
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  {item.status === 'APPROVED' ? (
                    <a
                      href={`https://testnet.nearblocks.io/address/${item.targetContract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all"
                      title="Inspect target contract on NearBlocks Explorer"
                    >
                      <span className="text-[10px] font-mono font-semibold">NearBlocks ↗</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center space-x-1 rounded-md bg-rose-500/10 border border-rose-500/20 px-2 py-1 text-rose-400 text-[10px] font-mono">
                      <span>Blocked Locally</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

