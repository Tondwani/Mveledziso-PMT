"use client"

import { useState } from "react"
import { Eye, EyeOff, AtSign, Lock, User, Shield, Users } from "lucide-react"
import { useAuthActions, useAuthState } from "../../provider/CurrentUserProvider"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import styles from './form.module.css'

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [isTeamMember, setIsTeamMember] = useState(true)
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userName: "",
  })
  const { createTeamMember, createProjectManager } = useAuthActions()
  const { isPending, isError, errorMessage } = useAuthState()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleToggle = () => {
    setIsTeamMember(!isTeamMember)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const baseData = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email,
        password: userData.password,
        userName: userData.userName,
      }

      console.log('Signup attempt:', { 
        isTeamMember, 
        baseData: { ...baseData, password: '[REDACTED]' } 
      });

      const signupPromise = isTeamMember 
        ? createTeamMember(baseData)
        : createProjectManager(baseData);

      await toast.promise(
        signupPromise,
        {
          loading: `Creating ${isTeamMember ? 'Team Member' : 'Project Manager'} account...`,
          success: (result) => {
            console.log('Signup success:', result);
            setTimeout(() => {
              router.push("/login");
            }, 1500);
            return `${isTeamMember ? 'Team Member' : 'Project Manager'} account created successfully! Redirecting to login...`;
          },
          error: (err: Error) => {
            console.error('Signup error:', err);
            return err.message || 'Registration failed. Please try again.';
          }
        }
      );
    } catch (error) {
      console.error("Registration error:", error);
    }
  }

  return (
    <div className={styles["form-container"]}>
      <div className={styles["form-header"]}>
        <h2>Create an Account</h2>
        <p>Join us to start managing your projects</p>
      </div>

      {isError && (
        <div className={styles["error-message"]}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label htmlFor="firstName">First Name</label>
          <div className={styles["input-container"]}>
            <div className={styles["input-icon"]}>
              <User size={18} />
            </div>
            <input 
              id="firstName" 
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              placeholder="First name" 
              required 
            />
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="lastName">Last Name</label>
          <div className={styles["input-container"]}>
            <div className={styles["input-icon"]}>
              <User size={18} />
            </div>
            <input 
              id="lastName" 
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              placeholder="Last name" 
              required 
            />
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="userName">Username</label>
          <div className={styles["input-container"]}>
            <div className={styles["input-icon"]}>
              <User size={18} />
            </div>
            <input 
              id="userName" 
              name="userName"
              value={userData.userName}
              onChange={handleChange}
              placeholder="Username" 
              required 
            />
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="email">Email</label>
          <div className={styles["input-container"]}>
            <div className={styles["input-icon"]}>
              <AtSign size={18} />
            </div>
            <input 
              id="email" 
              name="email"
              type="email" 
              value={userData.email}
              onChange={handleChange}
              placeholder="Username@gmail.com" 
              required 
            />
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="password">Password</label>
          <div className={styles["input-container"]}>
            <div className={styles["input-icon"]}>
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
              className={styles["password-toggle"]} 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label>Account Type</label>
          <div className={styles["role-selection"]}>
            <button
              type="button"
              className={`${styles["role-button"]} ${isTeamMember ? styles.active : ''}`}
              onClick={handleRoleToggle}
            >
              <Users size={12} />
              <span>Team Member</span>
              <p className={styles["role-description"]}></p>
            </button>
            <button
              type="button"
              className={`${styles["role-button"]} ${!isTeamMember ? styles.active : ''}`}
              onClick={handleRoleToggle}
            >
              <Shield size={12} />
              <span>Project Manager</span>
              <p className={styles["role-description"]}></p>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className={styles["submit-button"]}
          disabled={isPending}
        >
          {isPending ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className={styles["form-footer"]}>
        Already have an account?{" "}
        <a href="/login" className={styles.link}>
          Sign in
        </a>
      </div>
    </div>
  )
}