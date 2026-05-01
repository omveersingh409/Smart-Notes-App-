import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api',
});

export const fetchNotes = () => API.get('/notes');
export const createNote = (newNote) => API.post('/notes', newNote);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const summarizeNote = (content) => API.post('/notes/summarize', { content });
