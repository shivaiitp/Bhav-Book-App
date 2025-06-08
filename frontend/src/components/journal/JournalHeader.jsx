import { Plus } from 'lucide-react';

export default function JournalHeader({ user, darkMode, onNewEntry }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          My Journal
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Welcome back, {user?.fullName || 'Writer'}! Ready to capture today's thoughts?
        </p>
      </div>
      <button
        onClick={onNewEntry}
        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        <Plus size={20} className="mr-2" />
        New Entry
      </button>
    </div>
  );
}
