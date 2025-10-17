// components/mission-control/MissionForm.tsx
import { useState } from 'react';
import { MissionRequest } from '@/lib/types';

const SpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

interface MissionFormProps {
  onSubmit: (mission: MissionRequest) => void;
  isMissionRunning: boolean;
}

export function MissionForm({ onSubmit, isMissionRunning }: MissionFormProps) {
  const [url, setUrl] = useState('https://some-archive-url.com');
  const [objective, setObjective] = useState('Find examples of early internet slang.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && objective) {
      onSubmit({
        mission_type: 'excavate_url',
        target_url: url,
        objective,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="target_url" className="block text-sm font-medium text-gray-300">Target URL</label>
        <input
          id="target_url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isMissionRunning}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="objective" className="block text-sm font-medium text-gray-300">Objective</label>
        <textarea
          id="objective"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          disabled={isMissionRunning}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isMissionRunning}
        className="inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-indigo-500/50 disabled:cursor-not-allowed"
      >
        {isMissionRunning && <SpinnerIcon />}
        {isMissionRunning ? 'Mission in Progress...' : 'Launch Mission'}
      </button>
    </form>
  );
}