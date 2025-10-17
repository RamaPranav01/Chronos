// components/report/FinalReportView.tsx
import { AgentStep, FinalReportPayload } from '@/lib/types';
import { FindingCard } from './FindingCard';
import { KnowledgeGraph } from './KnowledgeGraph';

interface FinalReportViewProps {
  report: AgentStep;
}

export function FinalReportView({ report }: FinalReportViewProps) {
  const payload = report.payload as FinalReportPayload;

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-2xl p-6 border border-gray-700 space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white">{payload.title}</h2>
        <p className="mt-2 text-lg text-gray-300">{payload.summary}</p>
      </header>
      
      <section>
        <h3 className="text-2xl font-semibold mb-4 text-white">Key Findings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {payload.key_findings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4 text-white">Knowledge Graph</h3>
        <div className="w-full h-[500px] bg-gray-900/50 rounded-lg border border-gray-700">
            <KnowledgeGraph graphData={payload.knowledge_graph} />
        </div>
      </section>
    </div>
  );
}