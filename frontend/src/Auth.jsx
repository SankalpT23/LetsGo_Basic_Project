import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { LogIn, UserPlus } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const res = await api.post('/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data); // Backend returns raw token string
        navigate('/dashboard');
      } else {
        await api.post('/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        // Auto-login or just switch to login component
        setIsLogin(true);
        setFormData({ ...formData, password: '' });
        alert('Registered successfully! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div 
        className="glass"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        style={{ width: '100%', maxWidth: '400px', padding: '40px 30px', position: 'relative', overflow: 'hidden' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ x: isLogin ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isLogin ? 50 : -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--accent-orange)', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {isLogin ? <><LogIn size={32} /> Welcome Back</> : <><UserPlus size={32} /> Create Account</>}
            </h2>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-red)', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {!isLogin && (
                <motion.input
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  className="input-glass" type="text" name="name" placeholder="Full Name"
                  value={formData.name} onChange={handleChange} required={!isLogin}
                />
              )}
              <input 
                className="input-glass" type="email" name="email" placeholder="Email Address" 
                value={formData.email} onChange={handleChange} required 
              />
              <input 
                className="input-glass" type="password" name="password" placeholder="Password" 
                value={formData.password} onChange={handleChange} required 
              />
              
              <button className="btn-primary" type="submit" style={{ marginTop: '10px' }}>
                {isLogin ? 'Sign In' : 'Get Started'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                className="btn-ghost" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;
