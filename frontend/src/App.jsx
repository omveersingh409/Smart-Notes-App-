import React, { useState, useEffect } from 'react';
import { fetchNotes, deleteNote } from './api';
import { FiPlus, FiCpu } from 'react-icons/fi';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import NoteViewer from './components/NoteViewer';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'editor', 'viewer'
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const { data } = await fetchNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes', error);
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
        <h1><FiCpu /> Smart Notes</h1>
        {currentView !== 'editor' && (
          <button className="btn" onClick={handleCreateNew}>
            <FiPlus /> New Note
          </button>
        )}
      </header>

      <main>
        {currentView === 'list' && (
          <NoteList 
            notes={notes} 
            onView={handleViewNote} 
            onDelete={handleDelete} 
          />
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
