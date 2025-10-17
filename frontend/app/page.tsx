// app/page.tsx
'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MissionForm } from '@/components/mission-control/MissionForm';
import { AgentLog } from '@/components/mission-control/AgentLog';
import { FinalReportView } from '@/components/report/FinalReportView';
import { useChronosSocket } from '@/hooks/useChronosSocket';

export default function Home() {
  const { 
    agentSteps, 
    finalReport, 
    sendMission, 
    isMissionRunning, 
    error 
  } = useChronosSocket();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <main className="min-h-screen p-4 sm:p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-4xl font-bold text-white tracking-tight">Project Chronos</h1>
          <p className="mt-2 text-lg text-gray-400">AI Archaeologist Mission Control</p>
        </header>
        
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-2xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-white">New Mission</h2>
          <MissionForm onSubmit={sendMission} isMissionRunning={isMissionRunning} />
        </div>

        <div className="transition-opacity duration-500">
          {finalReport ? (
            <div className="animate-fade-in">
              <FinalReportView report={finalReport} />
            </div>
          ) : (
            (agentSteps.length > 0 || isMissionRunning) && (
              <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-2xl p-6 border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-white">Mission Log</h2>
                <AgentLog agentSteps={agentSteps} />
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}