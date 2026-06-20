import { useMemo } from 'react';
import { Player, PlayerWithSeasonData, RankedPlayer, WeightConfig } from '../types';

type ScoringPlayer = Player | PlayerWithSeasonData;
type MetricKey = keyof WeightConfig;

export const METRIC_LABELS: Record<MetricKey, string> = {
  championships: '總冠軍',
  fmvp: '總冠軍賽 MVP',
  playoff_appearances: '季後賽出場次數',
  finals_appearances: '總冠軍賽次數',
  mvp: '例行賽 MVP',
  dpoy: '最佳防守球員',
  rookie_of_year: '年度新秀',
  scoring_titles: '得分王',
  assist_titles: '助攻王',
  rebound_titles: '籃板王',
  allstar: '全明星入選',
  allnba_first: '最佳一陣',
  allnba_total: '最佳陣容總次數',
  alldefensive_first: '最佳防守一陣',
  points_per_game: '場均得分',
  assists_per_game: '場均助攻',
  rebounds_per_game: '場均籃板',
  steals_per_game: '場均抄截',
  blocks_per_game: '場均火鍋',
  per: '效率值 PER',
  win_shares: '勝利貢獻值',
  vorp: 'VORP',
  bpm: '正負值 BPM',
  playoff_win_shares: '季後賽勝利貢獻',
  win_pct: '生涯勝率',
};

const METRIC_KEYS = Object.keys(METRIC_LABELS) as MetricKey[];

function normalize(value: number | null | undefined, min: number, max: number) {
  if (value == null || Number.isNaN(value) || max <= min) return 0;
  return (value - min) / (max - min);
}

function getPlayerValue(player: ScoringPlayer, key: MetricKey): number | null {
  const eraStats = (player as PlayerWithSeasonData).eraAdjustedStats;

  if (key in player.honors) return player.honors[key as keyof Player['honors']];
  if (key in player.team_records) return player.team_records[key as keyof Player['team_records']];
  if (key in (eraStats?.careerStats ?? player.career_stats)) {
    return (eraStats?.careerStats ?? player.career_stats)[key as keyof Player['career_stats']];
  }
  if (key in (eraStats?.advanced ?? player.advanced)) {
    return (eraStats?.advanced ?? player.advanced)[key as keyof Player['advanced']];
  }

  return null;
}

function getMinMax(players: ScoringPlayer[], key: MetricKey): [number, number] {
  const values = players
    .map((player) => getPlayerValue(player, key))
    .filter((value): value is number => value != null && !Number.isNaN(value));

  if (values.length === 0) return [0, 0];
  return [Math.min(...values), Math.max(...values)];
}

export function rankPlayers(players: ScoringPlayer[], weights: WeightConfig): RankedPlayer[] {
  const minMaxValues = METRIC_KEYS.reduce<Record<MetricKey, [number, number]>>((acc, key) => {
    acc[key] = getMinMax(players, key);
    return acc;
  }, {} as Record<MetricKey, [number, number]>);

  return players
    .map((player) => {
      const scoreBreakdown = METRIC_KEYS.reduce<Record<string, number>>((acc, key) => {
        const weight = weights[key];
        if (weight <= 0) {
          acc[key] = 0;
          return acc;
        }

        const [min, max] = minMaxValues[key];
        acc[key] = normalize(getPlayerValue(player, key), min, max) * weight;
        return acc;
      }, {});

      const activeWeight = METRIC_KEYS.reduce((sum, key) => sum + Math.max(weights[key], 0), 0);
      const rawScore = Object.values(scoreBreakdown).reduce((sum, value) => sum + value, 0);
      const score = activeWeight > 0 ? (rawScore / activeWeight) * 1000 : 0;

      return {
        player: player as Player,
        score,
        scoreBreakdown,
        rank: 0,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((rankedPlayer, index) => ({ ...rankedPlayer, rank: index + 1 }));
}

export function useGoatScore(players: Player[], weights: WeightConfig): RankedPlayer[];
export function useGoatScore(players: PlayerWithSeasonData[], weights: WeightConfig): RankedPlayer[];
export function useGoatScore(players: ScoringPlayer[], weights: WeightConfig): RankedPlayer[] {
  return useMemo(() => rankPlayers(players, weights), [players, weights]);
}
