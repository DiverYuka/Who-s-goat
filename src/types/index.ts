export interface PlayerHonors {
  championships: number;
  fmvp: number;
  mvp: number;
  allstar: number;
  allnba_first: number;
  allnba_total: number;
  alldefensive_first: number;
  alldefensive_total: number;
  dpoy: number;
  scoring_titles: number;
  assist_titles: number;
  rebound_titles: number;
  rookie_of_year: number;
}

export interface CareerStats {
  games: number;
  points_per_game: number;
  assists_per_game: number;
  rebounds_per_game: number;
  steals_per_game: number;
  blocks_per_game: number;
  fg_pct: number;
  three_pct: number;
  ft_pct: number;
}

export interface Advanced {
  per: number | null;
  win_shares: number | null;
  vorp: number | null;
  bpm: number | null;
  playoff_win_shares: number | null;
}

export interface TeamRecords {
  career_wins: number;
  career_losses: number;
  playoff_appearances: number;
  finals_appearances: number;
  win_pct: number;
}

export interface SeasonData {
  season: string;
  season_year: number;
  team: string;
  games: number;
  ppg: number;
  apg: number;
  rpg: number;
  spg?: number;
  bpg?: number;
  win_shares?: number | null;
  vorp?: number | null;
  per?: number | null;
  bpm?: number | null;
}

export interface Player {
  id: string;
  name: string;
  seasons: string;
  career_start?: number;
  career_end?: number;
  positions?: string[];
  teams: string[];
  photo_url?: string;
  honors: PlayerHonors;
  career_stats: CareerStats;
  advanced: Advanced;
  team_records: TeamRecords;
  seasons_data?: SeasonData[];
}

export interface WeightConfig {
  // Championship achievements
  championships: number;
  fmvp: number;
  playoff_appearances: number;
  finals_appearances: number;

  // Personal awards
  mvp: number;
  dpoy: number;
  rookie_of_year: number;
  scoring_titles: number;
  assist_titles: number;
  rebound_titles: number;

  // Selection honors
  allstar: number;
  allnba_first: number;
  allnba_total: number;
  alldefensive_first: number;

  // Career stats
  points_per_game: number;
  assists_per_game: number;
  rebounds_per_game: number;
  steals_per_game: number;
  blocks_per_game: number;

  // Advanced stats
  per: number;
  win_shares: number;
  vorp: number;
  bpm: number;
  playoff_win_shares: number;

  // Team contribution
  win_pct: number;
}

export interface RankedPlayer {
  player: Player;
  score: number;
  scoreBreakdown: Record<string, number>;
  rank: number;
}

export interface PresetWeights {
  name: string;
  label: string;
  weights: WeightConfig;
}

export interface EraRange {
  startYear: number;
  endYear: number;
}

export interface EraPreset {
  name: string;
  label: string;
  range: EraRange;
  description: string;
}

export interface PlayerWithSeasonData extends Player {
  seasons_data?: SeasonData[];
  eraAdjustedStats?: {
    careerStats: CareerStats;
    advanced: Advanced;
  };
}
