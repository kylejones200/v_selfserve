import { useState } from 'react';
import type { DataItem } from '../types';

interface PanelDataProps {
  items: DataItem[];
  onAdd: (label: string, description?: string) => void;
  onRemove: (id: string) => void;
  onGetRecommendations: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function PanelData({
  items,
  onAdd,
  onRemove,
  onGetRecommendations,
  loading,
  disabled,
}: PanelDataProps) {
  const [newLabel, setNewLabel] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = () => {
    const label = newLabel.trim();
    if (!label) return;
    onAdd(label, newDesc.trim() || undefined);
    setNewLabel('');
    setNewDesc('');
  };

  return (
    <div className="h-full min-h-0 flex flex-col bg-zinc-900 border-r border-zinc-700 overflow-hidden">
      <div className="shrink-0 px-4 py-3 border-b border-zinc-700">
        <h2 className="text-sm font-semibold text-zinc-200">
          What data is available?
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Add sources or get recommendations based on your context
        </p>
        <button
          type="button"
          onClick={onGetRecommendations}
          disabled={disabled || loading}
          className="mt-2 text-xs font-medium text-violet-400 hover:text-violet-300 disabled:opacity-50"
        >
          {loading ? 'Getting recommendations…' : '✨ Get recommendations'}
        </button>
      </div>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="shrink-0 p-3 border-b border-zinc-700/80 flex gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Data source name"
            className="flex-1 min-w-0 rounded border border-zinc-600 bg-zinc-800 text-zinc-200 text-sm px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Optional description"
            className="flex-1 min-w-0 rounded border border-zinc-600 bg-zinc-800 text-zinc-200 text-sm px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newLabel.trim()}
            className="shrink-0 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.length === 0 ? (
            <li className="text-zinc-500 text-sm">No data sources yet. Add some or get recommendations.</li>
          ) : (
            items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 p-2.5"
              >
                <div className="min-w-0">
                  <span className="text-sm font-medium text-zinc-200">
                    {item.label}
                    {item.recommended && (
                      <span className="ml-1.5 text-xs text-violet-400">recommended</span>
                    )}
                  </span>
                  {item.description && (
                    <p className="text-xs text-zinc-500 mt-0.5">{item.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="shrink-0 text-zinc-500 hover:text-red-400 text-sm"
                  aria-label="Remove"
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
