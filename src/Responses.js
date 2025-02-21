import React, { useContext, useEffect, useState } from 'react';
import { ref, onValue, get, set } from 'firebase/database';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Cell } from 'recharts';
import { database } from './firebase';
import { AuthContext } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
const Responses = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleQuestionIndex, setVisibleQuestionIndex] = useState(-1);
  const [timer, setTimer] = useState(30);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [responses, setResponses] = useState([]);
  const [mails, setmails] = useState([]);




  useEffect(() => {
    if (visibleQuestionIndex !== -1) {
      const responsesRef = ref(database, `submissions/q${visibleQuestionIndex + 1}`);
  
      // Listen for real-time changes
      const unsubscribeResponses = onValue(responsesRef, (snapshot) => {
        if (snapshot.exists()) {
          setResponses(Object.entries(snapshot.val()).map(([uid, data]) => ({ uid, ...data })));
        } else {
          setResponses([]); // Clear responses if no data exists
        }
      });
  
      // Cleanup listener on unmount
      return () => unsubscribeResponses();
    }
  }, [visibleQuestionIndex]);
  



  

  useEffect(() => {
    const mailsRef = ref(database, "mails");

    get(mailsRef).then((snapshot) => {
      if (snapshot.exists()) {
        setmails(snapshot.val());
        console.log(snapshot.val());
      }
    }).catch((error) => {
      console.error("Error fetching mails:", error);
    });
  }, [visibleQuestionIndex]); // Empty dependency array ensures it runs only once when the component mounts




  useEffect(() => {
    const teamsRef = ref(database, 'teams');
    const visibilityRef = ref(database, 'visibility');




    const unsubscribeTeams = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTeams(Object.entries(data).map(([name, details]) => ({ name, ...details })));
      }
      setLoading(false);
    });

    const unsubscribeVisibility = onValue(visibilityRef, (snapshot) => {
      setVisibleQuestionIndex(snapshot.val() || -1);
    });

    return () => {
      unsubscribeTeams();
      unsubscribeVisibility();
    };
  }, [visibleQuestionIndex]);

  useEffect(() => {
    if (visibleQuestionIndex !== -1) {
      const questionRef = ref(database, `questions/q${visibleQuestionIndex+1}`);
      const questionStartTimeRef = ref(database, `questionStartTime/q${visibleQuestionIndex+1}`);

      

      get(questionRef).then((snapshot) => {
        if (snapshot.exists()) {
          setQuestion(snapshot.val());
          setSelectedOption("Mark Twain")
        }
      });

      get(questionStartTimeRef).then((snapshot) => {
        if (snapshot.exists()) {
          const storedTime = snapshot.val();
          const elapsedTime = (Date.now() - storedTime) / 1000;
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
    }
  }, [visibleQuestionIndex]);









    return (
      <>

        <nav className="navbar bg-body-tertiary">
          <div className="container-fluid d-flex">
            <span className="navbar-brand mb-0 h1">
              CSI QUIZ
            </span>
          </div>
        </nav>

        <div className="mt-4 d-flex flex-column align-items-center">
          <h3 className="text-success">Results</h3>
          {responses.length > 0 ? (
            <div className="table-responsive w-75">
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
            <p className="text-center text-muted mt-3">No responses recorded.</p>
          )}
        </div>

        




      </>
    );

  }


export default Responses;