// frontend/components/report/FindingCard.tsx
import { FinalReportPayload } from '@/lib/types';

// Assuming KeyFinding type is defined in your types.ts as a part of FinalReportPayload
type Finding = FinalReportPayload['key_findings'][0];

export function FindingCard({ finding }: { finding: Finding }) {
  // Check if finding and analysis exist to prevent errors
  if (!finding || !finding.analysis) {
    return null; // Or a loading/error state
  }

  const { cultural_context, slang_definitions } = finding.analysis;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-full flex flex-col text-sm">
      <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-300">
        "{finding.artifact}"
      </blockquote>
      
      <div className="mt-4 pt-4 border-t border-gray-700 space-y-3 flex-grow">
        {cultural_context && (
          <div>
            <h5 className="font-semibold text-gray-100">Cultural Context:</h5>
            <p className="text-gray-400">{cultural_context}</p>
          </div>
        )}

        {slang_definitions && Object.keys(slang_definitions).length > 0 && (
          <div>
            <h5 className="font-semibold text-gray-100">Slang Identified:</h5>
            <ul className="list-disc list-inside text-gray-400">
              {Object.entries(slang_definitions).map(([term, definition]) => (
                <li key={term}>
                  <span className="font-semibold text-gray-200">{term}:</span> {String(definition)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* This 'relevance' key doesn't seem to be in our backend data,
          so I'm commenting it out to prevent potential errors. 
          If you add it later, you can uncomment this.
      <div className="mt-4">
        <span className="text-xs font-medium bg-green-800/50 text-green-300 px-2 py-1 rounded-full">
          Relevance: {finding.relevance ? Math.round(finding.relevance * 100) : 'N/A'}%
        </span>
      </div>
      */}
    </div>
  );
}