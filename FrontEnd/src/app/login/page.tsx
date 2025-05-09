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
    </main>
  )
}
