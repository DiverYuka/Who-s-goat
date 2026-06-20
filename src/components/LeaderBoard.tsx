import { useMemo, useState } from 'react';
import { parseCareerRange } from '../hooks/useEraFilter';
import { RankedPlayer } from '../types';
import { PlayerCard } from './PlayerCard';

interface LeaderBoardProps {
  rankedPlayers: RankedPlayer[];
}

type SortBy = 'score' | 'championships' | 'mvp' | 'allstar' | 'points_per_game';
type PositionFilter = 'all' | 'G' | 'F' | 'C';

export function LeaderBoard({ rankedPlayers }: LeaderBoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('score');
  const [position, setPosition] = useState<PositionFilter>('all');

  const visiblePlayers = useMemo(() => {
    return rankedPlayers
      .filter(({ player }) => {
        const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
        const positions = player.positions ?? [];
        const matchesPosition =
          position === 'all' ||
          positions.length === 0 ||
          positions.some((pos) => {
            if (position === 'G') return pos.includes('G');
            if (position === 'F') return pos.includes('F');
            return pos === 'C';
          });

        return matchesSearch && matchesPosition;
      })
      .sort((a, b) => {
        if (sortBy === 'championships') {
          return b.player.honors.championships - a.player.honors.championships;
        }
        if (sortBy === 'mvp') return b.player.honors.mvp - a.player.honors.mvp;
        if (sortBy === 'allstar') return b.player.honors.allstar - a.player.honors.allstar;
        if (sortBy === 'points_per_game') {
          return b.player.career_stats.points_per_game - a.player.career_stats.points_per_game;
        }
        return b.score - a.score;
      });
  }, [rankedPlayers, searchTerm, sortBy, position]);

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-zinc-900">
      <header className="shrink-0 border-b border-zinc-800 bg-zinc-950 px-5 py-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-500">NBA GOAT 排名工具</p>
            <h1 className="mt-1 text-3xl font-semibold text-zinc-50">NBA GOAT 排行榜</h1>
          </div>
          <div className="text-right text-sm text-zinc-400">
            顯示 <span className="font-mono text-zinc-100">{visiblePlayers.length}</span> /{' '}
            <span className="font-mono text-zinc-100">{rankedPlayers.length}</span> 位球員
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <input
            className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500"
            placeholder="搜尋球員..."
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select
            className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500"
            value={position}
            onChange={(event) => setPosition(event.target.value as PositionFilter)}
          >
            <option value="all">全部位置</option>
            <option value="G">後衛</option>
            <option value="F">前鋒</option>
            <option value="C">中鋒</option>
          </select>
          <select
            className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
          >
            <option value="score">GOAT 分數</option>
            <option value="championships">總冠軍</option>
            <option value="mvp">例行賽 MVP</option>
            <option value="allstar">全明星入選</option>
            <option value="points_per_game">場均得分</option>
          </select>
        </div>
      </header>

      <div className="leaderboard flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {visiblePlayers.map((rankedPlayer) => (
            <PlayerCard
              key={rankedPlayer.player.id}
              careerRange={parseCareerRange(rankedPlayer.player)}
              rankedPlayer={rankedPlayer}
            />
          ))}
          {visiblePlayers.length === 0 && (
            <div className="rounded border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-400">
              查無球員
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
