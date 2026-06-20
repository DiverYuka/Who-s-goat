import { useMemo } from 'react';
import { EraPreset, EraRange, Player, PlayerWithSeasonData, SeasonData } from '../types';

export const ERA_PRESETS: EraPreset[] = [
  {
    name: 'all',
    label: '全部年代',
    range: { startYear: 1946, endYear: 2026 },
    description: '1946-2026',
  },
  {
    name: 'pre-merge',
    label: '合併前',
    range: { startYear: 1946, endYear: 1976 },
    description: '1976 年以前',
  },
  {
    name: 'post-merge',
    label: '合併後',
    range: { startYear: 1976, endYear: 2026 },
    description: '1976 年至今',
  },
];

export function parseCareerRange(player: Player): { start: number; end: number } {
  if (player.career_start && player.career_end) {
    return { start: player.career_start, end: player.career_end };
  }

  const text = player.seasons ?? '';
  const startMatch = text.match(/\d{4}/);
  const start = startMatch ? Number(startMatch[0]) : 1946;
  const remainder = startMatch ? text.slice((startMatch.index ?? 0) + 4) : text;
  const endTokens = remainder.match(/\d+/g) ?? [];
  const endToken = endTokens.length > 0 ? endTokens[endTokens.length - 1] : undefined;

  let end = start;
  if (endToken) {
    if (endToken.length === 4) {
      end = Number(endToken);
    } else {
      const shortYear = Number(endToken);
      end = shortYear <= 26 ? 2000 + shortYear : 1000 + shortYear;
    }
  }

  return { start, end: Math.max(start, end) };
}

export function formatCareerRange(player: Player) {
  const { start, end } = parseCareerRange(player);
  return `${start}-${end}`;
}

export function getOverlapSeasons(player: Player, startYear: number, endYear: number) {
  return (player.seasons_data ?? []).filter(
    (season) => season.season_year >= startYear && season.season_year < endYear
  );
}

function careerOverlaps(player: Player, range: EraRange) {
  const career = parseCareerRange(player);
  return career.start < range.endYear && career.end >= range.startYear;
}

function calculateWeightedAverages(seasons: SeasonData[]) {
  const games = seasons.reduce((sum, season) => sum + (season.games || 0), 0);
  if (games === 0) return null;

  const weighted = seasons.reduce(
    (acc, season) => ({
      points: acc.points + (season.ppg || 0) * (season.games || 0),
      assists: acc.assists + (season.apg || 0) * (season.games || 0),
      rebounds: acc.rebounds + (season.rpg || 0) * (season.games || 0),
      steals: acc.steals + (season.spg || 0) * (season.games || 0),
      blocks: acc.blocks + (season.bpg || 0) * (season.games || 0),
      per: acc.per + ((season.per ?? 0) * (season.games || 0)),
      bpm: acc.bpm + ((season.bpm ?? 0) * (season.games || 0)),
      win_shares: acc.win_shares + (season.win_shares ?? 0),
      vorp: acc.vorp + (season.vorp ?? 0),
      perGames: acc.perGames + (season.per == null ? 0 : season.games || 0),
      bpmGames: acc.bpmGames + (season.bpm == null ? 0 : season.games || 0),
    }),
    {
      points: 0,
      assists: 0,
      rebounds: 0,
      steals: 0,
      blocks: 0,
      per: 0,
      bpm: 0,
      win_shares: 0,
      vorp: 0,
      perGames: 0,
      bpmGames: 0,
    }
  );

  return {
    points_per_game: weighted.points / games,
    assists_per_game: weighted.assists / games,
    rebounds_per_game: weighted.rebounds / games,
    steals_per_game: weighted.steals / games,
    blocks_per_game: weighted.blocks / games,
    per: weighted.perGames > 0 ? weighted.per / weighted.perGames : null,
    bpm: weighted.bpmGames > 0 ? weighted.bpm / weighted.bpmGames : null,
    win_shares: weighted.win_shares,
    vorp: weighted.vorp,
  };
}

export function filterPlayersByEra(players: Player[], eraRange: EraRange): PlayerWithSeasonData[] {
  return players
    .filter((player) => careerOverlaps(player, eraRange))
    .map((player) => {
      const overlapSeasons = getOverlapSeasons(player, eraRange.startYear, eraRange.endYear);
      const weighted = overlapSeasons.length > 0 ? calculateWeightedAverages(overlapSeasons) : null;

      if (!weighted) return player;

      return {
        ...player,
        eraAdjustedStats: {
          careerStats: {
            ...player.career_stats,
            points_per_game: Number(weighted.points_per_game.toFixed(1)),
            assists_per_game: Number(weighted.assists_per_game.toFixed(1)),
            rebounds_per_game: Number(weighted.rebounds_per_game.toFixed(1)),
            steals_per_game: Number(weighted.steals_per_game.toFixed(1)),
            blocks_per_game: Number(weighted.blocks_per_game.toFixed(1)),
          },
          advanced: {
            ...player.advanced,
            per: weighted.per,
            win_shares: weighted.win_shares,
            vorp: weighted.vorp,
            bpm: weighted.bpm,
          },
        },
      };
    });
}

export function useEraFilter(players: Player[], eraRange: EraRange) {
  const filteredPlayers = useMemo(
    () => filterPlayersByEra(players, eraRange),
    [players, eraRange]
  );

  return {
    filteredPlayers,
    playerCount: filteredPlayers.length,
    eraRange,
  };
}
