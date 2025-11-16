import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoApp } from './components';
import { AdminPanel } from './components/AdminPanel';
import { StatusProvider } from './context/StatusContext';
import './App.css';

function App() {
  return (
    <StatusProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TodoApp />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </StatusProvider>
  );
}

export default App;
