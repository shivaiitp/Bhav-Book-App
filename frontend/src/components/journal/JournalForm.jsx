import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Calendar, Tag, Smile, Upload, Image, Trash2, MapPin, Cloud, Star, Activity } from 'lucide-react';

export default function JournalForm({ journal, onSave, onClose, darkMode }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    emotions: [],
    content: '',
    currentActivity: '',
    tags: [],
    location: '',
    moodRating: 5,
    sentiment: 'neutral',
    reminderTime: '',
    entryType: 'daily',
    attachment: null,
    weather: '',
    insights: '',
    photo: null
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [mediaPreview, setMediaPreview] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const emotionOptions = [
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'yellow' },
    { value: 'sad', label: 'Sad', emoji: '😢', color: 'blue' },
    { value: 'excited', label: 'Excited', emoji: '🤩', color: 'orange' },
    { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'red' },
    { value: 'content', label: 'Content', emoji: '😌', color: 'green' },
    { value: 'stressed', label: 'Stressed', emoji: '😫', color: 'purple' },
    { value: 'contemplative', label: 'Contemplative', emoji: '🤔', color: 'indigo' },
    { value: 'grateful', label: 'Grateful', emoji: '🙏', color: 'pink' },
    { value: 'angry', label: 'Angry', emoji: '😠', color: 'red' },
    { value: 'peaceful', label: 'Peaceful', emoji: '😇', color: 'blue' },
    { value: 'confused', label: 'Confused', emoji: '😕', color: 'gray' },
    { value: 'motivated', label: 'Motivated', emoji: '💪', color: 'green' }
  ];

  const entryTypes = [
    { value: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { value: 'reflection', label: 'Reflection', icon: '🤔' },
    { value: 'dream', label: 'Dream', icon: '💭' },
    { value: 'daily', label: 'Daily', icon: '📅' }
  ];

  const weatherOptions = [
    { value: '', label: 'Select Weather' },
    { value: 'sunny', label: 'Sunny ☀️' },
    { value: 'cloudy', label: 'Cloudy ☁️' },
    { value: 'rainy', label: 'Rainy 🌧️' },
    { value: 'stormy', label: 'Stormy ⛈️' },
    { value: 'snowy', label: 'Snowy ❄️' },
    { value: 'windy', label: 'Windy 💨' },
    { value: 'foggy', label: 'Foggy 🌫️' }
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (journal) {
      setFormData({
        date: journal.date ? new Date(journal.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        emotions: journal.emotions || [],
        content: journal.content || '',
        currentActivity: journal.currentActivity || '',
        tags: journal.tags || [],
        location: journal.location || '',
        moodRating: journal.moodRating || 5,
        sentiment: journal.sentiment || 'neutral',
        reminderTime: journal.reminderTime ? new Date(journal.reminderTime).toISOString().slice(0, 16) : '',
        entryType: journal.entryType || 'daily',
        attachment: null,
        weather: journal.weather || '',
        insights: journal.insights || '',
        photo: null
      });
      
      // Set existing media preview if available
      if (journal.attachment) {
        setMediaPreview(journal.attachment);
      }
      if (journal.photo) {
        setPhotoPreview(journal.photo);
      }
    }
  }, [journal]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEmotionToggle = (emotion) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAttachmentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (isValidSize) {
        setFormData(prev => ({
          ...prev,
          attachment: file
        }));
        setMediaPreview(URL.createObjectURL(file));
      } else {
        alert('File size must be less than 10MB');
      }
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit for photos
      
      if (isValidSize) {
        setFormData(prev => ({
          ...prev,
          photo: file
        }));
        setPhotoPreview(URL.createObjectURL(file));
      } else {
        alert('Photo size must be less than 5MB');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name === 'tagInput') {
      handleTagAdd(e);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-2xl`}
      >
        {/* Header */}
        <div className={`sticky top-0 px-6 py-4 border-b ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        } rounded-t-xl`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {journal ? 'Edit Journal Entry' : 'New Journal Entry'}
            </h2>
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Date and Entry Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Calendar size={16} className="inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Entry Type
                  </label>
                  <select
                    name="entryType"
                    value={formData.entryType}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    {entryTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Activity */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Activity size={16} className="inline mr-1" />
                  Current Activity
                </label>
                <input
                  type="text"
                  name="currentActivity"
                  value={formData.currentActivity}
                  onChange={handleInputChange}
                  placeholder="What are you doing? (e.g., Studying, Walking, Having coffee)"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>

              {/* Location and Weather */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <MapPin size={16} className="inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Where are you?"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Cloud size={16} className="inline mr-1" />
                    Weather
                  </label>
                  <select
                    name="weather"
                    value={formData.weather}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    {weatherOptions.map(weather => (
                      <option key={weather.value} value={weather.value}>
                        {weather.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mood Rating */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Star size={16} className="inline mr-1" />
                  Mood Rating (1-10): {formData.moodRating}
                </label>
                <input
                  type="range"
                  name="moodRating"
                  min="1"
                  max="10"
                  value={formData.moodRating}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 (Very Low)</span>
                  <span>5 (Neutral)</span>
                  <span>10 (Very High)</span>
                </div>
              </div>

              {/* Sentiment */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Overall Sentiment
                </label>
                <div className="flex gap-3">
                  {['positive', 'neutral', 'negative'].map(sentiment => (
                    <label key={sentiment} className="flex items-center">
                      <input
                        type="radio"
                        name="sentiment"
                        value={sentiment}
                        checked={formData.sentiment === sentiment}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className={`capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {sentiment === 'positive' && '😊'} 
                        {sentiment === 'neutral' && '😐'} 
                        {sentiment === 'negative' && '😔'} 
                        {sentiment}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reminder Time */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Reminder Time (optional)
                </label>
                <input
                  type="datetime-local"
                  name="reminderTime"
                  value={formData.reminderTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Emotions Selection */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Smile size={16} className="inline mr-1" />
                  How are you feeling? (Select multiple)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {emotionOptions.map((emotion) => (
                    <button
                      key={emotion.value}
                      type="button"
                      onClick={() => handleEmotionToggle(emotion.value)}
                      className={`p-2 rounded-lg border-2 transition-all text-center text-xs ${
                        formData.emotions.includes(emotion.value)
                          ? `border-${emotion.color}-500 bg-${emotion.color}-50 dark:bg-${emotion.color}-900/30`
                          : darkMode
                            ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-lg mb-1">{emotion.emoji}</div>
                      <div className={`font-medium ${
                        formData.emotions.includes(emotion.value)
                          ? `text-${emotion.color}-700 dark:text-${emotion.color}-300`
                          : darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {emotion.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your thoughts *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="What's on your mind today? Write freely about your thoughts, feelings, experiences..."
                  className={`w-full px-3 py-2 rounded-lg border resize-none ${
                    errors.content 
                      ? 'border-red-500' 
                      : darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                )}
                <div className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.content.length} characters
                </div>
              </div>

              {/* Insights */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Additional Insights & Reflections
                </label>
                <textarea
                  name="insights"
                  value={formData.insights}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any additional thoughts, patterns you notice, or insights about this entry..."
                  className={`w-full px-3 py-2 rounded-lg border resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>

              {/* Tags */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Tag size={16} className="inline mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-2 py-1 rounded-md text-sm ${
                        darkMode 
                          ? 'bg-blue-900/30 text-blue-300' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className={`flex-1 px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <button
                    type="button"
                    onClick={handleTagAdd}
                    disabled={!tagInput.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Media Uploads */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attachment Upload */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Upload size={16} className="inline mr-1" />
                Attachment (optional)
              </label>
              
              {mediaPreview && (
                <div className="mb-3 relative">
                  {typeof mediaPreview === 'string' && mediaPreview.includes('video') ? (
                    <video src={mediaPreview} className="w-full h-32 object-cover rounded-lg" controls />
                  ) : (
                    <img src={mediaPreview} alt="Attachment preview" className="w-full h-32 object-cover rounded-lg" />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPreview(null);
                      setFormData(prev => ({ ...prev, attachment: null }));
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleAttachmentUpload}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Image size={16} className="inline mr-1" />
                Photo (for emotion analysis)
              </label>
              
              {photoPreview && (
                <div className="mb-3 relative">
                  <img src={photoPreview} alt="Photo preview" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setFormData(prev => ({ ...prev, photo: null }));
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg border font-medium transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Save size={16} className="mr-2" />
              {journal ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
