import { useState } from 'react';
import { METRIC_LABELS } from '../hooks/useGoatScore';
import { WeightConfig } from '../types';
import { EraFilter } from './EraFilter';

interface WeightPanelProps {
  weights: WeightConfig;
  startYear: number;
  endYear: number;
  onChange: (weights: WeightConfig) => void;
  onEraChange: (startYear: number, endYear: number) => void;
  onReset: () => void;
}

const SECTIONS: Record<string, (keyof WeightConfig)[]> = {
  冠軍成就: ['championships', 'fmvp', 'finals_appearances', 'playoff_appearances'],
  個人獎項: ['mvp', 'dpoy', 'scoring_titles', 'assist_titles', 'rebound_titles', 'rookie_of_year'],
  入選榮譽: ['allnba_first', 'allnba_total', 'allstar', 'alldefensive_first'],
  場均數據: [
    'points_per_game',
    'assists_per_game',
    'rebounds_per_game',
    'steals_per_game',
    'blocks_per_game',
  ],
  進階數據: ['per', 'win_shares', 'vorp', 'bpm', 'playoff_win_shares'],
  球隊紀錄: ['win_pct'],
};

export function WeightPanel({
  weights,
  startYear,
  endYear,
  onChange,
  onEraChange,
  onReset,
}: WeightPanelProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const updateWeight = (key: keyof WeightConfig, value: number) => {
    onChange({ ...weights, [key]: value });
  };

  return (
    <aside className="h-full w-80 shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col">
      <div className="shrink-0 border-b border-zinc-800 p-4">
        <h2 className="text-xl font-semibold text-zinc-100">加權設定</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <EraFilter startYear={startYear} endYear={endYear} onChange={onEraChange} />

        <button className="control-button mt-4 w-full" onClick={onReset}>
          重置加權
        </button>

        <div className="mt-5 space-y-4">
          {Object.entries(SECTIONS).map(([section, keys]) => (
            <section key={section} className="border-t border-zinc-800 pt-4">
              <button
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-zinc-200"
                onClick={() => setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }))}
              >
                <span>{section}</span>
                <span className="text-zinc-500">{collapsed[section] ? '+' : '-'}</span>
              </button>

              {!collapsed[section] && (
                <div className="mt-3 space-y-3">
                  {keys.map((key) => (
                    <label key={key} className="block">
                      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                        <span className="truncate text-zinc-400">{METRIC_LABELS[key]}</span>
                        <input
                          className="w-14 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-right font-mono text-zinc-100"
                          min={0}
                          max={100}
                          type="number"
                          value={weights[key]}
                          onChange={(event) =>
                            updateWeight(key, Math.min(100, Math.max(0, Number(event.target.value))))
                          }
                        />
                      </div>
                      <input
                        className="w-full accent-amber-500"
                        min={0}
                        max={100}
                        type="range"
                        value={weights[key]}
                        onChange={(event) => updateWeight(key, Number(event.target.value))}
                      />
                    </label>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </aside>
  );
}
