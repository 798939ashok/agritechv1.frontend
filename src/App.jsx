import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';

import Home               from './pages/Home';
import Login              from './pages/Login';
import Register           from './pages/Register';
import Dashboard          from './pages/Dashboard';
import DiseaseDetection   from './pages/DiseaseDetection';
import PlantIdentification from './pages/PlantIdentification';
import Weather            from './pages/Weather';
import News               from './pages/News';
import Settings           from './pages/Settings';
import Profile            from './pages/Profile';

function Protected({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { darkMode } = useApp();

  return (
    // ✅ min-h-screen wrapper picks up the data-theme bg colour set on <html>
    <div style={{
      minHeight: '100vh',
      backgroundColor: darkMode ? '#030712' : '#f0fdf4',
      transition: 'background-color 0.3s ease',
    }}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#f9fafb' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#f9fafb' } },
          }}
        />
        <Routes>
          <Route path="/"                   element={<Home />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/register"           element={<Register />} />
          <Route path="/dashboard"          element={<Protected><Dashboard /></Protected>} />
          <Route path="/disease-detection"  element={<Protected><DiseaseDetection /></Protected>} />
          <Route path="/plant-id"           element={<Protected><PlantIdentification /></Protected>} />
          <Route path="/weather"            element={<Protected><Weather /></Protected>} />
          <Route path="/news"               element={<Protected><News /></Protected>} />
          <Route path="/settings"           element={<Protected><Settings /></Protected>} />
          <Route path="/profile"            element={<Protected><Profile /></Protected>} />
          <Route path="*"                   element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
