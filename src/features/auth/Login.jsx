import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { User, LockKey, ArrowRight, EnvelopeSimple, Hexagon, CalendarBlank } from '@phosphor-icons/react';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({ 
    name: '', email: 'ceo@target.com', password: '123', role: 'PLAYER', age: '', parentName: '', parentEmail: '' 
  });

  const redirectBasedOnRole = (role) => {
    if (role === 'CEO' || role === 'CFO') navigate('/admin');
    else if (role === 'COACH') navigate('/coach');
    else navigate('/portal');
  };

const handleSubmit = async (e) => { // ضفنا كلمة async هنا
    e.preventDefault();
    setError(''); setSuccessMsg('');

    if (isLoginView) {
      // ضفنا كلمة await عشان يستنى الرد من فايربيس
      const res = await login(formData.email, formData.password); 
      if (res.success) redirectBasedOnRole(res.role);
      else setError(res.message);
    } else {
      if (!formData.name || !formData.email || !formData.password) return setError('Please fill all basic fields');
      
      if (formData.role === 'PLAYER') {
        if (!formData.age) return setError('Age is required for players');
        if (parseInt(formData.age) < 16 && (!formData.parentName || !formData.parentEmail)) {
          return setError('Players under 16 must provide Parent/Guardian details.');
        }
      }

      // ضفنا كلمة await هنا كمان
      const res = await signup(formData); 
      if (res.success) {
        setSuccessMsg(res.message);
        setIsLoginView(true); // هيرجعه لشاشة اللوجين ويطبعله الرسالة الخضراء
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b132b] text-white justify-center items-center p-4">
      <div className="flex flex-col items-center mb-8">
        <Hexagon weight="fill" className="text-target-red text-4xl mb-2" />
        <h1 className="text-3xl font-bold">Target Academy</h1>
      </div>

      <div className="bg-white text-gray-800 w-full max-w-[400px] rounded-2xl p-8 shadow-2xl">
        {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center font-bold">{error}</div>}
        {successMsg && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4 text-center font-bold">{successMsg}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button type="button" onClick={()=>setFormData({...formData, role: 'PLAYER'})} className={`py-2 rounded-lg text-sm font-bold border transition ${formData.role === 'PLAYER' ? 'bg-target-red text-white border-target-red' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>Player</button>
                <button type="button" onClick={()=>setFormData({...formData, role: 'PARENT'})} className={`py-2 rounded-lg text-sm font-bold border transition ${formData.role === 'PARENT' ? 'bg-target-red text-white border-target-red' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>Parent</button>
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Full Name" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-target-red" />
              </div>

              {formData.role === 'PLAYER' && (
                <div className="relative">
                  <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="number" placeholder="Age" value={formData.age} onChange={(e)=>setFormData({...formData, age: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-target-red" />
                </div>
              )}

              {/* حقول ولي الأمر بتظهر لو اللاعب سنه أقل من 16 */}
              {formData.role === 'PLAYER' && formData.age && parseInt(formData.age) < 16 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-100 space-y-3">
                  <p className="text-[10px] font-bold text-target-red uppercase tracking-wide">Parent / Guardian Required</p>
                  <input type="text" placeholder="Parent Name" value={formData.parentName} onChange={(e)=>setFormData({...formData, parentName: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-target-red" />
                  <input type="email" placeholder="Parent Email" value={formData.parentEmail} onChange={(e)=>setFormData({...formData, parentEmail: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-target-red" />
                </div>
              )}
            </>
          )}

          <div className="relative">
            <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-target-red" />
          </div>

          <div className="relative">
            <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="password" placeholder="Password" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-target-red" />
          </div>

          <button type="submit" className="w-full bg-target-red hover:bg-red-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2">
            {isLoginView ? 'Sign In' : 'Submit Registration'} <ArrowRight weight="bold" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLoginView ? "Don't have an account? " : "Already registered? "}
          <button onClick={() => {setIsLoginView(!isLoginView); setError(''); setSuccessMsg('');}} className="text-target-red font-bold hover:underline">
            {isLoginView ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;