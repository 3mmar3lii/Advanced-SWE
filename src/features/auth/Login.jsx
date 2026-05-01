import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LockKey, ArrowRight, ShieldCheck, Hexagon, EnvelopeSimple } from '@phosphor-icons/react';
import { AuthContext } from '../../../src/context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);
  
  const [isLoginView, setIsLoginView] = useState(true); // للتبديل بين تسجيل الدخول وإنشاء حساب
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: 'ceo@target.com', password: '123', role: 'PARENT' });

  // توجيه المستخدم حسب دوره
  const redirectBasedOnRole = (role) => {
    if (role === 'CEO' || role === 'CFO') navigate('/admin');
    else if (role === 'COACH') navigate('/coach');
    else navigate('/portal');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLoginView) {
      const res = login(formData.email, formData.password);
      if (res.success) redirectBasedOnRole(res.role);
      else setError(res.message);
    } else {
      if (!formData.name) return setError('Name is required');
      const res = signup(formData.name, formData.email, formData.password, formData.role);
      if (res.success) redirectBasedOnRole(res.role);
      else setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f2042] to-[#040b18] text-white">
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-3 rounded-xl mb-4 shadow-lg"><Hexagon weight="fill" className="text-target-red text-3xl" /></div>
          <h1 className="text-3xl font-bold mb-1">Target Academy</h1>
          <p className="text-[10px] tracking-[0.2em] text-gray-400 font-semibold uppercase">Elite Performance Portal</p>
        </div>

        <div className="bg-white text-gray-800 w-full max-w-[400px] rounded-2xl p-8 shadow-2xl">
          {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center font-bold">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginView && (
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2">FULL NAME</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-target-red focus:ring-1" placeholder="John Doe" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-target-red focus:ring-1" placeholder="email@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-2">PASSWORD</label>
              <div className="relative">
                <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-target-red focus:ring-1" placeholder="••••••••" />
              </div>
            </div>

            {!isLoginView && (
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2">I AM A...</label>
                <select value={formData.role} onChange={(e)=>setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-target-red">
                  <option value="PARENT">Parent / Player</option>
                  <option value="COACH">Coach</option>
                </select>
              </div>
            )}

            <button type="submit" className="w-full bg-target-red hover:bg-red-700 text-white font-medium py-3 rounded-lg mt-4 flex items-center justify-center gap-2 shadow-md">
              {isLoginView ? 'Sign In' : 'Create Account'} <ArrowRight weight="bold" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              {isLoginView ? "New to the Academy? " : "Already have an account? "}
              <button onClick={() => setIsLoginView(!isLoginView)} className="text-target-red font-bold hover:underline">
                {isLoginView ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;