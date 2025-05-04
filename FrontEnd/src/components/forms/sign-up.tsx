"use client"

import type React from "react"
import { useState } from "react"
// import Link from 'next/link';
import { Eye, EyeOff, AtSign, Lock, User } from "lucide-react"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log("Sign up submitted")
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Create an Account</h2>
        <p>Join us to start managing your projects</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <div className="input-container">
            <div className="input-icon">
              <User size={18} />
            </div>
            <input id="name" placeholder="John Doe" required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-container">
            <div className="input-icon">
              <AtSign size={18} />
            </div>
            <input id="email" type="email" placeholder="name@example.com" required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-container">
            <div className="input-icon">
              <Lock size={18} />
            </div>
            <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button type="submit" className="submit-button">
          Create Account
        </button>
      </form>

      <div className="form-footer">
        By signing up, you agree to our{" "}
        <a href="/terms-of-service" className="link">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="link">
          Privacy Policy
        </a>
      </div>
    </div>
  )
}
