import { motion } from 'framer-motion';
import { Calendar, Edit, Trash2, Tag, MapPin, Activity, Star } from 'lucide-react';

export default function JournalCard({ journal, isSelected, onClick, onEdit, onDelete, darkMode }) {
  const getEmotionColors = (emotions) => {
    if (!emotions || emotions.length === 0) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    const emotionColorMap = {
      happy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      excited: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      anxious: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      content: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      stressed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    };
    
    return emotionColorMap[emotions[0]] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  const getEntryTypeIcon = (entryType) => {
    switch (entryType) {
      case 'gratitude': return '🙏';
      case 'reflection': return '🤔';
      case 'dream': return '💭';
      default: return '📅';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 shadow-lg'
          : darkMode
          ? 'border-gray-700 hover:border-gray-600 bg-gray-800'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      } ${darkMode ? 'shadow-gray-900/20' : 'shadow-gray-200/50'} shadow-md hover:shadow-lg`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getEntryTypeIcon(journal.entryType)}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${getEmotionColors(journal.emotions)}`}>
              {journal.entryType}
            </span>
          </div>
          <div className="flex items-center mt-1 text-sm">
            <Calendar size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatDate(journal.date)}
            </span>
          </div>
        </div>
        
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
                {journal.emotions.slice(0, 3).map(emotion => {
                  const emotionEmojis = {
                    happy: '😊', sad: '😢', excited: '🤩', anxious: '😰',
                    content: '😌', stressed: '😫', contemplative: '🤔',
                    grateful: '🙏', angry: '😠', peaceful: '😇', confused: '😕', motivated: '💪'
                  };
                  return emotionEmojis[emotion] || '😐';
                }).join('')}
                {journal.emotions.length > 3 && '...'}
              </span>
            </div>
          )}
          
          {/* Sentiment */}
          <span className="text-sm">{getSentimentEmoji(journal.sentiment)}</span>
          
          {/* Mood Rating */}
          {journal.moodRating && (
            <div className="flex items-center">
              <Star size={12} className="text-yellow-500" />
              <span className={`ml-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {journal.moodRating}/10
              </span>
            </div>
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
    </motion.div>
  );
}
