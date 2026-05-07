import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import FamilyDashboard from './pages/FamilyDashboard';
import FamilyMedications from './pages/FamilyMedications';
import FamilyHistory from './pages/FamilyHistory';
import EmergencyInfo from './pages/EmergencyInfo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<FamilyDashboard />} />
        <Route path="/medications" element={<FamilyMedications />} />
        <Route path="/history" element={<FamilyHistory />} />
        <Route path="/emergency" element={<EmergencyInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;