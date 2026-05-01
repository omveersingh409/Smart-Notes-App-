let app;
try {
  app = require('../backend/server.js');
} catch (error) {
  app = (req, res) => res.status(500).json({ error: error.message, stack: error.stack });
}
module.exports = app;
