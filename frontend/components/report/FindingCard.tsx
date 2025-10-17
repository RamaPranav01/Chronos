// components/report/FindingCard.tsx
import { FinalReportPayload } from '@/lib/types';

type Finding = FinalReportPayload['key_findings'][0];

export function FindingCard({ finding }: { finding: Finding }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-full flex flex-col">
      <h4 className="text-lg font-bold text-indigo-400">"{finding.artifact}"</h4>
      <p className="mt-2 text-gray-300 flex-grow">{finding.analysis}</p>
      <div className="mt-4">
        <span className="text-xs font-medium bg-green-800/50 text-green-300 px-2 py-1 rounded-full">
          Relevance: {Math.round(finding.relevance * 100)}%
        </span>
      </div>
    </div>
  );
}