"use client"

import { useState } from "react"
import { Eye, EyeOff, AtSign, Lock } from "lucide-react"
import { useAuthActions, useAuthState } from "../../provider/CurrentUserProvider" 
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })
  
  const { login } = useAuthActions()
  const { isPending } = useAuthState()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await toast.promise(
        login(credentials.email, credentials.password),
        {
          loading: 'Logging in...',
          success: () => {
            router.push("/UserMenu") 
            return 'Login successful!'
          },
          error: (err) => err.message || 'Login failed'
        }
      )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error is already handled by the toast.promise
    }
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
            <input 
              id="login-email" 
              name="email"
              type="email" 
              value={credentials.email}
              onChange={handleChange}
              placeholder="name@gmail.com" 
              required 
            />
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
            <input 
              id="login-password" 
              name="password"
              type={showPassword ? "text" : "password"} 
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••" 
              required 
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="checkbox-container">
          <input 
            type="checkbox" 
            id="remember" 
            checked={rememberMe} 
            onChange={() => setRememberMe(!rememberMe)} 
          />
          <label htmlFor="remember" className="checkbox-label">
            Remember me 
          </label>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isPending}
        >
          {isPending ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <style jsx>{`
        .form-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .form-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .form-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .form-header p {
          color: #6b7280;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .forgot-password {
          font-size: 0.875rem;
          color: #3b82f6;
          text-decoration: none;
        }
        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 0.75rem;
          color: #9ca3af;
        }
        input {
          width: 100%;
          padding: 0.5rem 0.75rem 0.5rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        .password-toggle {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
        }
        .checkbox-container {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        .checkbox-container input {
          width: auto;
          margin-right: 0.5rem;
        }
        .checkbox-label {
          font-size: 0.875rem;
          color: #4b5563;
        }
        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
        }
        .submit-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}