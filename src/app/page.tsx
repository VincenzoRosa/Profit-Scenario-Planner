import { ScenarioPlanner } from '@/components/ScenarioPlanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <ScenarioPlanner />
    </div>
  );
} 