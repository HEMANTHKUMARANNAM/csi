import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ref, onValue, update, set, get, remove } from "firebase/database";
import { database } from "./firebase";
import { Modal, Button, Form } from "react-bootstrap";

const TeamPointsBoard = () => {
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTeam, setModalTeam] = useState("");
  const [customScore, setCustomScore] = useState(0);

  useEffect(() => {
    const teamsRef = ref(database, "teams");

    onValue(teamsRef, (snapshot) => {
      setTeams(snapshot.val() || {});
      setLoading(false);
    });
  }, []);

  const updatePoints = async (teamName, value) => {
    const newScore = (teams[teamName]?.score || 0) + value;
    try {
      await update(ref(database, `teams/${teamName}`), { score: newScore });
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  const addNewTeam = async () => {
    if (!newTeamName.trim()) return alert("Please enter a valid team name.");

    const teamRef = ref(database, `teams/${newTeamName}`);
    try {
      const snapshot = await get(teamRef);
      if (snapshot.exists()) {
        alert("Team already exists!");
      } else {
        await set(teamRef, { score: 0 });
        setNewTeamName("");
      }
    } catch (error) {
      console.error("Error adding new team:", error);
    }
  };

  const deleteTeam = async (teamName) => {
    if (window.confirm(`Are you sure you want to delete '${teamName}'?`)) {
      try {
        await remove(ref(database, `teams/${teamName}`));
      } catch (error) {
        console.error("Error deleting team:", error);
      }
    }
  };

  const setCustomPoints = async () => {
    try {
      await update(ref(database, `teams/${modalTeam}`), { score: customScore });
      setShowModal(false);
    } catch (error) {
      console.error("Error setting custom points:", error);
    }
  };

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">Team Points Board</h1>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter new team name"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addNewTeam}>
          Add Team
        </button>
      </div>

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
                    <button
                      onClick={() => deleteTeam(teamName)}
                      className="btn btn-outline-danger"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setModalTeam(teamName);
                        setShowModal(true);
                      }}
                      className="btn btn-outline-primary"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Team: {modalTeam}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Set Custom Score</Form.Label>
              <Form.Control
                type="number"
                value={customScore}
                onChange={(e) => setCustomScore(Number(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={setCustomPoints}>
            Set Custom Score
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeamPointsBoard;