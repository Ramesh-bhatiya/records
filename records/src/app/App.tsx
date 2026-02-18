import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#000000',
            color: '#F5E6D3',
            border: '1px solid #D4AF37',
          },
        }}
      />
    </AuthProvider>
  );
}
