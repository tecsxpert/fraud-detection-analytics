/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import DetailPage from './pages/DetailPage';
import FormPage from './pages/FormPage';
import AnalyticsPage from './pages/AnalyticsPage';
import StreamingPage from './pages/StreamingPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout><div /></Layout>}>
              {/* Dummy container to wrap routes with layout */}
            </Route>
            
            {/* Actual routes wrapped in Layout manually or via a wrapper component */}
            <Route path="/" element={<Layout><ErrorBoundary><DashboardPage /></ErrorBoundary></Layout>} />
            <Route path="/records" element={<Layout><ErrorBoundary><RecordsPage /></ErrorBoundary></Layout>} />
            <Route path="/records/new" element={<Layout><ErrorBoundary><FormPage /></ErrorBoundary></Layout>} />
            <Route path="/records/:id" element={<Layout><ErrorBoundary><DetailPage /></ErrorBoundary></Layout>} />
            <Route path="/records/:id/edit" element={<Layout><ErrorBoundary><FormPage /></ErrorBoundary></Layout>} />
            <Route path="/analytics" element={<Layout><ErrorBoundary><AnalyticsPage /></ErrorBoundary></Layout>} />
            <Route path="/streaming" element={<Layout><ErrorBoundary><StreamingPage /></ErrorBoundary></Layout>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
