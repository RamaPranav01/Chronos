// components/mission-control/AgentLog.tsx
import { AgentStep } from '@/lib/types';
import { useEffect, useRef } from 'react';

const getStepStyle = (stepType: AgentStep['step_type']) => {
  switch (stepType) {
    case 'THOUGHT':
      return 'border-l-blue-400';
    case 'ACTION':
      return 'border-l-purple-400';
    case 'RESULT':
      return 'border-l-green-400';
    case 'ERROR':
      return 'border-l-red-500 bg-red-900/30 text-red-300';
    default:
      return 'border-l-gray-500';
  }
};

export function AgentLog({ agentSteps }: { agentSteps: AgentStep[] }) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentSteps]);

  return (
    <div className="mt-6 bg-gray-900/70 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm border border-gray-700">
      {agentSteps.map((step, index) => (
        <div
          key={index}
          className={`mb-2 p-3 border-l-4 animate-fade-in ${getStepStyle(step.step_type)}`}
        >
          <span className="font-bold mr-3 uppercase">[{step.step_type}]</span>
          <span>{step.payload.message || JSON.stringify(step.payload)}</span>
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
}