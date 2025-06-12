import React from 'react';

const CompleteQuiz = React.lazy(() => import('./CompleteQuiz'));
const Options = React.lazy(() => import('./Options'));
const Question = React.lazy(() => import('./Question'));

const useQuizComponents = () => ({
    CompleteQuiz,
    Options,
    Question
})

export default useQuizComponents;