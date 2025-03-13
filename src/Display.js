import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine
} from 'recharts';
import { database } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

const Display = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const teamsRef = ref(database, 'teams');
    const unsubscribeTeams = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      setTeams(data ? Object.entries(data).map(([name, details]) => ({ name, ...details })) : []);
      setLoading(false);
    });
    return () => unsubscribeTeams();
  }, []);

  const scores = teams.map((team) => team.score);
  const minScore = Math.min(...scores, 0);
  const maxScore = Math.max(...scores, 0);
  const maxMarks = Math.ceil(maxScore / 10) * 10 + 10;
  const minMarks = Math.floor(minScore / 10) * 10 - 10;

  const colorsArray = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA', '#10B981', '#F472B6'];

  return (
    <div className="container text-center mt-5">
      <h2 className="text-primary">CSI Score Display</h2>
      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={teams} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#4B5563', fontSize: 20, fontWeight: 'bold' }}
              axisLine={false} // Removed X-axis baseline
              interval={0} // Ensures all names are shown
            />
            <YAxis domain={[minMarks, maxMarks]} />
            <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
            <Tooltip />
            <Bar dataKey="score" barSize={50} radius={[10, 10, 0, 0]}>
              <LabelList
                dataKey="score"
                position="top"
                style={{ fill: '#374151', fontWeight: 'bold' }}
              />
              {teams.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.score < 0 ? '#EF4444' : colorsArray[index % colorsArray.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Display;
