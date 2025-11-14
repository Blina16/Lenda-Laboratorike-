const reviewsModel = require('../models/reviewsModel');

async function listReviews(req, res) {
  try {
    const rows = await reviewsModel.listReviews(req.query || {});
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function createReview(req, res) {
  try {
    const { from_role, from_id, to_role, to_id, rating, comment } = req.body || {};
    if (!from_role || !from_id || !to_role || !to_id || !rating) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Missing required fields' });
    }
    const result = await reviewsModel.createReview({ from_role, from_id, to_role, to_id, rating, comment });
    res.status(201).json({ id: result.insertId, from_role, from_id: Number(from_id), to_role, to_id: Number(to_id), rating: Number(rating), comment: comment || '' });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function updateReview(req, res) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body || {};
    await reviewsModel.updateReview(id, { rating, comment });
    res.json({ id: Number(id), rating: Number(rating), comment: comment || '' });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    await reviewsModel.deleteReview(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

module.exports = {
  listReviews,
  createReview,
  updateReview,
  deleteReview,
};
