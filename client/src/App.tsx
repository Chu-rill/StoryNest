import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy-loaded components
const Register = lazy(() => import('./pages/Register'));
const PostDetails = lazy(() => import('./pages/PostDetails'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const EditPost = lazy(() => import('./pages/EditPost'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post/:id" element={<PostDetails />} />
          
          {/* Auth Routes */}
          <Route 
            path="login" 
            element={user ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="register" 
            element={user ? <Navigate to="/" /> : <Register />} 
          />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="create-post" element={<CreatePost />} />
            <Route path="edit-post/:id" element={<EditPost />} />
          </Route>
          
          <Route path="profile/:id" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;