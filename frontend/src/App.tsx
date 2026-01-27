
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReservationsDashboard } from "./pages/ReservationsDashboard";
import {EmailDashboard} from "./pages/EmailDashboard";

function Home() {
  return <div style={{ padding: 20 }}>Welcome to RestaurantX Dashboard</div>;
}



function Analytics() {
  return <div style={{ padding: 20 }}>Analytics Page</div>;
}

function Settings() {
  return <div style={{ padding: 20 }}>Settings Page</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservations" element={<ReservationsDashboard />} />
        <Route path="/email-dashboard" element={<EmailDashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
