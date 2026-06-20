import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Player } from '../types';

interface RadarChartProps {
  players: Player[];
}

function valueFor(player: Player, key: string) {
  if (key === '得分') return player.career_stats.points_per_game;
  if (key === '組織') return player.career_stats.assists_per_game * 3;
  if (key === '籃板') return player.career_stats.rebounds_per_game * 2;
  if (key === '冠軍') return player.honors.championships * 8;
  if (key === 'MVP') return player.honors.mvp * 10;
  return player.honors.allstar * 2;
}

export function RadarChart({ players }: RadarChartProps) {
  if (players.length === 0) return null;

  const axes = ['得分', '組織', '籃板', '冠軍', 'MVP', '生涯'];
  const data = axes.map((axis) => ({
    axis,
    ...Object.fromEntries(players.map((player) => [player.name, valueFor(player, axis)])),
  }));

  const colors = ['#f59e0b', '#38bdf8', '#a78bfa'];

  return (
    <div className="h-80 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <ResponsiveContainer height="100%" width="100%">
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: '#d4d4d8', fontSize: 12 }} />
          <PolarRadiusAxis stroke="#52525b" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
          {players.map((player, index) => (
            <Radar
              key={player.id}
              dataKey={player.name}
              fill={colors[index % colors.length]}
              fillOpacity={0.18}
              name={player.name}
              stroke={colors[index % colors.length]}
            />
          ))}
          <Tooltip
            contentStyle={{ background: '#09090b', border: '1px solid #3f3f46', color: '#fafafa' }}
          />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
