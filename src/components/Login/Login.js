import './Login.css';
import { FaRegEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../../Authapi';

const Login = ({ onLoginSuccess, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    try {
      console.log('Attempting to log in with:', { username, password });

      const userData = { username, password };
      const data = await AuthApi.login(userData);

      console.log('Login response data:', data);

      if (!data || !data.user || !data.token) {
        throw new Error('User data or token is missing in the response');
      }


      localStorage.setItem('WAauthToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));


      onLoginSuccess(data.user);


      await Swal.fire({
        title: 'Login Successful!',
        text: 'Welcome back!',
        icon: 'success',
        confirmButtonText: 'OK',
      });

       window.location.reload();
      //  const navigate = useNavigate();
      //  navigate(0); 
      // navigate('/');
      // window.location.reload(true);
      // window.location.assign(window.location.href);
      // window.location.replace(window.location.href);


    } catch (error) {
      console.error('There was a problem with the login request:', error);
      Swal.fire({
        title: 'Login Failed',
        text: error.message || 'Please check your username and password.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginClick();
  };

  return (
    <div className="signin-box">
      <button className="close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="slim-logo">
        <img src="https://laravel.wasteaccountant.com/admin/images/WasteAccountant_LOGO.png" alt="Logo" width="100%" />
      </h2>
      <h2 className="signin-title-primary">Welcome back!</h2>
      <h3 className="signin-title-secondary">Sign in to continue.</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="input-group">
            <input
              type="text"
              className="form-control abc"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group mg-b-50">
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="input-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaRegEye />}
            </span>
          </div>
        </div>

        <button className="btn btn-primary btn-block btn-signin">
          Sign In
        </button>
      </form>

      <p className="text-center year mt-3">
        © 2025
      </p>
      <p className="text-center">
        <a className="text-info">Lost Your Password..?</a>
      </p>
      <p className="text-center ABC">
        Don't have an account?{' '}
        <a className="text-info">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;
