/**
 * Formats the survey answers for backend submission.
 * @param {Array} visibleQuestions - Questions currently shown to the user.
 * @param {Object} answers - Current state of answers.
 * @returns {Object} - { occupation: string, responses: Array }
 */
export const formatPayload = (visibleQuestions, answers) => {
  const responses = [];
  const occupation = answers['q_occupation'] || '';

  visibleQuestions.forEach((q) => {
    // We send common fields in responses too, but keep occupation separate as requested
    if (q.id === 'q_occupation') return; 

    let answer = answers[q.id];

    // Handle "Other" options for radio and checkbox types
    if (q.hasOther) {
      if (q.type === 'radio' && answer === 'other') {
        answer = answers[`${q.id}_other`] || 'other';
      } else if (q.type === 'checkbox' && Array.isArray(answer) && answer.includes('other')) {
        const otherText = answers[`${q.id}_other`] || '';
        answer = [...answer.filter(v => v !== 'other'), otherText].filter(v => v !== '');
      }
    }

    responses.push({
      questionId: q.id,
      answer: answer || '',
    });
  });

  return {
    occupation,
    responses,
  };
};
