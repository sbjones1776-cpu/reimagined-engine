import React, { useState } from "react";
import { auth, db } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserProfile } from "@/api/firebaseService";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import React, { Suspense } from 'react';
const AvatarDisplayLazy = React.lazy(() => import('@/components/avatar/AvatarDisplay'));

// Starter avatar constant moved outside component to avoid re-allocation each render
const STARTER_AVATAR = {
  avatar_skin_tone: "medium",
  avatar_hair_style: "short",
  avatar_hair_color: "brown",
  avatar_eyes: "happy",
  avatar_face: "smile",
  avatar_shirt: "t_shirt_basic",
  avatar_pants: "jeans",
  avatar_shoes: "sneakers",
  avatar_hat: "none",
  avatar_glasses: "none",
  avatar_accessory: "none",
  avatar_background: "stars",
  pet_hat: "none",
  pet_accessory: "none",
  unlocked_items: [
    "t_shirt_basic",
    "jeans",
    "sneakers",
    "short",
    "long",
    "black",
    "brown",
    "blonde",
    "normal",
    "happy",
    "light",
    "medium",
    "tan",
    "dark",
    "smile",
    "big_smile",
    "plain",
  ],
};

export default function AuthForm({ showTitle = false, redirectTo = "Home" }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("sign-in"); // 'sign-in' | 'sign-up'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Reference the static starter avatar
  const starterAvatar = STARTER_AVATAR;

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
        // Standardize: create user profile with EMAIL as the document ID so our listeners match
        const userRef = doc(db, "users", email);
        await setDoc(
          userRef,
          {
            email,
            full_name: cred.user.displayName || email.split("@")[0],
            createdAt: serverTimestamp(),
            onboarding: {
              completed: false,
              lastStep: 0,
            },
            coins: 0,
            // Seed top-level avatar fields to match Avatar page expectations
            ...starterAvatar,
          },
          { merge: true }
        );
        setMessage("Account created! Meet your starter avatar.");
        setShowPreview(true); // Pause redirect to show avatar preview
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Signed in successfully.");
        // Redirect after sign-in only (sign-up pauses for preview)
        try {
          navigate(createPageUrl(redirectTo));
        } catch {
          /* safe no-op */
        }
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

      {showPreview && !error && (
        <div className="mt-6 p-4 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <h3 className="text-lg font-bold text-purple-700 mb-3">Welcome! Here's your starter look ✨</h3>
          <div className="flex items-center gap-4">
            <Suspense fallback={<div className="w-24 h-24 flex items-center justify-center">Loading avatar…</div>}>
              <AvatarDisplayLazy avatarData={starterAvatar} size="medium" />
            </Suspense>
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-3">You can customize your avatar now or do it later.</p>
              <div className="flex gap-2">
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => navigate(createPageUrl("Avatar"))}
                >
                  Customize Avatar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl(redirectTo))}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        By continuing you agree to our
        <button
          type="button"
          onClick={() => navigate(createPageUrl('PrivacyPolicy'))}
          className="text-purple-600 hover:underline ml-1"
        >
          Privacy Policy
        </button>
        {/* Placeholder Terms link - create Terms page later */}
        &nbsp;and
        <button
          type="button"
          onClick={() => navigate(createPageUrl('PrivacyPolicy'))}
          className="text-purple-600 hover:underline ml-1"
        >
          Terms
        </button>.
      </div>

      <div className="mt-4">
        <Button variant="outline" onClick={() => signOut(auth)} className="w-full">Sign Out</Button>
      </div>
    </div>
  );
}
