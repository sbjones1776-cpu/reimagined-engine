import React, { useState } from 'react';
import { auth } from '@/firebaseConfig';
import { createUserProfile, getUserProfile } from '@/api/firebaseService';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

// Minimal, stateless (outside) auth component: no avatars, no strength meters—just essentials.
export default function SimpleAuth() {
  const [mode, setMode] = useState('sign-in'); // 'sign-in' | 'sign-up' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const resetState = () => { setErr(''); setMsg(''); };

  const handleSubmit = async () => {
    resetState();
    if (!email) { setErr('Email required'); return; }
    if (mode === 'sign-up') {
      if (!password) { setErr('Password required'); return; }
      if (password !== confirm) { setErr('Passwords do not match'); return; }
    }
    if (mode === 'sign-in' && !password) { setErr('Password required'); return; }
    setLoading(true);
    try {
      if (mode === 'sign-up') {
        await createUserWithEmailAndPassword(auth, email, password);
        // Ensure a profile document exists keyed by EMAIL to match listeners
        await createUserProfile(email);
        setMsg('Account created. You are signed in.');
      } else if (mode === 'sign-in') {
        await signInWithEmailAndPassword(auth, email, password);
        // Ensure profile exists (getUserProfile creates if missing)
        await getUserProfile(email);
        setMsg('Signed in.');
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setMsg('Reset link sent. Check your email.');
      }
    } catch (e) {
      setErr(e?.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next) => { resetState(); setMode(next); };

  return (
    <div className="w-full max-w-sm mx-auto bg-white/90 rounded-xl shadow-lg p-5 space-y-4">
      <h2 className="text-xl font-bold text-purple-700 text-center">
        {mode === 'sign-in' && 'Sign In'}
        {mode === 'sign-up' && 'Create Account'}
        {mode === 'reset' && 'Reset Password'}
      </h2>
      <div className="space-y-3">
        <Input
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {mode !== 'reset' && (
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        )}
        {mode === 'sign-up' && (
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
      {(err || msg) && (
        <div className={`text-sm rounded-md p-2 ${err ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{err || msg}</div>
      )}
      <Button onClick={handleSubmit} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
        {loading ? 'Please wait…' : mode === 'sign-in' ? 'Sign In' : mode === 'sign-up' ? 'Sign Up' : 'Send Reset Link'}
      </Button>
      <div className="text-xs text-center text-gray-600 space-y-1">
        {mode === 'sign-in' && (
          <>
            <button onClick={() => switchMode('sign-up')} className="text-purple-600 hover:underline block w-full">Need an account? Sign up</button>
            <button onClick={() => switchMode('reset')} className="text-purple-600 hover:underline block w-full">Forgot password?</button>
          </>
        )}
        {mode === 'sign-up' && (
          <button onClick={() => switchMode('sign-in')} className="text-purple-600 hover:underline block w-full">Have an account? Sign in</button>
        )}
        {mode === 'reset' && (
          <button onClick={() => switchMode('sign-in')} className="text-purple-600 hover:underline block w-full">Back to sign in</button>
        )}
      </div>
    </div>
  );
}
