import React, { useState } from "react";
import { CloseOutline } from 'react-ionicons';

function Modal({ setOpenModal }) {

const questions = [
    {
        questionText: "What is the capital of France?",
        answerOptions: [
        { answerText: "London", isCorrect: false },
        { answerText: "Berlin", isCorrect: false },
        { answerText: "Paris", isCorrect: true },
        { answerText: "Madrid", isCorrect: false },
        ],
    },
    {
        questionText: "Which planet is known as the Red Planet?",
        answerOptions: [
        { answerText: "Mars", isCorrect: true },
        { answerText: "Earth", isCorrect: false },
        { answerText: "Venus", isCorrect: false },
        { answerText: "Jupiter", isCorrect: false },
        ],
    },

];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));

  

  const handleAnswerClick = (isCorrect, index) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[index] = isCorrect;
    setUserAnswers(updatedUserAnswers);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setShowScore(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const modalBackgroundStyle = {
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
    zIndex: 999,
  };

  const modalContainerStyle = {
    width: "80%",
    maxWidth: "500px",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    padding: "20px",
  };

  const titleCloseBtnStyle = {
    display: "flex",
    justifyContent: "flex-end",
  };

  const closeButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  };

  const titleStyle = {
    textAlign: "center",
    marginTop: "10px",
    fontSize: "24px",
    fontWeight: "bold",
  };

  const bodyStyle = {
    fontSize: "1.2rem",
    textAlign: "center",
    marginBottom: "20px",
  };

  const answerOptionsStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const answerButtonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  return (
    <div style={modalBackgroundStyle} className="modalBackground">
      <div style={modalContainerStyle} className="modalContainer">
        <div style={titleCloseBtnStyle} className="titleCloseBtn">
          <button
            style={closeButtonStyle}
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <CloseOutline
              color={'#00000'} 
              title={""}
              height="35px"
              width="35px"
            />
          </button>
        </div>
        <div style={titleStyle} className="title">
          <h1>Test your knowledge!</h1>
        </div>

        {showScore ? (
          <div className="score">
            <h2>Your Score: {score}/{questions.length}</h2>
            <div className="answersSummary">
              {questions.map((question, index) => (
                <p key={index} style={{ color: userAnswers[index] ? "green" : "red" }}>
                  {question.questionText} - {userAnswers[index] ? "Correct" : "Incorrect"}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={bodyStyle} className="body">
              <p>{currentQuestion.questionText}</p>
            </div>

            <div style={answerOptionsStyle} className="answerOptions">
              {currentQuestion.answerOptions.map((option, index) => (
                <button
                  key={index}
                  style={answerButtonStyle}
                  onClick={() => handleAnswerClick(option.isCorrect, currentQuestionIndex)}
                >
                  {option.answerText}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
