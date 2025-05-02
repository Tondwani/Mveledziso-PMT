"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, AtSign, Lock } from "lucide-react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login submitted")
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Welcome Back</h2>
        <p>Log in to access your projects</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <div className="input-container">
            <div className="input-icon">
              <AtSign size={18} />
            </div>
            <input id="login-email" type="email" placeholder="name@gmail.com" required />
          </div>
        </div>

        <div className="form-group">
          <div className="label-row">
            <label htmlFor="login-password">Password</label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>
          <div className="input-container">
            <div className="input-icon">
              <Lock size={18} />
            </div>
            <input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="checkbox-container">
          <input type="checkbox" id="remember" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
          <label htmlFor="remember" className="checkbox-label">
            Remember me 
          </label>
        </div>

        <button type="submit" className="submit-button">
          Sign In
        </button>
      </form>
    </div>
  )
}
