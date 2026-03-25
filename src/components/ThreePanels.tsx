import { PanelContext } from './PanelContext';
import { PanelData } from './PanelData';
import { PanelSkill } from './PanelSkill';
import type { DataItem } from '../types';

interface ThreePanelsProps {
  context: string;
  onContextChange: (value: string) => void;
  dataItems: DataItem[];
  onAddData: (label: string, description?: string) => void;
  onRemoveData: (id: string) => void;
  onGetRecommendations: () => void;
  skillContent: string;
  onGenerateSkill: () => void;
  dataLoading?: boolean;
  skillLoading?: boolean;
  dataError?: string | null;
  skillError?: string | null;
}

export function ThreePanels({
  context,
  onContextChange,
  dataItems,
  onAddData,
  onRemoveData,
  onGetRecommendations,
  skillContent,
  onGenerateSkill,
  dataLoading,
  skillLoading,
  dataError,
  skillError,
}: ThreePanelsProps) {
  return (
    <main className="flex-1 flex min-w-0 min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 min-h-0 grid grid-cols-[1fr_1fr_1fr] h-full">
        <PanelContext value={context} onChange={onContextChange} />
        <PanelData
          items={dataItems}
          onAdd={onAddData}
          onRemove={onRemoveData}
          onGetRecommendations={onGetRecommendations}
          loading={dataLoading}
          error={dataError}
        />
        <PanelSkill
          content={skillContent}
          onGenerate={onGenerateSkill}
          loading={skillLoading}
          error={skillError}
        />
      </div>
    </main>
  );
}
