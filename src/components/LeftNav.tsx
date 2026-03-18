import { useState, useMemo } from 'react';
import type { Conversation } from '../types';

interface LeftNavProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userEmail?: string | null;
  onSignOut?: () => void;
}

export function LeftNav({
  conversations,
  currentId,
  onSelect,
  onNew,
  searchQuery,
  onSearchChange,
  userEmail,
  onSignOut,
}: LeftNavProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.context.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  return (
    <aside className="w-64 shrink-0 min-h-0 flex flex-col border-r border-zinc-700 bg-zinc-900/80 overflow-hidden">
      <div className="p-3 border-b border-zinc-700">
        <button
          type="button"
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white py-2.5 px-3 text-sm font-medium transition"
        >
          <span className="text-lg">+</span>
          New conversation
        </button>
      </div>
      <div className="p-2 border-b border-zinc-700">
        <div
          className={`flex items-center gap-2 rounded-lg border bg-zinc-800/80 px-3 py-2 transition ${searchFocused ? 'border-violet-500/50 ring-1 ring-violet-500/30' : 'border-zinc-600'}`}
        >
          <span className="text-zinc-500 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search conversations..."
            className="flex-1 min-w-0 bg-transparent border-0 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 py-1.5">
          History
        </div>
        {filtered.length === 0 ? (
          <p className="text-zinc-500 text-sm px-2 py-4">
            {searchQuery ? 'No matches.' : 'No conversations yet.'}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  className={`w-full text-left rounded-lg px-3 py-2.5 text-sm truncate transition ${currentId === c.id ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent'}`}
                >
                  {c.title || 'Untitled'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
      {onSignOut && (
        <div className="p-2 border-t border-zinc-700">
          {userEmail && (
            <p className="text-xs text-zinc-500 truncate px-2 pb-1" title={userEmail}>
              {userEmail}
            </p>
          )}
          <button
            type="button"
            onClick={onSignOut}
            className="w-full text-left rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
