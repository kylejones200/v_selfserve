import { useState } from 'react';

interface PanelSkillProps {
  content: string;
  onGenerate: () => void;
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
}

export function PanelSkill({
  content,
  onGenerate,
  loading,
  disabled,
  error,
}: PanelSkillProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skill-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full min-h-0 flex flex-col bg-zinc-900 overflow-hidden">
      <div className="shrink-0 px-4 py-3 border-b border-zinc-700 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">
              Your skill
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Download or copy, then use it in your workflow
            </p>
          </div>
          <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={disabled || loading}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate skill'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!content}
            className="rounded-lg border border-zinc-600 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
          >
            Download
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!content}
            className="rounded-lg border border-zinc-600 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          </div>
        </div>
        {error && (
          <p className="text-xs text-red-400" role="alert">{error}</p>
        )}
      </div>
      <div className="flex-1 min-h-0 p-4 overflow-hidden flex flex-col gap-3">
        {content && (
          <div className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2.5">
            <p className="text-xs font-medium text-zinc-300 mb-1">What you can do with this skill</p>
            <ul className="text-xs text-zinc-500 space-y-0.5 list-disc list-inside">
              <li><strong className="text-zinc-400">Download</strong> — save as .md to use as docs or import into Cursor rules, agent configs, or internal tools</li>
              <li><strong className="text-zinc-400">Copy</strong> — paste into a prompt, wiki, or agent builder</li>
              <li><strong className="text-zinc-400">Refine</strong> — edit context or data sources above and generate again</li>
            </ul>
          </div>
        )}
        <pre className="flex-1 min-h-0 w-full overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800/80 p-4 text-sm text-zinc-300 whitespace-pre-wrap font-mono">
          {content || 'Generate a skill using the button above. Your context and data sources will be sent to the LLM.'}
        </pre>
      </div>
    </div>
  );
}
