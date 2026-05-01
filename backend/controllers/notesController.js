const SummarizerManager = require("node-summarizer").SummarizerManager;
const Note = require('../models/Note');

const keyword_extractor = require('keyword-extractor');

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generateTags = (text) => {
  if (!text) return [];
  const extracted = keyword_extractor.extract(text, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true
  });
  return extracted.slice(0, 5); // Return top 5 keywords as tags
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const tags = generateTags(`${title} ${content}`);
    const newNote = new Note({ title, content, tags, color });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.title || updateData.content) {
      updateData.tags = generateTags(`${updateData.title || ''} ${updateData.content || ''}`);
    }
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Summarize note
exports.summarizeNote = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    try {
      const sentencesCount = Math.max(1, Math.ceil(content.split(/[.!?]/).length / 3));
      const Summarizer = new SummarizerManager(content, sentencesCount);
      const summaryObj = await Summarizer.getSummaryByRank();
      
      return res.json({ 
        summary: summaryObj.summary 
      });
    } catch (localErr) {
      return res.json({ 
        summary: "Could not generate summary. Your note might be too short!" 
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate tags for endpoint
exports.generateTagsEndpoint = async (req, res) => {
  try {
    const { content } = req.body;
    const tags = generateTags(content);
    res.json({ tags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
