import React, { useState } from "react";
import { auth, db } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthForm({ showTitle = false, redirectTo = "Home" }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("sign-in"); // 'sign-in' | 'sign-up'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const passwordStrength = (() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0-4
  })();

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    if (mode === "sign-up") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
    }
    setSubmitting(true);
    try {
      if (mode === "sign-up") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Create user profile document
        const userRef = doc(db, "users", cred.user.uid);
        await setDoc(userRef, {
          email,
          displayName: cred.user.displayName || email.split("@")[0],
          createdAt: serverTimestamp(),
          onboarding: {
            completed: false,
            lastStep: 0,
          },
          coins: 0,
          avatar: {
            skinTone: "medium",
          },
        }, { merge: true });
        setMessage("Account created! You're signed in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Signed in successfully.");
      }
      // Redirect after success
      try { navigate(createPageUrl(redirectTo)); } catch { /* safe no-op */ }
    } catch (err) {
      setError(err?.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Enter your email to receive a reset link.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent.");
    } catch (err) {
      setError(err?.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 text-left">
      {showTitle && (
        <h2 className="text-2xl font-bold mb-4 text-purple-700">
          {mode === "sign-in" ? "Sign in" : "Create your account"}
        </h2>
      )}

      <div className="space-y-3">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === "sign-up" && (
          <>
            <Input
              placeholder="Confirm password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <div className="text-xs text-gray-600">
              Strength: {['very weak','weak','fair','good','strong'][passwordStrength]}
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <Button onClick={handleSubmit} disabled={submitting} className="bg-purple-600 hover:bg-purple-700">
            {submitting ? "Please wait…" : mode === "sign-in" ? "Sign In" : "Sign Up"}
          </Button>
          <button
            type="button"
            className="text-sm text-purple-700 hover:underline"
            onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
          >
            {mode === "sign-in" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-gray-600 hover:underline"
        >
          Forgot password?
        </button>

        {(error || message) && (
          <Alert className={error ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
            <AlertDescription className={error ? "text-red-700" : "text-green-700"}>
              {error || message}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        By continuing you agree to our terms and privacy.
      </div>

      <div className="mt-4">
        <Button variant="outline" onClick={() => signOut(auth)} className="w-full">Sign Out</Button>
      </div>
    </div>
  );
}
