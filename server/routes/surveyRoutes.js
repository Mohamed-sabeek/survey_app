const express = require('express');
const router = express.Router();
const { saveSurvey } = require('../controllers/surveyController');

router.post('/', saveSurvey);

module.exports = router;
