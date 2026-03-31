const Survey = require('../models/Survey');

// @desc    Save survey response
// @route   POST /api/survey
// @access  Public
const saveSurvey = async (req, res) => {
  try {
    const survey = new Survey(req.body);
    const createdSurvey = await survey.save();
    res.status(201).json(createdSurvey);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || 'Invalid survey data' });
  }
};

module.exports = {
  saveSurvey
};
