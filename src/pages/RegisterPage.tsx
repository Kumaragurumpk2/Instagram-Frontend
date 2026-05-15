import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import {
  validateFullName,
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  getPasswordStrength,
} from '../utils/helpers';
import { APP_NAME } from '../constants/apiEndpoints';
import { toast } from 'react-toastify';


interface FormErrors {
  full_name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof typeof form, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  const validate = (): FormErrors => ({
    full_name: validateFullName(form.full_name) ?? undefined,
    username: validateUsername(form.username) ?? undefined,
    email: validateEmail(form.email) ?? undefined,
    password: validatePassword(form.password) ?? undefined,
    confirm_password: validateConfirmPassword(form.password, form.confirm_password) ?? undefined,
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setTouched((p) => ({ ...p, [field]: true }));
    const errs = validate();
    setErrors(errs);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ full_name: true, username: true, email: true, password: true, confirm_password: true });
    if (Object.values(errs).some(Boolean)) return;
    setIsLoading(true);
    try {
      await authService.register({
        full_name: form.full_name,
        username: form.username,
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
        profile_pic: profilePic,
      });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldStatus = (field: keyof FormErrors) => {
    if (!touched[field as keyof typeof touched]) return '';
    return errors[field] ? 'error' : 'success';
  };

  return (
    <div className="auth-page">
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(252,176,69,0.12), transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}>
        <div className="auth-card">
          <div className="auth-logo">
            <i className="bi bi-camera me-2" />
            <span className="brand-text">{APP_NAME}</span>
          </div>
          <p className="text-center text-ic-muted mb-4" style={{ fontSize: '0.9rem' }}>
            Sign up to see photos and videos from your friends.
          </p>

          {/* Profile Pic Upload */}
          <div className="text-center mb-4">
            <div
              className="d-inline-block cursor-pointer position-relative"
              onClick={() => avatarRef.current?.click()}
            >
              <img
                src={avatarPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username || 'new'}`}
                alt="avatar"
                className="ic-avatar ic-avatar-xl"
                style={{ border: '3px solid var(--border-light)', cursor: 'pointer' }}
              />
              <div
                className="position-absolute"
                style={{ bottom: 4, right: 4, width: 28, height: 28, borderRadius: '50%', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.85rem', border: '2px solid var(--bg-card)' }}
              >
                <i className="bi bi-camera" />
              </div>
            </div>
            <p className="text-ic-muted mt-1 mb-0" style={{ fontSize: '0.78rem' }}>
              Upload profile photo (optional)
            </p>
            <input ref={avatarRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="mb-3">
              <input
                className={`ic-input ${fieldStatus('full_name')}`}
                placeholder="Full Name"
                value={form.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                maxLength={100}
              />
              {touched.full_name && errors.full_name && (
                <small className="text-danger d-block mt-1">{errors.full_name}</small>
              )}
              {touched.full_name && !errors.full_name && (
                <small className="mt-1 d-block" style={{ color: 'var(--online-color)' }}>
                  <i className="bi bi-check-circle me-1" />Looks good!
                </small>
              )}
            </div>

            {/* Username */}
            <div className="mb-3">
              <div className="position-relative">
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>@</span>
                <input
                  className={`ic-input ${fieldStatus('username')}`}
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => handleChange('username', e.target.value.toLowerCase().replace(/\s/g, '_'))}
                  maxLength={50}
                  style={{ paddingLeft: '1.5rem' }}
                />
              </div>
              {touched.username && errors.username && (
                <small className="text-danger d-block mt-1">{errors.username}</small>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <input
                type="email"
                className={`ic-input ${fieldStatus('email')}`}
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                maxLength={100}
              />
              {touched.email && errors.email && (
                <small className="text-danger d-block mt-1">{errors.email}</small>
              )}
            </div>

            {/* Password */}
            <div className="mb-1">
              <input
                type="password"
                className={`ic-input ${fieldStatus('password')}`}
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              {form.password && (
                <div className="mt-2">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{ width: `${(strength.score / 6) * 100}%`, background: strength.color }}
                    />
                  </div>
                  <small style={{ color: strength.color }}>
                    Password strength: {strength.label}
                  </small>
                </div>
              )}
              {touched.password && errors.password && (
                <small className="text-danger d-block mt-1">{errors.password}</small>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <input
                type="password"
                className={`ic-input ${fieldStatus('confirm_password')}`}
                placeholder="Confirm Password"
                value={form.confirm_password}
                onChange={(e) => handleChange('confirm_password', e.target.value)}
              />
              {touched.confirm_password && errors.confirm_password && (
                <small className="text-danger d-block mt-1">{errors.confirm_password}</small>
              )}
            </div>

            <button type="submit" className="btn-brand w-100 py-2" disabled={isLoading}>
              {isLoading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Creating Account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-ic-muted mt-3 mb-0" style={{ fontSize: '0.78rem' }}>
            By signing up, you agree to our Terms and Privacy Policy.
          </p>
        </div>

        <div className="auth-card mt-3 text-center py-3">
          <p className="mb-0" style={{ fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" className="brand-text fw-600 text-decoration-none">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
