import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { PropertyDetailsPage } from './pages/public/PropertyDetailsPage';
import { PublicPropertiesPage } from './pages/public/PublicPropertiesPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminPropertiesPage } from './pages/AdminPropertiesPage';
import { AgentDashboard } from './pages/AgentDashboard';
import { EditPropertyPage } from './pages/EditPropertyPage';
import { ProfilePage } from './pages/ProfilePage';

const PrivateRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicPropertiesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              {/* Common Routes */}
              <Route path="/dashboard" element={<AgentDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/properties/:id/edit" element={<EditPropertyPage />} />
              
              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/agents" element={<AdminDashboard />} />
                <Route path="/admin/properties" element={<AdminPropertiesPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;