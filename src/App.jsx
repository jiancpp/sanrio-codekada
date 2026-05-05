import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FamilyDashboard from './pages/FamilyDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<FamilyDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;