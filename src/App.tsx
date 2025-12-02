import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubjectList from './pages/SubjectList';
import SubjectDetail from './pages/SubjectDetail';
import Cart from './pages/Cart';
import SimulationResult from './pages/SimulationResult';
import LatencyTest from './pages/LatencyTest';
import Login from './pages/Login';
import Signup from './pages/Signup';

import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={handleLogout} />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/subjects" element={<SubjectList />} />
          <Route path="/subjects/:id" element={<SubjectDetail />} />
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/simulation" element={user ? <SimulationResult /> : <Navigate to="/login" />} />
          <Route path="/latency" element={user ? <LatencyTest /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
