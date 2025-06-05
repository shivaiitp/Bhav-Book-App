import { motion } from 'framer-motion';
import { Calendar, Edit, Trash2, Tag, X, Clock } from 'lucide-react';

export default function JournalDetail({ journal, onEdit, onDelete, onClose, darkMode }) {
  const getMoodColor = (mood) => {
    const colors = {
      happy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      excited: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      anxious: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      content: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      stressed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      contemplative: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
    };
    return colors[mood] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`sticky top-24 h-fit rounded-xl border-2 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-lg`}
    >
      {/* Header */}
      <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              {journal.title}
            </h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Calendar size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDate(journal.date)}
                </span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatTime(journal.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mood and Actions */}
        <div className="flex items-center justify-between mt-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getMoodColor(journal.mood)}`}>
            {journal.mood}
          </span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                darkMode 
                  ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </button>
            <button
              onClick={onDelete}
              className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                darkMode 
                  ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
          <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {journal.content}
          </p>
        </div>

        {/* Tags */}
        {journal.tags && journal.tags.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center mb-3">
              <Tag size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              <span className={`ml-1 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Tags
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {journal.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {journal.updatedAt !== journal.createdAt && (
          <div className={`mt-6 pt-4 border-t text-xs ${
            darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'
          }`}>
            Last updated: {formatDate(journal.updatedAt)} at {formatTime(journal.updatedAt)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
