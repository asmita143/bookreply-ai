
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReservationsDashboard } from "./pages/ReservationsDashboard";
import { EmailDashboard } from "./pages/EmailDashboard";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { HomeDashboard } from "./pages/HomeDashboard";

function Settings() {
  return <div style={{ padding: 20 }}>Settings Page</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/reservations" element={<ReservationsDashboard />} />
        <Route path="/email-dashboard" element={<EmailDashboard />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
