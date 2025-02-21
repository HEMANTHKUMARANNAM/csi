import React, { useContext, useEffect, useState } from 'react';
import { ref, onValue, get, set } from 'firebase/database';
import { database } from './firebase';
import { AuthContext } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const LeaderBoard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleQuestionIndex, setVisibleQuestionIndex] = useState(null);
  const [timer, setTimer] = useState(30);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [lastSubmitted, setLastSubmitted] = useState(null);
  const [mails, setMails] = useState({});

  const navigate = useNavigate();
  const { user, userloading } = useContext(AuthContext);
  const userKey = user?.email?.substring(0, 11);

  useEffect(() => {
    const visibilityRef = ref(database, 'visibility');
    return onValue(visibilityRef, (snapshot) => {
      setVisibleQuestionIndex(snapshot.val() ?? -1);
    });
  }, []);

  useEffect(() => {
    const teamsRef = ref(database, 'teams');
    return onValue(teamsRef, (snapshot) => {
      setTeams(snapshot.val() ? Object.entries(snapshot.val()).map(([name, details]) => ({ name, ...details })) : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const mailsRef = ref(database, 'mails');
    get(mailsRef).then((snapshot) => {
      if (snapshot.exists()) setMails(snapshot.val());
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (visibleQuestionIndex === null || visibleQuestionIndex === -1) return;
    
    const questionRef = ref(database, `questions/q${visibleQuestionIndex + 1}`);
    const questionStartTimeRef = ref(database, `questionStartTime/q${visibleQuestionIndex + 1}`);
    let countdown;
    
    get(questionRef).then((snapshot) => {
      if (snapshot.exists()) setQuestion(snapshot.val());
    });
    
    get(questionStartTimeRef).then((snapshot) => {
      const storedTime = snapshot.val();
      if (storedTime) {
        setTimer(Math.max(30 - (Date.now() - storedTime) / 1000, 0));
      } else {
        set(questionStartTimeRef, Date.now());
        setTimer(30);
      }
    });

    countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [visibleQuestionIndex]);

  useEffect(() => {
    if (!userKey || visibleQuestionIndex === null || visibleQuestionIndex === -1) return;
    const submissionRef = ref(database, `submissions/q${visibleQuestionIndex + 1}/${userKey}`);
    return onValue(submissionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setLastSubmitted(data.lastSubmitted);
        setSelectedOption(data.response);
      }
    });
  }, [userKey, visibleQuestionIndex]);

  const handleSubmit = () => {
    
    if (!selectedOption || !userKey || selectedOption === lastSubmitted) return;
    const submissionRef = ref(database, `submissions/q${visibleQuestionIndex + 1}/${userKey}`);
    set(submissionRef, {
      lastSubmitted: Date.now(),
      response: selectedOption,
      name: mails[userKey],
    });
  };
  

  if (userloading) return <div className="text-center">Loading user data...</div>;
  if (!Object.keys(mails).includes(userKey)) return (
    <>
    <nav className="navbar bg-body-tertiary">
    <div className="container-fluid d-flex">
      <span className="navbar-brand mb-0 h1">{"NOT VALID TEAM"}</span>
      {user?.photoURL && (
        <img src={user.photoURL} alt="User" className="rounded-circle ms-auto" width="40" height="40" onClick={() => navigate("/profile")} />
      )}
    </div>
  </nav>
    <div className="container text-center mt-5">
      <h2>NOT A VALID MAIL</h2>
    </div>
    </>
  );

  return (
    <div className="vh-100 d-flex flex-column">
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid d-flex">
          <span className="navbar-brand mb-0 h1">{mails[userKey]}</span>
          {user?.photoURL && (
            <img src={user.photoURL} alt="User" className="rounded-circle ms-auto" width="40" height="40" onClick={() => navigate("/profile")} />
          )}
        </div>
      </nav>
      <div className="container-fluid d-flex align-items-center flex-grow-1">
        <div className="row w-100">
          <div className="col-12 p-4 border rounded shadow bg-light text-center overflow-auto">
            {question ? (
              <>
                <h2 className="text-primary">{question.name}</h2>
                <p className="lead">{question.question}</p>
                {question.image && <img src={`https://lh3.googleusercontent.com/d/${question.image}=w1000`} height="170" width="170" className="img-fluid rounded" alt="Question" />}
                <p className="fw-bold">Time remaining: {timer}s</p>
                <div className="container">
                  <div className="row">
                    {question.options.map((option, index) => (
                      <div key={index} className="col-6 d-flex justify-content-center">
                        <button className={`btn m-2 w-75 ${selectedOption === option ? "btn-warning" : "btn-outline-primary"}`} onClick={() => setSelectedOption(option)} disabled={timer === 0}>{option}</button>
                      </div>
                    ))}
                  </div>
                </div>
                {timer > 0 && <button className="btn btn-success mt-3 w-75" onClick={handleSubmit}>Submit</button>}
                {lastSubmitted && <p className="mt-2">Last submitted: {new Date(lastSubmitted).toLocaleTimeString()}</p>}
              </>
            ) : <p>No question currently displayed</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
