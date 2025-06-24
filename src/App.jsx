import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { TaskProvider } from './context/TaskContext';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <TaskProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            currentPage={currentPage}
          />
          
          <div className="flex">
            <AnimatePresence>
              {sidebarOpen && (
                <Sidebar 
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </AnimatePresence>
            
            <main 
              className={`flex-1 transition-all duration-300 ${
                sidebarOpen ? 'ml-64' : 'ml-0'
              } pt-16`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </motion.div>
            </main>
          </div>
        </div>
      </Router>
    </TaskProvider>
  );
}

export default App;