import { motion } from 'framer-motion';
import { Calendar, Edit, Trash2, Tag, MapPin, Activity, Star } from 'lucide-react';

export default function JournalCard({ 
  journal, 
  isSelected, 
  isSelectionMode, 
  isChecked, 
  onClick, 
  onEdit, 
  onDelete, 
  darkMode 
}) {
  const emotionEmojis = {
    happy: '😊', sad: '😢', excited: '🤩', anxious: '😰', content: '😌', stressed: '😫',
    contemplative: '🤔', grateful: '🙏', angry: '😠', peaceful: '😇', confused: '😕', motivated: '💪'
  };

  const sentimentEmojis = { positive: '😊', negative: '😔', neutral: '😐' };
  const typeIcons = { gratitude: '🙏', reflection: '🤔', dream: '💭', daily: '📅' };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 120) => {
    if (!content) return 'No content available';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const truncateTitle = (title, maxLength = 50) => {
    if (!title) return 'Untitled Entry';
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  // Get card styling based on selection state
  const getCardStyling = () => {
    // Priority: Delete selection mode styling
    if (isSelectionMode && isChecked) {
      console.log('Delete selected journal:', journal);
      return darkMode
        ? 'border-red-400 bg-gray-800 shadow-red-500/20 ring-2 ring-red-500/50'
        : 'border-red-400 bg-white shadow-red-200/50 ring-2 ring-red-500/50';
    }
    // Regular view selection styling
    else if (isSelected && !isSelectionMode) {
      console.log('View selected journal:', journal);
      return darkMode
        ? 'border-blue-400 bg-gray-800 shadow-blue-500/20'
        : 'border-blue-400 bg-white shadow-blue-200/50';
    }
    // Default styling
    else {
      return darkMode
        ? 'border-gray-700 hover:border-gray-600 bg-gray-800'
        : 'border-gray-200 hover:border-gray-300 bg-white';
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        getCardStyling()
      } ${darkMode ? 'shadow-gray-900/20' : 'shadow-gray-200/50'} shadow-md hover:shadow-lg`}
      onClick={onClick}
    >
      {/* Selection Mode Checkbox */}
      {isSelectionMode && (
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {}} // Handled by parent onClick
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className={`ml-2 text-sm font-medium ${
            isChecked 
              ? (darkMode ? 'text-red-300' : 'text-red-700')
              : (darkMode ? 'text-gray-300' : 'text-gray-600')
          }`}>
            {isChecked ? 'Selected for deletion' : 'Select for deletion'}
          </span>
        </div>
      )}

      {/* Title - Prominent Display */}
      <div className="mb-3">
        <h3 className={`text-lg font-semibold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {truncateTitle(journal.title)}
        </h3>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{typeIcons[journal.entryType] || '📅'}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              {journal.entryType || 'daily'}
            </span>
          </div>
          <div className="flex items-center mt-1 text-sm">
            <Calendar size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatDate(journal.date || journal.createdAt)}
            </span>
          </div>
        </div>
        
        {/* Hide edit/delete buttons in selection mode */}
        {!isSelectionMode && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <Edit size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-red-900/30 text-gray-400 hover:text-red-400' 
                  : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
              }`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content Preview */}
      <p className={`text-sm leading-relaxed mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {truncateContent(journal.content)}
      </p>

      {/* Activity and Location */}
      {(journal.currentActivity || journal.location) && (
        <div className="flex items-center gap-4 mb-3 text-xs">
          {journal.currentActivity && (
            <div className="flex items-center">
              <Activity size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {journal.currentActivity}
              </span>
            </div>
          )}
          {journal.location && (
            <div className="flex items-center">
              <MapPin size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {journal.location}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Emotions */}
        <div className="flex items-center gap-2">
          {journal.emotions && journal.emotions.length > 0 && (
            <div className="flex items-center">
              <span className="text-sm">
                {journal.emotions.slice(0, 3).map(emotion => emotionEmojis[emotion] || '😐').join('')}
                {journal.emotions.length > 3 && '...'}
              </span>
            </div>
          )}
          
          {/* Sentiment */}
          {journal.sentiment && (
            <span className="text-sm">{sentimentEmojis[journal.sentiment] || '😐'}</span>
          )}
        </div>

        {/* Tags */}
        {journal.tags && journal.tags.length > 0 && (
          <div className="flex items-center">
            <Tag size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            <span className={`ml-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {journal.tags.length} tag{journal.tags.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
