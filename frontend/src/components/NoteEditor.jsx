import React, { useState } from 'react';
import { createNote } from '../api';
import { FiSave, FiX } from 'react-icons/fi';

const NoteEditor = ({ onCancel, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#1e293b');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = [
    '#1e293b', // Default dark
    '#1e3a8a', // Blue
    '#064e3b', // Green
    '#7f1d1d', // Red
    '#4c1d95', // Purple
    '#78350f', // Orange/Brown
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await createNote({ title, content, color });
      onSuccess();
    } catch (error) {
      console.error('Error creating note', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="view-container" style={{ backgroundColor: color }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Create New Note</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
            autoFocus
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="Start typing your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Background Color</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {colors.map(c => (
              <button
                key={c}
                type="button"
                className={`color-swatch ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                title="Select color"
              />
            ))}
          </div>
        </div>
        
        <div className="actions">
          <button type="submit" className="btn" disabled={isSubmitting || !title.trim() || !content.trim()}>
            {isSubmitting ? <span className="loader"></span> : <><FiSave /> Save Note</>}
          </button>
          <button type="button" className="btn outline" onClick={onCancel} disabled={isSubmitting}>
            <FiX /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteEditor;
