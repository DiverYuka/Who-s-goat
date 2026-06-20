import { useMemo, useState } from 'react';
import './index.css';
import { LeaderBoard } from './components/LeaderBoard';
import { RadarChart } from './components/RadarChart';
import { WeightPanel } from './components/WeightPanel';
import playersData from './data/players.json';
import { useEraFilter } from './hooks/useEraFilter';
import { useGoatScore } from './hooks/useGoatScore';
import { Player, RankedPlayer, WeightConfig } from './types';

const DEFAULT_WEIGHTS: WeightConfig = {
  championships: 30,
  fmvp: 20,
  playoff_appearances: 5,
  finals_appearances: 8,
  mvp: 25,
  dpoy: 15,
  rookie_of_year: 5,
  scoring_titles: 8,
  assist_titles: 6,
  rebound_titles: 5,
  allstar: 10,
  allnba_first: 12,
  allnba_total: 6,
  alldefensive_first: 8,
  points_per_game: 15,
  assists_per_game: 10,
  rebounds_per_game: 8,
  steals_per_game: 6,
  blocks_per_game: 6,
  per: 20,
  win_shares: 18,
  vorp: 15,
  bpm: 12,
  playoff_win_shares: 15,
  win_pct: 10,
};

function csvEscape(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function generateCSV(rankedPlayers: RankedPlayer[]) {
  const headers = [
    '排名',
    '姓名',
    '球隊',
    'GOAT 分數',
    '總冠軍',
    '總冠軍賽 MVP',
    '例行賽 MVP',
    '全明星入選',
    '場均得分',
    '場均助攻',
    '場均籃板',
  ];

  const rows = rankedPlayers.map(({ rank, player, score }) => [
    rank,
    player.name,
    player.teams.join('|'),
    score.toFixed(1),
    player.honors.championships,
    player.honors.fmvp,
    player.honors.mvp,
    player.honors.allstar,
    player.career_stats.points_per_game.toFixed(1),
    player.career_stats.assists_per_game.toFixed(1),
    player.career_stats.rebounds_per_game.toFixed(1),
  ]);

  return [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
}

function downloadCSV(content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `nba-goat-ranking-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function App() {
  const players = useMemo(() => playersData as Player[], []);
  const [weights, setWeights] = useState<WeightConfig>(DEFAULT_WEIGHTS);
  const [startYear, setStartYear] = useState(1976);
  const [endYear, setEndYear] = useState(2026);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const eraRange = useMemo(() => ({ startYear, endYear }), [startYear, endYear]);
  const { filteredPlayers, playerCount } = useEraFilter(players, eraRange);
  const rankedPlayers = useGoatScore(filteredPlayers, weights);

  const handleEraChange = (nextStartYear: number, nextEndYear: number) => {
    const safeStart = Math.max(1946, Math.min(nextStartYear, 2025));
    const safeEnd = Math.max(safeStart + 1, Math.min(nextEndYear, 2026));
    setStartYear(safeStart);
    setEndYear(safeEnd);
  };

  const toggleSelectedPlayer = (player: Player) => {
    setSelectedPlayers((current) => {
      if (current.some((selected) => selected.id === player.id)) {
        return current.filter((selected) => selected.id !== player.id);
      }

      return current.length >= 3 ? current : [...current, player];
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <WeightPanel
        endYear={endYear}
        onChange={setWeights}
        onEraChange={handleEraChange}
        onReset={() => setWeights(DEFAULT_WEIGHTS)}
        startYear={startYear}
        weights={weights}
      />

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <LeaderBoard rankedPlayers={rankedPlayers} />

        <footer className="shrink-0 border-t border-zinc-800 bg-zinc-950 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <button className="control-button" onClick={() => setCompareOpen((open) => !open)}>
              {compareOpen ? '隱藏比較' : '球員比較'}
            </button>
            <button className="control-button" onClick={() => downloadCSV(generateCSV(rankedPlayers))}>
              匯出 CSV
            </button>
            <span className="text-sm text-zinc-500">
              {Object.values(weights).filter((weight) => weight > 0).length} 個啟用加權 · {playerCount}/{players.length}{' '}
              位球員
            </span>
          </div>

          {compareOpen && (
            <div className="mt-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {rankedPlayers.slice(0, 12).map(({ player }) => {
                  const active = selectedPlayers.some((selected) => selected.id === player.id);
                  return (
                    <button
                      key={player.id}
                      className={`rounded border px-3 py-2 text-sm transition ${
                        active
                          ? 'border-amber-500 bg-amber-500 text-zinc-950'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
                      }`}
                      onClick={() => toggleSelectedPlayer(player)}
                    >
                      {player.name}
                    </button>
                  );
                })}
              </div>
              <RadarChart players={selectedPlayers} />
            </div>
          )}
        </footer>
      </section>
    </div>
  );
}
