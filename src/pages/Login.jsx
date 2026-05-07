import React, { useState } from 'react';
import { PeopleFill, GlobeAmericas, HeartFill, ShieldLockFill, EyeFill, EyeSlashFill, PersonFill } from 'react-bootstrap-icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-olive-light.png';

const Login = () => {
  // Backend Connection
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const user = await login({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    });

    // If login is successful, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-body">

      {/* ── LEFT COLUMN: Branding ── */}
      <div className="hidden lg:flex relative bg-midnight items-center justify-center p-12 overflow-hidden">

        {/* Decorative circles */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-olive opacity-15 -top-36 -right-24 pointer-events-none" />
        <div className="absolute w-[250px] h-[250px] rounded-full bg-coral opacity-15 -bottom-20 -left-14 pointer-events-none" />
        <div className="absolute w-[150px] h-[150px] rounded-full bg-jasmine opacity-15 bottom-[20%] right-[10%] pointer-events-none" />

        <div className="relative z-10 max-w-[480px] w-full">
          {/* Logo */}
          <a href="/" className="inline-flex items-center gap-2 mb-12 no-underline">
            <img
              src={logo}
              alt="TalaCare Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-110"
            />
            <span className="font-display font-black text-[1.75rem] text-egg tracking-tight">TalaCare</span>
            <span className="w-2 h-2 rounded-full bg-coral" />
          </a>

          {/* Message */}
          <div className="mb-12">
            <h1 className="font-display font-black text-[2.75rem] text-egg leading-[1.15] tracking-tight mb-4">
              Start caring for your family today.
            </h1>
            <p className="text-sage text-lg leading-relaxed max-w-[380px]">
              Join thousands of Filipino families staying connected through health — no matter the distance.
            </p>
          </div>

          {/* Floating feature cards */}
          <div className="flex flex-col gap-3.5">
            {[
              { icon: <PeopleFill />, title: 'Family First', sub: 'Health sync for everyone', delay: '0s' },
              { icon: <GlobeAmericas />, title: 'Works Anywhere', sub: 'At Home,', delay: '0.2s' },
              { icon: <HeartFill />, title: '100% Free', sub: 'No hidden fees, ever', delay: '0.4s' },
            ].map(({ icon, title, sub, delay }) => (
              <div
                key={title}
                className="flex items-center gap-3.5 bg-white/[0.08] backdrop-blur border border-white/10 px-5 py-4 rounded-2xl"
                style={{ animation: `float2 3s ease-in-out ${delay} infinite` }}
              >
                <span className="text-2xl">{icon}</span>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-egg">{title}</span>
                  <span className="text-xs text-sage opacity-80">{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Form ── */}
      <div className="flex items-center justify-center bg-egg px-6 py-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <a href="/" className="lg:hidden inline-flex items-center gap-2 mb-10 no-underline">
            <span className="font-display font-black text-2xl text-midnight">TalaCare</span>
            <span className="w-2 h-2 rounded-full bg-coral" />
          </a>

          <div className="mb-8">
            <h2 className="font-display font-black text-[1.875rem] text-midnight tracking-tight mb-0">
              Log back in to your account
            </h2>
            <p className="text-mauve text-[0.9375rem]">Reconnect with your family</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="mb-4 p-3 bg-coral text-white text-sm rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-semibold text-sm text-midnight">Email</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-mauve pointer-events-none"><PersonFill /></span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-olive-light rounded-[0.875rem] text-[0.9375rem] text-midnight bg-white placeholder-[#b0b0b0] transition-all focus:outline-none focus:border-olive focus:shadow-[0_0_0_3px_rgba(115,138,119,0.15)]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-semibold text-sm text-midnight">Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-mauve pointer-events-none"><ShieldLockFill /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-12 py-3.5 border-2 border-olive-light rounded-[0.875rem] text-[0.9375rem] text-midnight bg-white placeholder-[#b0b0b0] transition-all focus:outline-none focus:border-olive focus:shadow-[0_0_0_3px_rgba(115,138,119,0.15)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bg-transparent border-none cursor-pointer text-base opacity-60 hover:opacity-100 transition-opacity p-0"
                >
                  {showPassword ? <EyeSlashFill /> : <EyeFill />}
                </button>
              </div>
            </div>

                    {/* Remember Me */}
        <div className="flex items-center justify-between ml-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="peer appearance-none w-5 h-5 border-2 border-olive-light rounded-md bg-white checked:bg-olive checked:border-olive transition-all cursor-pointer"
              />
              {/* Custom Checkmark Icon */}
              <svg
                className="absolute w-3 h-3 text-egg opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-mauve group-hover:text-midnight transition-colors">
              Remember me
            </span>
          </label>
        </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-midnight text-egg rounded-full font-bold text-[0.9375rem] border-none cursor-pointer transition-all mt-1 hover:bg-mauve hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,26,46,0.25)]"
            >
              Login
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-mauve mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-olive font-semibold no-underline hover:underline">Register here</button>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-olive-light" />
            <span className="text-xs text-mauve uppercase tracking-[0.05em]">or continue with</span>
            <div className="flex-1 h-px bg-olive-light" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            {[{ letter: 'G', label: 'Google' }, { letter: 'f', label: 'Facebook' }].map(({ letter, label }) => (
              <button
                key={label}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-olive-light rounded-[0.875rem] font-semibold text-sm text-midnight cursor-pointer transition-all hover:border-olive hover:bg-olive-light"
              >
                <span className="font-bold">{letter}</span> {label}
              </button>
            ))}
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-mauve mt-6 leading-relaxed">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-olive no-underline hover:underline">Terms</a>{' '}
            and{' '}
            <a href="/privacy" className="text-olive no-underline hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;