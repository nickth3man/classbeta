import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Layout components
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Assignments from './pages/Assignments';
import Files from './pages/Files';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Database initialization
import { initDatabase } from './database/db';

function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Check if this is the first launch
        const hasLaunchedBefore = await window.api.getStoreValue('hasLaunchedBefore');
        
        if (!hasLaunchedBefore) {
          setIsFirstLaunch(true);
          await window.api.setStoreValue('hasLaunchedBefore', true);
        }
        
        // Initialize the database
        await initDatabase();
        setIsDbInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initApp();
  }, []);

  // Show loading state while database is initializing
  if (!isDbInitialized) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        Loading Academic Organizer...
      </Box>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/files" element={<Files />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
