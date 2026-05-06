import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// استيراد الصور والـ Context
import logoImg from '../../assets/hero.png'; 
import bgImage from '../../assets/photo_2026-05-06_09-55-26.jpg';
import { AuthContext } from '../../context/AuthContext';

// استيراد الأيقونات
import { 
  User, 
  LockKey, 
  ArrowRight, 
  EnvelopeSimple, 
  CalendarBlank,
  IdentificationBadge,
  CircleNotch
} from '@phosphor-icons/react';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);
  
  // States
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'PLAYER', 
    age: '', 
    parentName: '', 
    parentEmail: '' 
  });

  // توجيه المستخدم حسب دوره
  const redirectBasedOnRole = (role) => {
    if (role === 'CEO' || role === 'CFO') navigate('/admin');
    else if (role === 'COACH') navigate('/coach');
    else navigate('/portal');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccessMsg('');

    // 1. Validation: التأكد من دومين الأكاديمية
    if (!formData.email.toLowerCase().endsWith('@target.com')) {
      return setError('Unauthorized email domain. Please use your @target.com address.');
    }

    setIsLoading(true);

    try {
      if (isLoginView) {
        // منطق تسجيل الدخول
        const res = await login(formData.email, formData.password); 
        if (res.success) {
          redirectBasedOnRole(res.role);
        } else {
          setError(res.message);
        }
      } else {
        // منطق إنشاء حساب جديد
        if (!formData.name || !formData.email || !formData.password) {
          setIsLoading(false);
          return setError('Please fill all required fields');
        }

        // تحقق إضافي للاعبين تحت 16 سنة
        if (formData.role === 'PLAYER' && formData.age && parseInt(formData.age) < 16) {
          if (!formData.parentName || !formData.parentEmail) {
            setIsLoading(false);
            return setError('Parent details are mandatory for athletes under 16.');
          }
        }
        
        const res = await signup(formData); 
        if (res.success) {
          setSuccessMsg(res.message);
          setIsLoginView(true); // تحويل المستخدم لصفحة اللوجين بعد النجاح
        } else {
          setError(res.message);
        }
      }
    } catch (err) {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* ==========================================
          LEFT SIDE: HERO SECTION (صورة البطل والرسالة)
      ========================================== */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden h-screen sticky top-0">
        <img 
          src={bgImage} 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Academy Training"
        />
        {/* التدرج الأحمر المميز للأكاديمية */}
        <div className="absolute inset-0 bg-gradient-to-t from-target-red/95 via-target-red/40 to-transparent"></div>
        
        <div className="absolute bottom-20 left-12 right-12 text-white animate-in fade-in slide-in-from-left-10 duration-700">
          <h1 className="text-7xl font-black leading-none mb-6 drop-shadow-2xl">
            Train.<br />Compete.<br />Believe.
          </h1>
          <p className="text-xl font-medium opacity-90 max-w-md leading-relaxed border-l-4 border-white/30 pl-6">
            Welcome to Target Academy — where champions are built, one session at a time.
          </p>
        </div>
      </div>

      {/* ==========================================
          RIGHT SIDE: FORM SECTION (الفورمة واللوجو)
      ========================================== */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-20 bg-gray-50/30 overflow-y-auto">
        <div className="w-full max-w-[420px] py-10">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl shadow-red-500/20 bg-white p-1.5">
              <img src={logoImg} className="w-full h-full object-contain" alt="Target Logo" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">Target</h2>
              <p className="text-[10px] text-target-red font-black uppercase tracking-[0.2em] mt-1">Academy System</p>
            </div>
          </div>

          {/* Heading Section */}
          <div className="mb-10">
            <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              {isLoginView ? 'Welcome back' : 'Join the Elite'}
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              {isLoginView ? 'Sign in to access your professional portal' : 'Start your journey with Target Academy today'}
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-4 rounded-2xl mb-6 font-bold border border-red-100 flex items-center gap-3 animate-in zoom-in-95 duration-300">
              <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 text-green-600 text-xs p-4 rounded-2xl mb-6 font-bold border border-green-100 flex items-center gap-3 animate-in zoom-in-95 duration-300">
              <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
              {successMsg}
            </div>
          )}

          {/* Login/Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
              <>
                {/* Role Selector */}
                <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-1.5 mb-4">
                  <button type="button" onClick={()=>setFormData({...formData, role: 'PLAYER'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${formData.role === 'PLAYER' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Player</button>
                  <button type="button" onClick={()=>setFormData({...formData, role: 'PARENT'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${formData.role === 'PARENT' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Parent</button>
                </div>

                {/* Name */}
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-target-red transition-colors" size={20} />
                  <input type="text" placeholder="Full Name" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-target-red focus:ring-4 focus:ring-red-500/5 transition-all shadow-sm" />
                </div>

                {/* Player Fields (Age Logic) */}
                {formData.role === 'PLAYER' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <CalendarBlank className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="number" placeholder="Age" value={formData.age} onChange={(e)=>setFormData({...formData, age: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-target-red transition-all shadow-sm" />
                      </div>
                      <div className="relative opacity-60">
                        <IdentificationBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input disabled placeholder="U-Squad" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm" />
                      </div>
                    </div>

                    {/* تظهر فقط إذا كان السن أقل من 16 */}
                    {formData.age && parseInt(formData.age) < 16 && (
                      <div className="p-5 bg-red-50/30 rounded-[2rem] border border-red-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <p className="text-[10px] font-black text-target-red uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-target-red rounded-full animate-pulse"></div> 
                          Parent/Guardian Consent Required
                        </p>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input type="text" placeholder="Parent Full Name" value={formData.parentName} onChange={(e)=>setFormData({...formData, parentName: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-target-red transition-all shadow-sm" />
                        </div>
                        <div className="relative">
                          <EnvelopeSimple className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input type="email" placeholder="Parent Email Address" value={formData.parentEmail} onChange={(e)=>setFormData({...formData, parentEmail: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-target-red transition-all shadow-sm" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Email */}
            <div className="relative group">
              <EnvelopeSimple className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-target-red transition-colors" size={20} />
              <input type="email" placeholder="Email Address (@target.com)" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-target-red focus:ring-4 focus:ring-red-500/5 transition-all shadow-sm" required />
            </div>

            {/* Password */}
            <div className="relative group">
              <LockKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-target-red transition-colors" size={20} />
              <input type="password" placeholder="Password" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-target-red focus:ring-4 focus:ring-red-500/5 transition-all shadow-sm" required />
            </div>

            {isLoginView && (
              <div className="flex justify-end pr-2">
                <button type="button" className="text-xs font-bold text-gray-400 hover:text-target-red transition-colors">Forgot password?</button>
              </div>
            )}

            {/* Submit Button with Loader */}
<button 
  type="submit" 
  disabled={isLoading}
  className="w-full bg-target-red hover:bg-red-700 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
>
  {isLoading ? (
    <CircleNotch size={20} weight="bold" className="animate-spin" />
  ) : (
    <>
      <span>{isLoginView ? 'Sign In' : 'Sign Up'}</span>
      <ArrowRight weight="bold" size={18} />
    </>
  )}
</button>
          </form>

          {/* Footer Toggle */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {isLoginView ? "New to Target Academy? " : "Already a member? "}
              <button 
                onClick={() => {setIsLoginView(!isLoginView); setError(''); setSuccessMsg('');}} 
                className="text-target-red font-black hover:underline underline-offset-8 ml-2 uppercase tracking-widest text-xs"
              >
                {isLoginView ? "Join Us" : "Login"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;