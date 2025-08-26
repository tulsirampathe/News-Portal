// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import { AuthProvider } from "./context/AuthContext";
import NewsApp from "./components/NewsApp";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<NewsApp />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
