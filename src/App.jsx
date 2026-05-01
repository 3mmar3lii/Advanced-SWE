import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CeoDashboard from './features/admin/CeoDashboard';
import CoachPortal from './features/coach/CoachPortal';
import FamilyPortal from './features/portal/FamilyPortal';
import Login from './features/auth/Login';
import { AcademyProvider } from './context/AcademyContext';
import { AuthProvider } from './context/AuthContext'; // استدعاء الـ Auth

function App() {
  return (
    <AuthProvider>
      <AcademyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<CeoDashboard />} />
            <Route path="/coach" element={<CoachPortal />} />
            <Route path="/portal" element={<FamilyPortal />} />
          </Routes>
        </Router>
      </AcademyProvider>
    </AuthProvider>
  );
}

export default App;