import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LeaderBoard from './Leaderboard';
import TeamPointsBoard from './Admin';
import Profile from './Profile';
import Display from './Display';

function App() {
  return (
    <Router basename='/csi/'>
      <Routes>
        {/* Public Routes */}
        <Route path="/leaderboard" element={ <LeaderBoard />} />
        <Route path="/admin" element={ <TeamPointsBoard />} />
        <Route path="/profile" element={ <Profile />} />
        <Route path="/display" element={ <Display />} />

        {/* Redirect all other routes to /leaderboard */}
        <Route path="*" element={<Navigate to="/leaderboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
