import React, { useState } from "react";
import { Difficulty, fetchQuizQuestions, QuestionState } from "./API";
import QuestionCard from "./components/QuestionCard";

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameover, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameover) {
      // User's answer
      const answer = e.currentTarget.value;
      // Check answer against correct value
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if (correct) setScore((prev) => prev + 1);
      // Save answer in array for user answers
      const answerObj: AnswerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers(prev => [...prev, answerObj])
    }
  };

  const nextQuestion = () => {
    // Move onto the next question if it's not the last quesiton
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <div className="App">
      <h1>Typescript React Quiz</h1>
      {gameover || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className="start" onClick={startTrivia}>
          Start
        </button>
      ) : null}
      {!gameover && !loading && <p className="score">Score: {score}</p>}
      {loading && <p>Loading Questions...</p>}
      {!loading && !gameover && (
        <QuestionCard
          questionNum={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {!gameover &&
      !loading &&
      userAnswers.length === number + 1 &&
      number !== TOTAL_QUESTIONS - 1 ? (
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
      ) : null}
    </div>
  );
};

export default App;
