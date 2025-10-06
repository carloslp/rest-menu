import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicMenu from './pages/PublicMenu';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicMenu />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
