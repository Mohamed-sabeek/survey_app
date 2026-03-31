const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  gender: { type: String },
  age: { type: String },
  location: { type: String },
  areaType: { type: String },
  occupation: { type: String },
  income: { type: String },
  buySource: { type: String },
  wantsToSell: { type: String },
  phoneUsage: { type: String },
  buyingPreference: { type: String },
  suggestion: { type: String },
  
  buyItems: [{ type: String }],
  buyingProblems: [{ type: String }],
  missingProducts: [{ type: String }],
  sellItems: [{ type: String }],
  sellingProblems: [{ type: String }],
  services: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Survey', surveySchema);
