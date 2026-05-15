import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginSuccess, loginFailure, setLoading } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import {
  validatePassword,
  getBlockedTimeRemaining,
} from '../utils/helpers';
import { APP_NAME } from '../constants/apiEndpoints';
import { toast } from 'react-toastify';


const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, loginAttempts, blockedUntil } = useAppSelector((s) => s.auth);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ usernameOrEmail?: string; password?: string }>({});

  const blockedSeconds = getBlockedTimeRemaining(blockedUntil);
  const isBlocked = blockedSeconds > 0;

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!usernameOrEmail.trim()) errs.usernameOrEmail = 'Username or email is required';
    const pwErr = validatePassword(password);
    if (pwErr) errs.password = pwErr;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked) return;
    if (!validate()) return;
    dispatch(setLoading(true));
    try {
      const res = await authService.login({
        username_or_email: usernameOrEmail,
        password,
        remember_me: rememberMe,
      });
      dispatch(loginSuccess({ user: res.user, token: res.access_token }));
      toast.success(`Welcome back, ${res.user.full_name}!`);
      navigate('/feed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      dispatch(loginFailure(msg));
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="auth-page">
      {/* Background gradient orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(131,58,180,0.15), transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(253,29,29,0.1), transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <i className="bi bi-camera me-2" />
            <span className="brand-text">{APP_NAME}</span>
          </div>
          <p className="text-center text-ic-muted mb-4" style={{ fontSize: '0.9rem' }}>
            Sign in to see photos from your friends
          </p>

          {/* Blocked timer */}
          {isBlocked && (
            <div className="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--like-color)', borderRadius: 8, fontSize: '0.85rem', textAlign: 'center' }}>
              <i className="bi bi-lock-fill me-2" />
              Account temporarily locked. Try again in {Math.floor(blockedSeconds / 60)}m {blockedSeconds % 60}s
            </div>
          )}

          {/* Failed attempts warning */}
          {loginAttempts > 0 && !isBlocked && (
            <div className="alert" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--trending-color)', borderRadius: 8, fontSize: '0.85rem' }}>
              <i className="bi bi-exclamation-triangle me-2" />
              {loginAttempts} failed {loginAttempts === 1 ? 'attempt' : 'attempts'} — {5 - loginAttempts} remaining before lockout
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Username / Email */}
            <div className="mb-3">
              <input
                type="text"
                className={`ic-input ${errors.usernameOrEmail ? 'error' : ''}`}
                placeholder="Username or Email"
                value={usernameOrEmail}
                onChange={(e) => { setUsernameOrEmail(e.target.value); setErrors((p) => ({ ...p, usernameOrEmail: undefined })); }}
                disabled={isBlocked || isLoading}
                autoComplete="username"
              />
              {errors.usernameOrEmail && (
                <small className="text-danger d-block mt-1">{errors.usernameOrEmail}</small>
              )}
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`ic-input ${errors.password ? 'error' : ''}`}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                disabled={isBlocked || isLoading}
                autoComplete="current-password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
              {errors.password && (
                <small className="text-danger d-block mt-1">{errors.password}</small>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <label className="d-flex align-items-center gap-2 cursor-pointer" style={{ fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-brand" style={{ fontSize: '0.88rem', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-brand w-100 py-2"
              disabled={isLoading || isBlocked}
            >
              {isLoading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="d-flex align-items-center gap-3 my-3">
            <hr style={{ flex: 1, borderColor: 'var(--border-color)' }} />
            <span className="text-ic-muted" style={{ fontSize: '0.8rem' }}>OR</span>
            <hr style={{ flex: 1, borderColor: 'var(--border-color)' }} />
          </div>

          {/* Demo login hint */}
          <div className="text-center mb-3">
            <small className="text-ic-muted">
              Demo: username <strong>justin_guru_46</strong> / password <strong>Guru@123</strong>
            </small>
          </div>
        </div>

        {/* Register link */}
        <div className="auth-card mt-3 text-center py-3">
          <p className="mb-0" style={{ fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="brand-text fw-600 text-decoration-none">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
