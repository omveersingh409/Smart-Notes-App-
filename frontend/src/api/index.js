import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api', // update to backend URL
});

export const fetchNotes = () => API.get('/notes');
export const createNote = (newNote) => API.post('/notes', newNote);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const summarizeNote = (content) => API.post('/notes/summarize', { content });
