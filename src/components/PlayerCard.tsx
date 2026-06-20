import { useState } from 'react';
import { METRIC_LABELS } from '../hooks/useGoatScore';
import { RankedPlayer } from '../types';

interface PlayerCardProps {
  rankedPlayer: RankedPlayer;
  careerRange: { start: number; end: number };
}

const TEAM_COLORS: Record<string, string> = {
  LAL: '#552583',
  GSW: '#1D428A',
  CHI: '#CE1141',
  BOS: '#007A33',
  MIA: '#98002E',
  SAS: '#C4CED4',
  CLE: '#860038',
  OKC: '#007AC1',
  PHO: '#1D1160',
  DAL: '#00538C',
  NYK: '#006BB6',
  DET: '#C8102E',
  HOU: '#CE1141',
  POR: '#E03A3E',
  UTA: '#002B5C',
  MIL: '#00471B',
  DEN: '#0E2240',
  MEM: '#5D76A9',
  ATL: '#E03A3E',
  ORL: '#0077C0',
  SAC: '#5A2D81',
  IND: '#002D62',
  MIN: '#0C2340',
  CHA: '#1D1160',
  NOP: '#0C2340',
  TOR: '#CE1141',
  WAS: '#002B5C',
  BKN: '#000000',
  LAC: '#C8102E',
  PHI: '#006BB6',
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function PlayerCard({ rankedPlayer, careerRange }: PlayerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { player, score, rank } = rankedPlayer;
  const primaryTeam = player.teams[0];
  const avatarColor = TEAM_COLORS[primaryTeam] ?? '#52525b';

  const topBreakdown = Object.entries(rankedPlayer.scoreBreakdown)
    .filter(([, value]) => value > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const maxBreakdown = Math.max(...topBreakdown.map(([, value]) => value), 1);

  return (
    <article className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-sm transition hover:border-zinc-700">
      <button
        className="grid w-full grid-cols-[48px_64px_1fr_auto_24px] items-center gap-4 p-4 text-left"
        onClick={() => setExpanded((value) => !value)}
      >
        <div className="text-center font-mono text-2xl font-semibold text-amber-500">#{rank}</div>

        <div
          className="flex h-16 w-16 items-center justify-center rounded text-lg font-semibold text-white"
          style={{ backgroundColor: avatarColor }}
        >
          {getInitials(player.name)}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-zinc-50">{player.name}</h3>
          <p className="truncate text-sm text-zinc-400">
            生涯 {careerRange.start}-{careerRange.end} · {player.teams.join(', ')}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {player.honors.championships} 總冠軍 · {player.honors.mvp} 例行賽 MVP · {player.honors.allstar} 全明星入選
          </p>
        </div>

        <div className="text-right">
          <div className="font-mono text-3xl font-semibold text-zinc-50">{score.toFixed(1)}</div>
          <p className="text-xs uppercase tracking-wider text-zinc-500">GOAT 分數</p>
        </div>

        <div className="text-xl text-zinc-500">{expanded ? '-' : '+'}</div>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 p-4">
          <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
            <section>
              <h4 className="mb-3 text-sm font-semibold text-zinc-200">分數來源</h4>
              <div className="space-y-2">
                {topBreakdown.map(([key, value]) => (
                  <div key={key}>
                    <div className="mb-1 flex justify-between text-xs text-zinc-400">
                      <span>{METRIC_LABELS[key as keyof typeof METRIC_LABELS] ?? key}</span>
                      <span className="font-mono">{value.toFixed(2)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded bg-zinc-800">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${Math.max(4, (value / maxBreakdown) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-3 gap-2 text-sm">
              {[
                ['場均得分', player.career_stats.points_per_game.toFixed(1)],
                ['場均助攻', player.career_stats.assists_per_game.toFixed(1)],
                ['場均籃板', player.career_stats.rebounds_per_game.toFixed(1)],
                ['效率值 PER', player.advanced.per?.toFixed(1) ?? 'N/A'],
                ['勝利貢獻值', player.advanced.win_shares?.toFixed(1) ?? 'N/A'],
                ['VORP', player.advanced.vorp?.toFixed(1) ?? 'N/A'],
                ['總冠軍賽 MVP', player.honors.fmvp],
                ['最佳陣容總次數', player.honors.allnba_total],
                ['最佳防守球員', player.honors.dpoy],
              ].map(([label, value]) => (
                <div key={label} className="rounded border border-zinc-800 bg-zinc-900 p-3">
                  <div className="text-xs text-zinc-500">{label}</div>
                  <div className="mt-1 font-mono text-zinc-100">{value}</div>
                </div>
              ))}
            </section>
          </div>
        </div>
      )}
    </article>
  );
}
