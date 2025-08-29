import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast';
import './App.css'

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("token");
  return isAuth ? children : <Navigate to="/auth/login" />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right"/>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
}

export default App
