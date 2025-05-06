"use client"

import { useState } from "react"
import { Eye, EyeOff, AtSign, Lock, User, Shield, Users } from "lucide-react"
import { useAuthActions, useAuthState } from "../../provider/CurrentUserProvider"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [userData, setUserData] = useState({
    userName: "",
    name: "",
    surname: "",
    emailAddress: "",
    password: "",
    roleNames: ["User"] // Default role
  })
  const { register } = useAuthActions()
  const { isPending, isError, errorMessage } = useAuthState()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (role: string) => {
    setUserData(prev => ({
      ...prev,
      roleNames: [role] // Only one role allowed in this implementation
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Improved name handling logic
    let name = userData.name.trim();
    let surname = '';
    
    if (name.includes(' ')) {
      const nameParts = name.split(' ');
      name = nameParts[0];
      surname = nameParts.slice(1).join(' ');
    } else {
      surname = ' '; // Space to ensure API accepts it
    }
    
    try {
      await toast.promise(
        register({
          ...userData,
          name,
          surname,
          userName: userData.emailAddress 
        }),
        {
          loading: 'Creating your account...',
          success: () => {
            router.push("/login");
            return 'Account created successfully! Please log in.';
          },
          error: (err: Error) => err.message || 'Registration failed. Please try again.'
        }
      );
    } catch (error) {
      console.error("Registration error:", error);
    }
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Create an Account</h2>
        <p>Join us to start managing your projects</p>
      </div>

      {isError && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <div className="input-container">
            <div className="input-icon">
              <User size={18} />
            </div>
            <input 
              id="name" 
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="user name" 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-container">
            <div className="input-icon">
              <AtSign size={18} />
            </div>
            <input 
              id="email" 
              name="emailAddress"
              type="email" 
              value={userData.emailAddress}
              onChange={handleChange}
              placeholder="name@gmail.com" 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-container">
            <div className="input-icon">
              <Lock size={18} />
            </div>
            <input 
              id="password" 
              name="password"
              type={showPassword ? "text" : "password"} 
              value={userData.password}
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

        <div className="form-group">
          <label>Account Type</label>
          <div className="role-selection">
            <button
              type="button"
              className={`role-button ${userData.roleNames.includes('User') ? 'active' : ''}`}
              onClick={() => handleRoleChange('User')}
            >
              <Users size={16} />
              <span>User</span>
            </button>
            <button
              type="button"
              className={`role-button ${userData.roleNames.includes('Admin') ? 'active' : ''}`}
              onClick={() => handleRoleChange('Admin')}
            >
              <Shield size={16} />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isPending}
        >
          {isPending ? 'Creating Account...' : 'Create Account'}
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
        .role-selection {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .role-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background: white;
          cursor: pointer;
          font-size: 0.875rem;
        }
        .role-button.active {
          border-color: #3b82f6;
          background-color: #eff6ff;
          color: #3b82f6;
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
          margin-top: 1rem;
        }
        .submit-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
        .form-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .link {
          color: #3b82f6;
          text-decoration: underline;
        }
        .error-message {
          padding: 0.75rem;
          margin-bottom: 1rem;
          background-color: #fee2e2;
          color: #dc2626;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  )
}