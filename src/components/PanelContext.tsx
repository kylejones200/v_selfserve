interface PanelContextProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PanelContext({ value, onChange, disabled }: PanelContextProps) {
  return (
    <div className="h-full min-h-0 flex flex-col bg-zinc-900 border-r border-zinc-700 overflow-hidden">
      <div className="shrink-0 px-4 py-3 border-b border-zinc-700">
        <h2 className="text-sm font-semibold text-zinc-200">
          Tell us about your industry or company
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Baseline context for your skill
        </p>
      </div>
      <div className="flex-1 min-h-0 p-4 overflow-y-auto">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g. We're a B2B SaaS company in HR tech. We have customer data, usage analytics, and support tickets..."
          className="w-full min-h-[200px] rounded-lg border border-zinc-600 bg-zinc-800/80 text-zinc-200 placeholder-zinc-500 p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 disabled:opacity-60"
          rows={10}
        />
      </div>
    </div>
  );
}
