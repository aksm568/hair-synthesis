import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HairStyleGallery from './pages/HairStyleGallery';
import SynthesisEditor from './pages/SynthesisEditor';
import Profile from './pages/Profile';
import LikedSyntheses from './pages/LikedSyntheses';
import AdminHairUpload from './pages/AdminHairUpload';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled(motion.main)`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

const App = () => {
  return (
    <AuthProvider>
      <AppContainer>
        <Navbar />
        <MainContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hair-styles" element={<HairStyleGallery />} />
            <Route path="/synthesis/:hairStyleId" element={<SynthesisEditor />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/liked" element={<PrivateRoute><LikedSyntheses /></PrivateRoute>} />
            <Route path="/admin/hair-upload" element={<AdminHairUpload />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </AuthProvider>
  );
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

export default App; 