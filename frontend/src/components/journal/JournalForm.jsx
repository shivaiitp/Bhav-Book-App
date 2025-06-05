import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Tag, Smile, Activity, MapPin, Cloud, Camera, Trash2 } from 'lucide-react';
import Webcam from 'react-webcam';

export default function JournalForm({ journal, onSave, onClose, darkMode }) {
  const [formData, setFormData] = useState({
    emotions: [], content: '', currentActivity: '', tags: [], location: '',
    sentiment: 'neutral', entryType: 'daily', weather: '', insights: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  const emotions = [
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

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: "user"
  };

  useEffect(() => {
    if (journal) {
      setFormData({
        emotions: journal.emotions || [],
        content: journal.content || '',
        currentActivity: journal.currentActivity || '',
        tags: journal.tags || [],
        location: journal.location || '',
        sentiment: journal.sentiment || 'neutral',
        entryType: journal.entryType || 'daily',
        weather: journal.weather || '',
        insights: journal.insights || ''
      });
      if (journal.photo) {
        setCapturedImage(journal.photo);
      }
    }
  }, [journal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEmotion = (emotion) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
  }, [webcamRef]);

  const retakePhoto = () => {
    setCapturedImage(null);
    setShowCamera(true);
  };

  const removePhoto = () => {
    setCapturedImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;
    
    const submitData = { ...formData };
    if (capturedImage) {
      submitData.photo = capturedImage;
    }
    
    onSave(submitData);
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
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-2xl`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {journal ? 'Edit Entry' : 'New Entry'}
          </h2>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Take a Photo
                </h3>
                <button 
                  onClick={() => setShowCamera(false)} 
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="rounded-lg"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={capture}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Capture Photo
                </button>
                <button
                  onClick={() => setShowCamera(false)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Entry Type */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Type
              </label>
              <select 
                name="entryType" 
                value={formData.entryType} 
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                style={{
                  backgroundImage: darkMode 
                    ? `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
                    : `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.5em 1.5em',
                  backgroundRepeat: 'no-repeat',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="daily">📅 Daily</option>
                <option value="gratitude">🙏 Gratitude</option>
                <option value="reflection">🤔 Reflection</option>
                <option value="dream">💭 Dream</option>
              </select>
            </div>

            {/* Activity */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Activity size={16} className="inline mr-1" />Current Activity
              </label>
              <input
                type="text"
                name="currentActivity"
                value={formData.currentActivity}
                onChange={handleChange}
                placeholder="What are you doing?"
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Location & Weather */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <MapPin size={16} className="inline mr-1" />Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where are you?"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Cloud size={16} className="inline mr-1" />Weather
                </label>
                <select 
                  name="weather" 
                  value={formData.weather} 
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  style={{
                    backgroundImage: darkMode 
                      ? `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
                      : `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                    backgroundRepeat: 'no-repeat',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">Select Weather</option>
                  <option value="sunny">☀️ Sunny</option>
                  <option value="cloudy">☁️ Cloudy</option>
                  <option value="rainy">🌧️ Rainy</option>
                  <option value="stormy">⛈️ Stormy</option>
                  <option value="snowy">❄️ Snowy</option>
                  <option value="windy">💨 Windy</option>
                </select>
              </div>
            </div>

            {/* Sentiment */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Sentiment
              </label>
              <div className="flex gap-3">
                {['positive', 'neutral', 'negative'].map(sentiment => (
                  <label key={sentiment} className="flex items-center">
                    <input
                      type="radio"
                      name="sentiment"
                      value={sentiment}
                      checked={formData.sentiment === sentiment}
                      onChange={handleChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
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

            {/* Photo Capture */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Camera size={16} className="inline mr-1" />Photo
              </label>
              {capturedImage ? (
                <div className="relative">
                  <img src={capturedImage} alt="Captured" className="w-full h-48 object-cover rounded-lg" />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={retakePhoto}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Retake
                    </button>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm flex items-center hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={12} className="mr-1" />Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                    darkMode 
                      ? 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300' 
                      : 'border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600'
                  }`}
                >
                  <Camera size={24} className="mb-2" />
                  <span className="text-sm">Click to take photo</span>
                </button>
              )}
            </div>

            {/* Insights */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Insights
              </label>
              <textarea
                name="insights"
                value={formData.insights}
                onChange={handleChange}
                rows={3}
                placeholder="Additional reflections..."
                className={`w-full px-3 py-2 rounded-lg border resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Emotions */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Smile size={16} className="inline mr-1" />Emotions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {emotions.map(emotion => (
                  <button
                    key={emotion.value}
                    type="button"
                    onClick={() => toggleEmotion(emotion.value)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      formData.emotions.includes(emotion.value)
                        ? `border-${emotion.color}-500 bg-${emotion.color}-50 dark:bg-${emotion.color}-900/30 text-${emotion.color}-700 dark:text-${emotion.color}-300`
                        : darkMode
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700 text-gray-300'
                          : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700'
                    }`}
                  >
                    <div className="text-lg">{emotion.emoji}</div>
                    <div className="text-xs font-medium">{emotion.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                placeholder="What's on your mind?"
                className={`w-full px-3 py-2 rounded-lg border resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                required
              />
              <div className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formData.content.length} characters
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Tag size={16} className="inline mr-1" />Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
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
                      onClick={() => removeTag(tag)} 
                      className="ml-1 text-xs hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className={`flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button 
                  type="button" 
                  onClick={addTag} 
                  disabled={!tagInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`lg:col-span-2 flex gap-3 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button 
              type="button" 
              onClick={onClose} 
              className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center font-medium hover:bg-blue-700 transition-colors"
            >
              <Save size={16} className="mr-2" />
              {journal ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
