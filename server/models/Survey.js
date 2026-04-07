const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  occupation: { 
    type: String, 
    required: true,
    enum: ['farming', 'labour', 'business', 'student', 'homemaker', 'other']
  },
  responses: [
    {
      questionId: { type: String, required: true },
      answer: { type: mongoose.Schema.Types.Mixed } // Can be string or array
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Survey', surveySchema);
