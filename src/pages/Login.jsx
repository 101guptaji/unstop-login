import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/loginStyle.css'

const validEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const validateForm = (formData) => {
  const errors = {};

  if (formData.username.trim() === '') {
    errors.username = 'Username is required';
  } else if (formData.username !== 'emilys') {
    errors.username = 'Username must be "emilys"';
  }

  if (formData.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!validEmail.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (formData.password.trim() === '') {
    errors.password = 'Password is required';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return errors;
}

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // const [apiError, setApiError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    const vErrors = validateForm(formData);
    if (Object.keys(vErrors).length > 0) {
      setErrors(vErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData, ...(!rememberMe && { expiresInMins: 60 })
        })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', JSON.stringify(data?.accessToken || data?.token));
        localStorage.setItem('userData', JSON.stringify({
          username: data?.username,
          email: data?.email,
          firstName: data?.firstName,
          lastName: data?.lastName,
          gender: data?.gender
        }));
        toast.success('Login successful!');

        navigate('/home');
      }
      else {
        toast.error(data?.message || 'Login failed. Please try again.');
      }
    }
    catch (error) {
      toast.error(error?.message || 'Login failed. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className='login-page'>
      <div className="login-illustration">
        <img src='/Illustration.png' alt="Login Illustration" />
      </div>

      <div className="login-form-container">
        <div className="welcome-title">
          <p>Welcome to</p>
          <h1>Unstop</h1>
        </div>

        <div className="social-buttons">
          <button className="social-btn">
            <img src="/google.png" alt="Google" width={32} height={32} />
            Login with Google
          </button>
          <button className="social-btn">
            <img src="/facebook.png" alt="Facebook" width={32} height={32} />
            Login with Facebook
          </button>
        </div>

        <div className="or-separator">
          <hr className="line" />
          <span className="or-text">OR</span>
          <hr className="line" />
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <span className="field-icon">
              <img src="/user-icon.png" alt="User Icon" width={24} height={24} />
            </span>
            <div className="field-group">
              <label>User name</label>
              <input required
                type="text"
                placeholder="Enter 'emilys'"
                name='username'
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                autoComplete="username"
                maxLength={30}
              />
              {errors.username && <span className="error-msg">{errors.username}</span>}
            </div>
          </div>
          {/* Email Field */}
          <div className="form-field">
            <span className="field-icon">
              <img src="/mail.png" alt="Mail Icon" width={24} height={24} />
            </span>
            <div className="field-group">
              <label>Email</label>
              <input required
                type="email"
                name='email'
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                autoComplete="email"
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>
          </div>
          {/* Password Field */}
          <div className="form-field">
            <span className="field-icon">
              <img src="/key.png" alt="Key Icon" width={24} height={24} />
            </span>
            <div className="field-group">
              <label>Password</label>
              <input required
                type={showPassword ? "text" : "password"}
                name='password'
                placeholder="Password (min 8 characters)"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                autoComplete="current-password"
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ?
                  <img src="/eyeClose.png" alt="Show Password" width={24} height={24} />
                  : <img src="/eyeOpen.png" alt="Hide Password" width={24} height={24} />}
              </span>
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>
          </div>
          {/* Remember Me & Forgot */}
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              /> Remember me
            </label>
            <a className="forgot-password" href="#" tabIndex={-1}>Forgot Password?</a>
          </div>
          {/* Login Button */}
          <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        {/* Register Link */}
        <div className="register-link">
          Don't have an account?&nbsp;
          <a href="#">Register</a>
        </div>
      </div>
    </div>
  )
}

export default Login