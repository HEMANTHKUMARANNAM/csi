import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Image } from 'react-bootstrap';

import { ip } from './constants';

const TeamPortal = () => {
  const [teamName, setTeamName] = useState(localStorage.getItem('teamName') || '');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('teamName'));
  const [visibleQuestionIndex, setVisibleQuestionIndex] = useState(-1);
  const [timer, setTimer] = useState(30);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchVisibility = async () => {
        try {
          const response = await axios.get(`http://${ip}:4000/visibility`);
          setVisibleQuestionIndex(response.data.visibility);
        } catch (error) {
          console.error('Error fetching visibility:', error);
        }
      };

      fetchVisibility();
      const interval = setInterval(fetchVisibility, 100);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    let countdown;
    if (visibleQuestionIndex !== -1) {
      setTimer(30);
      countdown = setInterval(() => {
        setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    } else {
      setTimer(30);
    }

    return () => clearInterval(countdown);
  }, [visibleQuestionIndex]);

  useEffect(() => {
    const checkSubmission = async () => {
      try {
        const response = await axios.get(`http://${ip}:4000/submission/${teamName}/${visibleQuestionIndex}`);
        if (response.data.submitted) {
          setSelectedOption(response.data.selectedOption);
          setSubmitted(true);
        }
      } catch (error) {
        console.error('Error fetching submission status:', error);
      }
    };

    if (visibleQuestionIndex !== -1 && isLoggedIn) {
      checkSubmission();
    }
  }, [visibleQuestionIndex, isLoggedIn]);

  const handleLogin = () => {
    if (teamName && password === teamName) {
      localStorage.setItem('teamName', teamName);
      setIsLoggedIn(true);
    } else {
      alert('Invalid login. Username and password must match the team name.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('teamName');
    setIsLoggedIn(false);
    setTeamName('');
    setPassword('');
  };

  const handleSubmit = async () => {
    if (selectedOption === null) return;
    
    const submissionData = {
      teamName,
      questionIndex: visibleQuestionIndex,
      selectedOption,
      timestamp: new Date().toISOString()
    };
    
    try {
      await axios.post(`http://${ip}:4000/submit`, submissionData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
        <h2>Team Login</h2>
        <input type="text" placeholder="Team Name" value={teamName} onChange={e => setTeamName(e.target.value)} className="form-control mb-2" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="form-control mb-2" />
        <button className="btn btn-primary" onClick={handleLogin}>Login</button>
      </div>
    );
  }


   const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"]
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"]
    },
    {
      question: "Who wrote 'Hamlet'?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "J.K. Rowling"]
    },
    {
      question: "What is the largest mammal?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"]
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon"]
    },{
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      image: "/assets/q1.jpg"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"]
    },
    {
      question: "Who wrote 'Hamlet'?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "J.K. Rowling"]
    },
    {
      question: "What is the largest mammal?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"]
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon"]
    },{
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"]
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"]
    },
    {
      question: "Who wrote 'Hamlet'?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "J.K. Rowling"]
    },
    {
      question: "What is the largest mammal?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"]
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon"]
    },{
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"]
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"]
    },
    {
      question: "Who wrote 'Hamlet'?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "J.K. Rowling"]
    },
    {
      question: "What is the largest mammal?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"]
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon"]
    },{
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"]
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"]
    },
    {
      question: "Who wrote 'Hamlet'?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "J.K. Rowling"]
    },
    {
      question: "What is the largest mammal?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"]
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon"]
    },
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"]
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"]
    },
    {
      question: "Who wrote 'Hamlet'?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "J.K. Rowling"]
    },
    {
      question: "What is the largest mammal?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"]
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon"]
    }
  ];










  return (
    <>
      <button className="btn btn-danger m-3" onClick={handleLogout}>Logout</button>
      {(visibleQuestionIndex !== -1) ? (
        <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
          <div className="container text-center">
            <h1 className="mb-5 display-3">
              <strong>{questions[visibleQuestionIndex].question}</strong>
            </h1>
            <div className="mb-4">
              <span className={`badge fs-2 ${timer === 0 ? 'bg-danger text-white' : 'bg-warning text-dark'}`}>
                Time Left: {timer}s
              </span>
            </div>
            <div className="row justify-content-center">
              <div className="col-12 col-md-8">
                <ol className="text-start list-group list-group-numbered">
                  {questions[visibleQuestionIndex].options.map((option, index) => (
                    <li
                      key={index}
                      className={`list-group-item list-group-item-action p-4 mb-3 border rounded shadow-sm bg-white fs-4 ${selectedOption === option ? 'bg-primary text-white' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedOption(option)}
                    >
                      <strong>{option}</strong>
                    </li>
                  ))}
                </ol>
                {!submitted ? (
                  <button className="btn btn-success mt-4" onClick={handleSubmit}>Submit</button>
                ) : (
                  <>
                    <p className="mt-4 text-success">Answer Submitted!</p>
                    <button className="btn btn-warning mt-2" onClick={() => setSubmitted(false)}>Resubmit</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="vh-100 d-flex justify-content-center align-items-center">
          <h2>No active question at the moment.</h2>
        </div>
      )}
    </>
  );
};

export default TeamPortal;
