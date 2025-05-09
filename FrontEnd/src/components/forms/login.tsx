"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, AtSign, Lock } from "lucide-react"
import { useAuthActions, useAuthState } from "../../provider/CurrentUserProvider" 
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import styles from './form.module.css'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    userNameOrEmail: "",
    password: ""
  })
  
  const { login } = useAuthActions()
  const { isPending, isError, errorMessage, currentUser, isSuccess } = useAuthState()
  const router = useRouter()

  // Watch for changes in currentUser and handle routing
  useEffect(() => {
    console.log('Login effect triggered:', { currentUser, isSuccess });
    
    if (currentUser && isSuccess) {
      // Check user roles for routing
      const roles = currentUser.roles || [];
      const isProjectManager = roles.includes("ProjectManager");
      // const isTeamMember = roles.includes("TeamMember");
      const redirectPath = isProjectManager ? "/AdminMenu" : "/UserMenu";
      
      console.log(`Routing to ${redirectPath} based on roles:`, roles);
      
      toast.success(`Welcome back, ${currentUser.name || 'User'}! Redirecting...`);
      setTimeout(() => {
        router.push(redirectPath);
      }, 1500);
    }
  }, [currentUser, isSuccess, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await toast.promise(
        login(credentials.userNameOrEmail, credentials.password),
        {
          loading: 'Signing in...',
          success: 'Authentication successful!',
          error: (err) => {
            console.error('Login error:', err);
            return err.message || 'Login failed. Please check your credentials and try again.';
          }
        }
      );
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  return (
    <div className={styles["form-container"]}>
      <div className={styles["form-header"]}>
        <h2>Welcome Back</h2>
        <p>Log in to access your projects</p>
      </div>

      {isError && (
        <div className={styles["error-message"]}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label htmlFor="login-email">Email or Username</label>
          <div className={styles["input-container"]}>
            <div className={styles["input-icon"]}>
              <AtSign size={18} />
            </div>
            <input 
              id="login-email" 
              name="userNameOrEmail"
              type="text" 
              value={credentials.userNameOrEmail}
              onChange={handleChange}
              placeholder="Email or username" 
              required 
            />
          </div>
        </div>

        <div className={styles["form-group"]}>
          <div className={styles["label-row"]}>
            <label htmlFor="login-password">Password</label>
            <a href="/forgot-password" className={styles["forgot-password"]}>
              Forgot password?
            </a>
          </div>
          <div className={styles["input-container"]}>
            <div className={styles["input-icon"]}>
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
              className={styles["password-toggle"]} 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className={styles["submit-button"]}
          disabled={isPending}
        >
          {isPending ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className={styles["form-footer"]}>
        Don&apos;t have an account?{" "}
        <a href="/signup" className={styles.link}>
          Sign up
        </a>
      </div>
    </div>
  )
}