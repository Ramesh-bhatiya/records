import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddBill from './pages/AddBill';
import BillRecords from './pages/BillRecords';
import CustomerRecords from './pages/CustomerRecords';
import SupplierRecords from './pages/SupplierRecords';
import Reports from './pages/Reports';

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/add-bill',
    element: (
      <ProtectedRoute>
        <AddBill />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/bills',
    element: (
      <ProtectedRoute>
        <BillRecords />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/customers',
    element: (
      <ProtectedRoute>
        <CustomerRecords />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/suppliers',
    element: (
      <ProtectedRoute>
        <SupplierRecords />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/reports',
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
