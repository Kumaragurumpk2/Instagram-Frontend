import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { validateEmail } from '../utils/helpers';
import { APP_NAME } from '../constants/apiEndpoints';
import { toast } from 'react-toastify';


const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError('');
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (ex: unknown) {
      toast.error(ex instanceof Error ? ex.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}>
        <div className="auth-card">
          <div className="text-center mb-4">
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(131,58,180,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <i className="bi bi-lock" style={{ fontSize: '1.8rem', color: 'var(--brand-primary)' }} />
            </div>
            <h5 className="fw-bold mb-1">Trouble logging in?</h5>
            <p className="text-ic-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <i className="bi bi-check2-circle" style={{ fontSize: '2rem', color: 'var(--online-color)' }} />
              </div>
              <h6 className="fw-bold mb-2">Email Sent!</h6>
              <p className="text-ic-muted mb-3" style={{ fontSize: '0.9rem' }}>
                Check <strong>{email}</strong> for a password reset link.
              </p>
              <Link to="/login" className="btn-brand d-inline-block px-4 py-2">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  className={`ic-input ${emailError ? 'error' : ''}`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                />
                {emailError && <small className="text-danger d-block mt-1">{emailError}</small>}
              </div>
              <button type="submit" className="btn-brand w-100 py-2" disabled={isLoading}>
                {isLoading ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</> : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>

        <div className="auth-card mt-3 text-center py-3">
          <p className="mb-1" style={{ fontSize: '0.9rem' }}>
            <Link to="/login" className="brand-text fw-600 text-decoration-none">
              <i className="bi bi-arrow-left me-1" />Back to Login
            </Link>
          </p>
          <p className="mb-0" style={{ fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="brand-text fw-600 text-decoration-none">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
