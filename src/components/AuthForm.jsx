import React, { useState } from "react";
import { auth } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthForm({ showTitle = false }) {
  const [mode, setMode] = useState("sign-in"); // 'sign-in' | 'sign-up'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    if (mode === "sign-up" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "sign-up") {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("Account created! You're signed in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Signed in successfully.");
      }
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
