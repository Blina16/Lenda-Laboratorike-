const tutorsModel = require('../models/tutorsModel');

async function listTutors(req, res) {
  try {
    const results = await tutorsModel.listTutors();
    res.json(results);
  } catch (err) {
    console.error('Error fetching tutors:', err);
    const errorMessage = err.message || 'Unknown database error';
    const isConnectionError = errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ER_ACCESS_DENIED') || errorMessage.includes('connect');
    res.status(500).json({ 
      error: 'DB_ERROR', 
      message: isConnectionError 
        ? 'Cannot connect to MySQL database. Please make sure MySQL server is running.' 
        : errorMessage,
      details: err.message 
    });
  }
}

async function createTutor(req, res) {
  const { name, surname, bio, rate } = req.body || {};
  if (!name || !surname) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'name and surname are required' });
  }
  try {
    const result = await tutorsModel.createTutor({ name, surname, bio, rate });
    res.status(201).json({ id: result.insertId, name, surname, bio: bio || '', rate: Number(rate) || 0 });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message, details: err });
  }
}

async function updateTutor(req, res) {
  const { id } = req.params;
  const { name, surname, bio, rate } = req.body || {};
  try {
    await tutorsModel.updateTutor(id, { name, surname, bio, rate });
    res.json({ id, name: name || '', surname: surname || '', bio: bio || '', rate: Number(rate) || 0 });
  } catch (err) {
    console.error('Error updating tutor:', err);
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
}

async function deleteTutor(req, res) {
  const { id } = req.params;
  try {
    await tutorsModel.deleteTutor(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting tutor:', err);
    res.status(500).json({ error: 'DB_ERROR', details: err.message });
  }
}

module.exports = {
  listTutors,
  createTutor,
  updateTutor,
  deleteTutor,
};
