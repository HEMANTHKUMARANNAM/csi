import React, { useContext, useEffect, useState } from 'react';
import { ref, onValue, get, set } from 'firebase/database';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Cell } from 'recharts';
import { database } from './firebase';
import { AuthContext } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Display = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleQuestionIndex, setVisibleQuestionIndex] = useState(-1);
  const [answerdisplay, setanswerdisplay] = useState(0);
  const [timer, setTimer] = useState(30);
  const [question, setQuestion] = useState(null);
  const [responses, setResponses] = useState([]);
  const { userloading } = useContext(AuthContext);

  useEffect(() => {
    const visibilityRef = ref(database, 'visibility');
    const answerRef = ref(database, 'answer');
  
    const unsubscribeVisibility = onValue(visibilityRef, (snapshot) => {
      setVisibleQuestionIndex(snapshot.exists() ? snapshot.val() : -1);
    });
  
    const unsubscribeAnswer = onValue(answerRef, (snapshot) => {
      setanswerdisplay(snapshot.exists() ? snapshot.val() : 0);
    });
  
    return () => {
      unsubscribeVisibility();
      unsubscribeAnswer();
    };
  }, []);
  

  // Fetch Teams Data
  useEffect(() => {
    const teamsRef = ref(database, 'teams');
    const unsubscribeTeams = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      setTeams(data ? Object.entries(data).map(([name, details]) => ({ name, ...details })) : []);
      setLoading(false);
    });
    return () => unsubscribeTeams();
  }, []);

  // Fetch Question & Timer Management
  useEffect(() => {
    if (visibleQuestionIndex === -1) return;

    const questionRef = ref(database, `questions/q${visibleQuestionIndex + 1}`);
    const questionStartTimeRef = ref(database, `questionStartTime/q${visibleQuestionIndex + 1}`);

    const answerRef = ref(database, `answer/`);

    // Fetch Question
    get(questionRef).then((snapshot) => {
      if (snapshot.exists()) {
        setQuestion(snapshot.val());
      } else {
        setQuestion(null);
      }
    });

    // Fetch Question
    get(answerRef).then((snapshot) => {
      if (snapshot.exists()) {
        setanswerdisplay(snapshot.val());
      } else {
        setanswerdisplay(0);
      }
    });

    // Handle Timer
    get(questionStartTimeRef).then((snapshot) => {
      if (snapshot.exists()) {
        const elapsedTime = (Date.now() - snapshot.val()) / 1000;
        setTimer(Math.max(30 - elapsedTime, 0));
      } else {
        set(questionStartTimeRef, Date.now());
        setTimer(30);
      }
    });

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 1) return prevTimer - 1;
        clearInterval(countdown);
        return 0;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [visibleQuestionIndex, answerdisplay ]);

  // Fetch Responses when Timer Ends
  useEffect(() => {
    if (timer === 0 && visibleQuestionIndex !== -1) {
      const responsesRef = ref(database, `submissions/q${visibleQuestionIndex + 1}`);
      get(responsesRef).then((snapshot) => {
        if (snapshot.exists()) {
          setResponses(Object.entries(snapshot.val()).map(([uid, data]) => ({ uid, ...data })));
        } else {
          setResponses([]);
        }
      });
    }
  }, [timer, visibleQuestionIndex]);

  // Calculate Chart Data
  const maxScore = Math.max(...teams.map((team) => team.score), 0);
  const maxMarks = Math.ceil(maxScore / 10) * 10 + 10;
  const colorsArray = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA', '#10B981', '#F472B6'];

  // Loading User Data
  if (userloading) {
    return <div className="text-center">Loading user data...</div>;
  }

  return (
    <>
      {visibleQuestionIndex !== -1 && question ? (
        <div className="vh-100 d-flex flex-column">
          {/* Navbar */}
          {/* <nav className="navbar bg-body-tertiary">
            <div className="container-fluid d-flex">
              <span className="navbar-brand mb-0 h1">CSI QUIZ</span>
            </div>
          </nav> */}

          {/* Main Content */}
          <div className="container-fluid d-flex align-items-center flex-grow-1">
            <div className="row w-100">
              {/* <div className="col-12 p-4 border rounded shadow bg-light text-center overflow-auto"> */}
                {/* Question Header */}
                {/* <h2 className="text-primary">{question.name}</h2>
                <p className="lead">{question.question}</p> */}

                {/* Image Display */}
                {question.image && (
                  <div className="d-flex justify-content-center my-3">
                    <img
                      src={`https://lh3.googleusercontent.com/d/${question.image}=w1000`}
                      height="100%"
                      width="100%"
                      className="img-fluid rounded"
                      alt="Question"
                    />
                  </div>
                )}

                {/* Timer Display */}
                {/* <p className="fw-bold">Time remaining: {Math.round(timer)}s</p> */}

                {/* Options */}
                <div className="container">
                  <div className="row">
                  {
                    answerdisplay ===0 ?
                    (

                      // question.options.map((option, index) => (
                      //   <div key={index} className="col-6 d-flex justify-content-center">
                      //     <button
                      //       className="btn m-2 w-75 btn-outline-primary"
                      //       onClick={() => console.log(option)}
                      //       disabled={timer === 0}
                      //     >
                      //       {option}
                      //     </button>
                      //   </div>
                      // ))
                      <>
                      </>

                    ):
                    (

                      // question.options.map((option, index) => (
                      //   <div key={index} className="col-6 d-flex justify-content-center">
                      //     <button
                      //       className="btn m-2 w-75 btn-outline-primary"
                      //       onClick={() => console.log(option)}
                      //       disabled={timer === 0}
                      //     >
                      //       {option}
                      //     </button>
                      //   </div>
                      // ))

                      <p>meow</p>

                    )

                  }
                    
                  </div>
                </div>

                {/* Show Responses if Timer is 0 */}
                {/* {timer === 0 && (
                  <div className="mt-4">
                    <h3 className="text-success">Results</h3>
                    {responses.length > 0 ? (
                      <div className="table-responsive w-75 mx-auto">
                        <table className="table table-bordered table-striped text-center">
                          <thead className="thead-dark">
                            <tr>
                              <th>User</th>
                              <th>Response</th>
                              <th>Response Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {responses.map((res, index) => {
                              const timestamp = new Date(res.lastSubmitted);
                              return (
                                <tr key={index}>
                                  <td>{res.name}</td>
                                  <td>{res.response}</td>
                                  <td>
                                    {timestamp.toLocaleTimeString()}:{timestamp.getMilliseconds()}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted mt-3">No responses recorded.</p>
                    )}
                  </div>
                )} */}
              </div>
            </div>
          {/* </div> */}
        </div>
      ) : (
        <div className="container text-center mt-5">
          <h2 className="text-primary">CSI Score Display</h2>
          {loading ? (
            <div className="text-muted">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={teams} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 20, fontWeight: 'bold' }} />
                <YAxis domain={[0, maxMarks]} />
                <Tooltip />
                <Bar dataKey="score" barSize={50} radius={[10, 10, 0, 0]}>
                  {teams.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorsArray[index % colorsArray.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </>
  );
};

export default Display;
