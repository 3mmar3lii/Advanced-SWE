import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PortalLayout from '../components/layout/PortalLayout';
import FamilyPortal from '../features/portal/FamilyPortal';

// هنفترض إن دي الصفحات اللي هنعملها (استوردها من فولدر features)
const Login = () => <div>Login Page</div>;
const Unauthorized = () => <div className="p-10 text-red-500 text-xl font-bold">Unauthorized Access - غير مصرح لك بالدخول</div>;

// Admin Pages
const CeoDashboard = () => <div className="p-10 text-2xl">CEO Dashboard 📈</div>;
const CfoDashboard = () => <div className="p-10 text-2xl">CFO Financial Hub 💰</div>;

// Coach Pages
const CoachSchedule = () => <div className="p-10 text-2xl">Coach Schedule & QR Scanner 📱</div>;



const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* مسارات عامة (Public Routes) */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* --------------------------------------------------- */}
        {/* مسارات الإدارة (CEO & CFO) - بتحتاج Sidebar Layout */}
        {/* --------------------------------------------------- */}
        <Route element={<ProtectedRoute allowedRoles={['CEO']} />}>
          <Route path="/admin/dashboard" element={<CeoDashboard />} />
          <Route path="/admin/players" element={<div>Manage Players</div>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['CFO', 'CEO']} />}>
          <Route path="/admin/finance" element={<CfoDashboard />} />
        </Route>

        {/* --------------------------------------------------- */}
        {/* مسارات المدرب (Coach) - Mobile Layout */}
        {/* --------------------------------------------------- */}
        <Route element={<ProtectedRoute allowedRoles={['Coach']} />}>
          <Route path="/coach/schedule" element={<CoachSchedule />} />
          <Route path="/coach/evaluate" element={<div>Evaluate Player</div>} />
        </Route>

        {/* --------------------------------------------------- */}
        {/* مسارات الأهالي واللاعبين (Parent & Player) - Mobile App Layout */}
        {/* --------------------------------------------------- */}
      <Route element={<ProtectedRoute allowedRoles={['Parent', 'Player']} />}>
          <Route element={<PortalLayout />}>
            <Route path="/portal" element={<FamilyPortal />} />
            <Route path="/portal/schedule" element={<div className="p-6">Schedule Page</div>} />
            <Route path="/portal/progress" element={<div className="p-6">Progress Radar Chart</div>} />
            <Route path="/portal/profile" element={<div className="p-6">Profile Settings</div>} />
          </Route>
        </Route>

        {/* مسار افتراضي (Catch All) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;