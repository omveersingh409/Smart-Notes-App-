const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.get('/', notesController.getNotes);
router.post('/', notesController.createNote);
router.delete('/:id', notesController.deleteNote);
router.put('/:id', notesController.updateNote);
router.post('/summarize', notesController.summarizeNote);
router.post('/generate-tags', notesController.generateTagsEndpoint);

module.exports = router;
