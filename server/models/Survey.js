const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  q1: { type: String }, // Gender
  q2: { type: String }, // Age
  q3: { type: String }, // Location
  q4: { type: String }, // Area Type
  q5: { type: String }, // Occupation
  q6: { type: String }, // Monthly Income
  q7: { type: String }, // Most often buy
  q8: { type: String }, // Buy source
  q9: { type: String }, // Buying problems
  q10: { type: String }, // Missing products/services
  q11: { type: String }, // Wants to sell?
  q12: [{ type: String }], // What can you sell? (Checkbox - show if q11=Yes)
  q13: { type: String }, // Selling problems
  q14: { type: String }, // Biggest local problem
  q15: { type: String }, // Hardest daily task
  q16: { type: String }, // Service wish
  q17: { type: String }, // Overpriced items
  q18: { type: String }, // Digital task problem
  q19: { type: String }, // Phone usage
  q20: { type: String }, // Buying preference
  q21: { type: String }, // Improve daily life
  q22: { type: String }, // New service usage
  q23: { type: String }, // One problem solve
  q24: { type: String }, // Suggestions
}, { timestamps: true });

module.exports = mongoose.model('Survey', surveySchema);
