import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // update to backend URL
});

export const fetchNotes = () => API.get('/notes');
export const createNote = (newNote) => API.post('/notes', newNote);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const summarizeNote = (content) => API.post('/notes/summarize', { content });
