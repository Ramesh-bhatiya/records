import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(username, password);
    if (result.ok) {
      navigate('/admin');
    } else {
      setError(result.error || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)',
          backgroundSize: '10px 10px'
        }}></div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl tracking-widest text-[#D4AF37] mb-2"
            >
              VISHAL SELECTION
            </motion.h1>
          </Link>
          <div className="h-px w-24 mx-auto bg-[#D4AF37] mb-4"></div>
          <p className="text-[#F5E6D3]/70 tracking-wide">Admin Portal</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#1A1A1A] border border-[#D4AF37]/20 p-8 shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>

          <h2 className="text-2xl text-center mb-8 text-[#F5E6D3] tracking-wide">Owner Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-[#F5E6D3] mb-2 tracking-wide">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D4AF37]/50" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border border-[#D4AF37]/30 text-[#F5E6D3] px-10 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#F5E6D3] mb-2 tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D4AF37]/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-[#D4AF37]/30 text-[#F5E6D3] px-10 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-black py-3 tracking-wider hover:bg-[#B8941F] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <LogIn className="w-5 h-5" />
              LOGIN
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#D4AF37]/20 text-center">
            <p className="text-[#F5E6D3]/50 text-sm">
              Login uses Supabase Auth (Email / Password)
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-[#D4AF37] hover:text-[#E8D087] transition-colors tracking-wide text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
