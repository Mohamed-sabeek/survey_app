/**
 * Validates the survey answers based on question requirements.
 * @param {Array} visibleQuestions - Questions currently shown to the user.
 * @param {Object} answers - Current state of answers.
 * @returns {Object} - { isValid: boolean, errors: { [questionId]: string } }
 */
export const validateSurvey = (visibleQuestions, answers) => {
  const errors = {};

  visibleQuestions.forEach((q) => {
    if (!q.required) return;

    const value = answers[q.id];
    const otherValue = answers[`${q.id}_other`];

    // Check basic presence
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      errors[q.id] = 'This field is required.';
      return;
    }

    // Check "Other" option if applicable
    if (q.hasOther) {
      if (q.type === 'radio' && value === 'other') {
        if (!otherValue || otherValue.trim() === '') {
          errors[q.id] = 'Please specify "Other" value.';
        }
      } else if (q.type === 'checkbox' && Array.isArray(value) && value.includes('other')) {
        if (!otherValue || otherValue.trim() === '') {
          errors[q.id] = 'Please specify "Other" value.';
        }
      }
    }

    // Text field validation
    if (q.type === 'text' && typeof value === 'string' && value.trim() === '') {
      errors[q.id] = 'This field is required.';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
