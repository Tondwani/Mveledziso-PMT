"use client"

import { useState } from "react"
import SignUp from "@/components/forms/sign-up"
import Login from "@/components/forms/login"
// import { Toaster } from 'react-hot-toast'
import "@/app/login/style.css"

export default function Home() {
  const [activeForm, setActiveForm] = useState<"login" | "signup">("login")

  return (
    <main className="main-container">
      <div className="split-container">
        {/* Left side - Information section */}
        <section className="info-section">
          <h1>Mveledziso Project Management Tool</h1>
          <p>
            Welcome to Mveledziso PMT, a comprehensive solution designed to streamline your project management workflow.
            Mveledziso means &quot;Continuation&quot; in Tshivenda, and our tool is built to help you develop your projects efficiently.
          </p>
          
          <div className="info-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Intuitive task management and tracking</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Real-time collaboration with team members</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Detailed project analytics and reporting</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Customizable workflows for any project type</span>
            </div>
          </div>
        </section>

        {/* Right side - Auth section */}
        <section className="auth-section">
          <div className="auth-card">
            <div className="tab-container">
              <button
                onClick={() => setActiveForm("login")}
                className={`tab-button ${activeForm === "login" ? "active" : ""}`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveForm("signup")}
                className={`tab-button ${activeForm === "signup" ? "active" : ""}`}
              >
                Sign Up
              </button>
            </div>

            {activeForm === "login" ? <Login /> : <SignUp />}
          </div>
        </section>
      </div>
    </main>
  )
}
