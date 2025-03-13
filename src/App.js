import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TeamPointsBoard from './Admin';
import Display from './Display';


function App() {
  return (
    <Router basename='/csi/'>
      <Routes>
        {/* Public Routes */}
        <Route path="/leaderboard" element={ <Display />} />
        <Route path="/admin" element={ <TeamPointsBoard />} />
        {/* Redirect all other routes to /leaderboard */}
        <Route path="*" element={<Navigate to="/leaderboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
