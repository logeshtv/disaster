import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import DonationForm from './pages/DonationForm';
import VictimRequest from './pages/VictimRequest';
import DonorDashboard from './pages/DonorDashboard';
import './App.css';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center">
                  <span className="text-2xl font-bold text-red-600">🚨</span>
                  <span className="ml-2 text-xl font-bold text-gray-800">Disaster Relief</span>
                </Link>
                
                <div className="hidden md:flex space-x-4">
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Home
                  </Link>
                  <Link
                    to="/donate"
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Donate
                  </Link>
                  <Link
                    to="/request-help"
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Request Help
                  </Link>
                  <Link
                    to="/donor-dashboard"
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Donor Dashboard
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center">
                <Link
                  to="/admin"
                  className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<DonationForm />} />
          <Route path="/request-help" element={<VictimRequest />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route
            path="/admin"
            element={
              isAdminAuthenticated ? (
                <AdminDashboard onLogout={() => setIsAdminAuthenticated(false)} />
              ) : (
                <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
