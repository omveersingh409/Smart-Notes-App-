import React from 'react';
import { FiTrash2, FiTag } from 'react-icons/fi';

const NoteList = ({ notes, onView, onDelete }) => {
  if (notes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
        <h2>No notes yet!</h2>
        <p>Create your first note to get started.</p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map(note => (
        <div
          key={note._id}
          className="note-card"
          onClick={() => onView(note)}
          style={{ backgroundColor: note.color || 'var(--surface-color)' }}
        >
          <h3>{typeof note.title === 'object' ? JSON.stringify(note.title) : note.title}</h3>
          <p>{typeof note.content === 'object' ? JSON.stringify(note.content) : note.content}</p>
          {note.tags && note.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem', marginBottom: '0.5rem', flexShrink: 0 }}>
              {note.tags.map((tag, index) => {
                const tagText = typeof tag === 'object' ? (tag.name || JSON.stringify(tag)) : tag;
                if (!tagText || tagText === '{}') return null;
                return (
                  <span key={index} className="tag-chip">
                    <FiTag size={12} /> {tagText}
                  </span>
                );
              })}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', flexShrink: 0 }}>
            <span className="date">{new Date(note.createdAt).toLocaleDateString()}</span>
            <button
              className="btn danger outline"
              style={{ padding: '0.4rem', borderRadius: '50%' }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note._id);
              }}
              title="Delete Note"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
