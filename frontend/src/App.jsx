import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <div className="blob-1 floating-blob"></div>
      <div className="blob-2 floating-blob"></div>
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
