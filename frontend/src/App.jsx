import React, { useState, useEffect } from 'react';
import { fetchNotes, deleteNote } from './api';
import { FiPlus, FiCpu, FiSearch } from 'react-icons/fi';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import NoteViewer from './components/NoteViewer';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'editor', 'viewer'
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    // Check if title is an object (due to malformed DB entries previously) or string
    let titleStr = '';
    if (typeof note.title === 'string') {
      titleStr = note.title;
    } else if (typeof note.title === 'object') {
      titleStr = JSON.stringify(note.title);
    }
    
    return titleStr.toLowerCase().includes(query);
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const { data } = await fetchNotes();
      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        console.error('Expected array, received:', data);
        setNotes([]);
      }
    } catch (error) {
      console.error('Error fetching notes', error);
      setNotes([]);
    }
  };

  const handleCreateNew = () => {
    setSelectedNote(null);
    setCurrentView('editor');
  };

  const handleNoteCreated = () => {
    loadNotes();
    setCurrentView('list');
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setCurrentView('viewer');
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      loadNotes();
      if (selectedNote && selectedNote._id === id) {
        setCurrentView('list');
      }
    } catch (error) {
      console.error('Error deleting note', error);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiCpu style={{ color: '#818cf8' }} />
          <span className="gradient-text">Smart Notes</span>
        </h1>
        {currentView !== 'editor' && (
          <button className="btn" onClick={handleCreateNew}>
            <FiPlus /> New Note
          </button>
        )}
      </header>

      <main>
        {currentView === 'list' && (
          <>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', background: 'var(--surface-color)', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <FiSearch style={{ color: 'var(--text-secondary)', marginRight: '0.8rem' }} size={20} />
              <input 
                type="text" 
                placeholder="Search notes by title..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }}
              />
            </div>
            <NoteList 
              notes={filteredNotes} 
              onView={handleViewNote} 
              onDelete={handleDelete} 
            />
          </>
        )}
        
        {currentView === 'editor' && (
          <NoteEditor 
            onCancel={() => setCurrentView('list')} 
            onSuccess={handleNoteCreated} 
          />
        )}

        {currentView === 'viewer' && selectedNote && (
          <NoteViewer 
            note={selectedNote} 
            onBack={() => setCurrentView('list')} 
            onDelete={() => handleDelete(selectedNote._id)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
