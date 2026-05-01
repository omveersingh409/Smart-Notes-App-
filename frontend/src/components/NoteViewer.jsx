import React, { useState } from 'react';
import { summarizeNote } from '../api';
import { FiArrowLeft, FiTrash2, FiZap, FiTag } from 'react-icons/fi';

const NoteViewer = ({ note, onBack, onDelete }) => {
  const [summary, setSummary] = useState(note.summary || '');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setError('');
    try {
      const { data } = await summarizeNote(note.content);
      setSummary(data.summary);
      // Optional: you could save this summary back to the database here
    } catch (err) {
      console.error('Error summarizing note:', err);
      setError('Failed to generate summary. Make sure the API key is valid.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="view-container" style={{ backgroundColor: note.color || 'var(--surface-color)' }}>
      <div className="viewer-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button className="btn outline" onClick={onBack}>
          <FiArrowLeft /> Back
        </button>
        <div className="viewer-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn outline" style={{ color: '#a78bfa', borderColor: '#a78bfa' }} onClick={handleSummarize} disabled={isSummarizing}>
            {isSummarizing ? <span className="loader"></span> : <><FiZap /> Summarize</>}
          </button>
          <button className="btn danger" onClick={onDelete}>
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {typeof note.title === 'object' ? JSON.stringify(note.title) : note.title}
      </h2>

      {note.tags && note.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
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
      
      <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        {typeof note.content === 'object' ? JSON.stringify(note.content) : note.content}
      </p>

      {error && (
        <div style={{ marginTop: '1.5rem', color: 'var(--danger-color)', padding: '1rem', border: '1px solid var(--danger-color)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {summary && (
        <div className="ai-summary">
          <h4><FiZap /> AI Summary</h4>
          <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
            {typeof summary === 'object' ? JSON.stringify(summary) : summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default NoteViewer;
