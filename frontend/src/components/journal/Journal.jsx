import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Edit, Trash2, X, Save } from 'lucide-react';
import JournalCard from './JournalCard';
import JournalDetail from './JournalDetail';
import JournalForm from './JournalForm';
import MobileJournalSlider from './MobileJournalSlider'; 
import { API_BASE_URL } from '../../config/api'

export default function JournalPage() {
  const { darkMode } = useSelector((state) => state.theme);
  const { user, token } = useSelector((state) => state.auth);
  
  // State management
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSlider, setShowMobileSlider] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all journal entries
  const fetchJournals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/journal`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJournals(data.journals || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch journals');
      }
    } catch (error) {
      console.error('Error fetching journals:', error);
      setError('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single journal entry by ID
  const fetchJournalById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.journal;
      } else {
        console.error('Failed to fetch journal by ID');
        return null;
      }
    } catch (error) {
      console.error('Error fetching journal by ID:', error);
      return null;
    }
  };

  // Create new journal entry
  const createJournal = async (journalData) => {
    try {
      const formData = new FormData();
      
      // Append all journal data to FormData
      formData.append('title', journalData.title);
      formData.append('content', journalData.content);
      formData.append('mood', journalData.mood);
      formData.append('date', journalData.date);
      
      // Handle tags - convert array to JSON string
      if (journalData.tags && journalData.tags.length > 0) {
        formData.append('tags', JSON.stringify(journalData.tags));
      }

      // Handle media files if any
      if (journalData.media && journalData.media.length > 0) {
        journalData.media.forEach((file, index) => {
          formData.append('media', file);
        });
      }

      const response = await fetch(`${API_BASE_URL}/journal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setJournals(prev => [data.journal, ...prev]);
        setIsFormOpen(false);
        setError(null);
        return data.journal;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create journal entry');
        return null;
      }
    } catch (error) {
      console.error('Error creating journal:', error);
      setError('Failed to create journal entry');
      return null;
    }
  };

  // Update journal entry
  const updateJournal = async (id, journalData) => {
    try {
      const formData = new FormData();
      
      // Append all journal data to FormData
      formData.append('title', journalData.title);
      formData.append('content', journalData.content);
      formData.append('mood', journalData.mood);
      formData.append('date', journalData.date);
      
      // Handle tags - convert array to JSON string
      if (journalData.tags && journalData.tags.length > 0) {
        formData.append('tags', JSON.stringify(journalData.tags));
      }

      // Handle media files if any
      if (journalData.media && journalData.media.length > 0) {
        journalData.media.forEach((file, index) => {
          formData.append('media', file);
        });
      }

      const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setJournals(prev => prev.map(journal => 
          journal.id === id ? data.journal : journal
        ));
        
        // Update selected journal if it's the one being edited
        if (selectedJournal && selectedJournal.id === id) {
          setSelectedJournal(data.journal);
        }
        
        setEditingJournal(null);
        setIsFormOpen(false);
        setError(null);
        return data.journal;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update journal entry');
        return null;
      }
    } catch (error) {
      console.error('Error updating journal:', error);
      setError('Failed to update journal entry');
      return null;
    }
  };

  // Delete journal entry
  const deleteJournal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setJournals(prev => prev.filter(journal => journal.id !== id));
        
        // Clear selected journal if it's the one being deleted
        if (selectedJournal && selectedJournal.id === id) {
          setSelectedJournal(null);
        }
        
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete journal entry');
      }
    } catch (error) {
      console.error('Error deleting journal:', error);
      setError('Failed to delete journal entry');
    }
  };

  // Initialize data
  useEffect(() => {
    if (token) {
      fetchJournals();
    }
  }, [token]);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter and sort journals
  const filteredJournals = journals
    .filter(journal => {
      const matchesSearch = journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           journal.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (journal.tags && journal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesMood = filterMood === 'all' || journal.mood === filterMood;
      return matchesSearch && matchesMood;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Handle journal selection
  const handleJournalSelect = async (journal) => {
    // Fetch full journal details
    const fullJournal = await fetchJournalById(journal.id);
    if (fullJournal) {
      setSelectedJournal(fullJournal);
      if (isMobile) {
        setShowMobileSlider(true);
      }
    }
  };

  // Handle journal creation
  const handleCreateJournal = async (journalData) => {
    await createJournal(journalData);
  };

  // Handle journal update
  const handleUpdateJournal = async (journalData) => {
    if (editingJournal) {
      await updateJournal(editingJournal.id, journalData);
    }
  };

  // Handle journal deletion
  const handleDeleteJournal = async (journalId) => {
    await deleteJournal(journalId);
  };

  // Handle edit
  const handleEditJournal = (journal) => {
    setEditingJournal(journal);
    setIsFormOpen(true);
  };

  const moodOptions = [
    { value: 'all', label: 'All Moods' },
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'excited', label: 'Excited' },
    { value: 'anxious', label: 'Anxious' },
    { value: 'content', label: 'Content' },
    { value: 'stressed', label: 'Stressed' },
    { value: 'contemplative', label: 'Contemplative' }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen pt-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className={`ml-3 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading your journals...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
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
              onClick={() => {
                setEditingJournal(null);
                setIsFormOpen(true);
              }}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={20} className="mr-2" />
              New Entry
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search journals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              {moodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Left Side - Journal Cards */}
          <div className={`${selectedJournal && !isMobile ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
            {filteredJournals.length === 0 ? (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {searchQuery || filterMood !== 'all' ? (
                  <div>
                    <Search size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No journals found</p>
                    <p>Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  <div>
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No journal entries yet</p>
                    <p>Start your journaling journey by creating your first entry</p>
                    <button
                      onClick={() => {
                        setEditingJournal(null);
                        setIsFormOpen(true);
                      }}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Plus size={20} className="mr-2" />
                      Create First Entry
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredJournals.map((journal) => (
                  <JournalCard
                    key={journal.id}
                    journal={journal}
                    isSelected={selectedJournal?.id === journal.id}
                    onClick={() => handleJournalSelect(journal)}
                    onEdit={() => handleEditJournal(journal)}
                    onDelete={() => handleDeleteJournal(journal.id)}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Journal Detail (Desktop Only) */}
          {selectedJournal && !isMobile && (
            <div className="w-1/2">
              <JournalDetail
                journal={selectedJournal}
                onEdit={() => handleEditJournal(selectedJournal)}
                onDelete={() => handleDeleteJournal(selectedJournal.id)}
                onClose={() => setSelectedJournal(null)}
                darkMode={darkMode}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Journal Slider */}
      {isMobile && (
        <MobileJournalSlider
          journal={selectedJournal}
          isOpen={showMobileSlider}
          onClose={() => {
            setShowMobileSlider(false);
            setSelectedJournal(null);
          }}
          onEdit={() => {
            setShowMobileSlider(false);
            handleEditJournal(selectedJournal);
          }}
          onDelete={() => {
            setShowMobileSlider(false);
            handleDeleteJournal(selectedJournal.id);
          }}
          darkMode={darkMode}
        />
      )}

      {/* Journal Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <JournalForm
            journal={editingJournal}
            onSave={editingJournal ? handleUpdateJournal : handleCreateJournal}
            onClose={() => {
              setIsFormOpen(false);
              setEditingJournal(null);
            }}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
