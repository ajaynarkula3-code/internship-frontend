import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import InternshipListings from './pages/InternshipListings';
import RecommendedInternships from './pages/RecommendedInternships';
import InternshipDetails from './pages/InternshipDetails';
import MyApplications from './pages/MyApplications';
import AdminDashboard from './pages/AdminDashboard';
import ManageInternships from './pages/ManageInternships';
import ManageStudents from './pages/ManageStudents';
import ManageApplications from './pages/ManageApplications';
import HRDashboard from './pages/HRDashboard';
import HRApplicants from './pages/HRApplicants';

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="spinner" style={{ marginTop: '5rem' }}></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/internships" element={<InternshipListings />} />
              <Route path="/internships/:id" element={<InternshipDetails />} />

              {/* Student Routes */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/profile" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentProfile />
                </ProtectedRoute>
              } />
              <Route path="/student/recommendations" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <RecommendedInternships />
                </ProtectedRoute>
              } />
              <Route path="/student/applications" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <MyApplications />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/internships" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
                  <ManageInternships />
                </ProtectedRoute>
              } />
              <Route path="/admin/students" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
                  <ManageStudents />
                </ProtectedRoute>
              } />
              <Route path="/admin/applications" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
                  <ManageApplications />
                </ProtectedRoute>
              } />

              {/* HR Routes */}
              <Route path="/hr/dashboard" element={
                <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                  <HRDashboard />
                </ProtectedRoute>
              } />
              <Route path="/hr/applicants" element={
                <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                  <HRApplicants />
                </ProtectedRoute>
              } />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
