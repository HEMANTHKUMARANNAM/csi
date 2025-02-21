import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ref, onValue, update, set, get } from "firebase/database";
import { database } from "./firebase";

const TeamPointsBoard = () => {
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleQuestionIndex, setVisibleQuestionIndex] = useState(-1);
  const [questionLen, setQuestionLen] = useState(0);

  // Fetch teams & listen for real-time updates
  useEffect(() => {
    const teamsRef = ref(database, "teams");
    const visibilityRef = ref(database, "visibility");

    fetchQuestionLength();

    // Real-time listener for teams
    onValue(teamsRef, (snapshot) => {
      setTeams(snapshot.val() || {});
      setLoading(false);
    });

    // Real-time listener for question visibility
    onValue(visibilityRef, (snapshot) => {
      const newVisibility = snapshot.val() !== null ? snapshot.val() : -1;
      console.log("Visibility changed in Firebase:", newVisibility); // Debugging log
      setVisibleQuestionIndex(newVisibility);
    });

  }, []);

  // Update points in Firebase
  const updatePoints = async (teamName, value) => {
    const newScore = Math.max(0, (teams[teamName]?.score || 0) + value);
    try {
      await update(ref(database, `teams/${teamName}`), { score: newScore });
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  // Handle question visibility toggle
  const handleVisibility = async (index) => {
    const newIndex = visibleQuestionIndex === index ? -1 : index;
    try {
      await set(ref(database, "visibility"), newIndex);
      console.log("Updated visibility in Firebase:", newIndex);
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  // Fetch the number of questions
  const fetchQuestionLength = async () => {
    try {
      const questionRef = ref(database, "questions"); // Adjust Firebase path
      const questionSnapshot = await get(questionRef);

      if (questionSnapshot.exists()) {
        setQuestionLen(Object.keys(questionSnapshot.val()).length);
      } else {
        setQuestionLen(0);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">Team Points Board</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="row">
          {Object.entries(teams).map(([teamName, teamData]) => (
            <div key={teamName} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">{teamName}</h2>
                  <p className="card-text">Points: {teamData.score}</p>
                  <div className="d-flex justify-content-center gap-2 mt-3">
                    <button
                      onClick={() => updatePoints(teamName, 5)}
                      className="btn btn-success"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => updatePoints(teamName, -5)}
                      className="btn btn-danger"
                    >
                      -5
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h1 className="mb-4">Questions Visibility</h1>
      <div className="row">
        {[...Array(questionLen)].map((_, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="card-title">Question {index + 1}</h2>
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <button
                    onClick={() => handleVisibility(index)}
                    className={`btn ${visibleQuestionIndex === index ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {visibleQuestionIndex === index ? 'Invisible' : 'Visible'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPointsBoard;
