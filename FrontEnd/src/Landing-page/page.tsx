"use client"
import { useEffect, useRef } from "react"
import {
  BarChart3,
  Calendar,
  ClipboardList,
  Clock,
  Cog,
  LineChart,
  ListTodo,
  Users,
  CheckSquare,
  Trello,
  FileText,
  PieChart,
  Target,
  Briefcase,
  ArrowRight,
  Layers,
  MessageSquare,
  Bell,
  Flag,
  Award,
  Zap,
  Shield,
  Database,
  Server,
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react"
import '@/app/globals.css';  


export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Draw background
    const drawBackground = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Grey background
      ctx.fillStyle = "#e0e5eb" // Light grey background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw subtle pattern of tiny dots in BLACK
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)" // Black with low opacity

      for (let i = 0; i < canvas.width; i += 15) {
        for (let j = 0; j < canvas.height; j += 15) {
          if (Math.random() > 0.7) {
            const size = 1 + Math.random() * 3
            ctx.beginPath()
            ctx.arc(i, j, size, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    // Redraw on resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawBackground()
    }

    drawBackground()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Icons for the background pattern - using black instead of blue
  const icons = [
    <BarChart3 key="barchart" className="text-black opacity-15" />,
    <Calendar key="calendar" className="text-black opacity-15" />,
    <ClipboardList key="clipboard" className="text-black opacity-15" />,
    <Clock key="clock" className="text-black opacity-15" />,
    <Cog key="cog" className="text-black opacity-15" />,
    <LineChart key="linechart" className="text-black opacity-15" />,
    <ListTodo key="listtodo" className="text-black opacity-15" />,
    <Users key="users" className="text-black opacity-15" />,
    <CheckSquare key="checksquare" className="text-black opacity-15" />,
    <Trello key="trello" className="text-black opacity-15" />,
    <FileText key="filetext" className="text-black opacity-15" />,
    <PieChart key="piechart" className="text-black opacity-15" />,
    <Target key="target" className="text-black opacity-15" />,
    <Briefcase key="briefcase" className="text-black opacity-15" />,
    <Layers key="layers" className="text-black opacity-15" />,
    <MessageSquare key="messagesquare" className="text-black opacity-15" />,
    <Bell key="bell" className="text-black opacity-15" />,
    <Flag key="flag" className="text-black opacity-15" />,
    <Award key="award" className="text-black opacity-15" />,
    <Zap key="zap" className="text-black opacity-15" />,
    <Shield key="shield" className="text-black opacity-15" />,
    <Database key="database" className="text-black opacity-15" />,
    <Server key="server" className="text-black opacity-15" />,
    <Cpu key="cpu" className="text-black opacity-15" />,
    <Monitor key="monitor" className="text-black opacity-15" />,
    <Smartphone key="smartphone" className="text-black opacity-15" />,
    <Tablet key="tablet" className="text-black opacity-15" />,
  ]

  // Generate random positions for background icons
  const generateIconPositions = () => {
    const positions = []
    const iconCount = 80 // More icons for visual interest

    for (let i = 0; i < iconCount; i++) {
      positions.push({
        x: Math.random() * 100, // percentage of viewport width
        y: Math.random() * 100, // percentage of viewport height
        size: 16 + Math.random() * 24, // varying sizes for more visual interest
        rotate: Math.random() * 360, // random rotation
        icon: Math.floor(Math.random() * icons.length),
        opacity: 0.1 + Math.random() * 0.2, // varying opacity
      })
    }

    return positions
  }

  const iconPositions = generateIconPositions()

  return (
    <div className="container">
      <canvas ref={canvasRef} className="background-canvas" />

      {/* Background Icons */}
      <div className="background-icons">
        {iconPositions.map((pos, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `rotate(${pos.rotate}deg)`,
              opacity: pos.opacity,
              width: `${pos.size}px`,
              height: `${pos.size}px`,
            }}
          >
            {icons[pos.icon]}
          </div>
        ))}
      </div>

      <header>
        <div className="logo">
          <h1>Mveledziso</h1>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#overview">Overview</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#benefits">Benefits</a>
            </li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <div className="badge">
          <span>Project Management Made Simple</span>
        </div>

        <div className="hero-content">
          <h1>
            <span className="text-rich-black">Your Projects,</span>{" "}
            <span className="text-vibrant-blue">Your Schedule</span>
          </h1>
          <p>
            Streamline workflows, clarify responsibilities, and simplify collaboration with our intelligent project
            management system. No more confusion, just efficient teamwork.
          </p>
          <button className="cta-button">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div> 
        

        <div className="hero-image">
          <div className="circle-icon">
            <BarChart3 size={80} className="text-vibrant-blue" />
          </div>
        </div>
      </section>

      <section id="overview" className="overview">
        <div className="section-badge">Key Features</div>
        <h2>Simplifying Project Management</h2>
        <p>
          Our platform makes managing your projects effortless and efficient, helping teams stay focused, aligned, and
          ahead of deadlines.
        </p>
      </section>

      <section id="features" className="features">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Users size={40} className="text-vibrant-blue" />
            </div>
            <h3>Customizable Roles</h3>
            <p>
              Assign team members as Project Leaders, Task Owners, Reviewers, or Contributors to define exactly who can
              edit tasks, approve changes, or view sensitive projects.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Calendar size={40} className="text-vibrant-blue" />
            </div>
            <h3>Visual Timelines</h3>
            <p>
              Projects come to life with visual timelines that break work into phases and milestones. Drag-and-drop
              deadlines, color-coded phases, and automated reminders ensure no detail slips through.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ClipboardList size={40} className="text-vibrant-blue" />
            </div>
            <h3>Intuitive Task Management</h3>
            <p>
              Assign responsibilities with due dates, add descriptions and files, and track completion with progress
              bars. Team members receive real-time notifications when tasks are updated.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={40} className="text-vibrant-blue" />
            </div>
            <h3>Leadership Dashboards</h3>
            <p>
              At-a-glance dashboards highlight project statuses, overdue tasks, and team workloads. Drill down into
              specifics or zoom out for a high-level view—all without switching screens.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <MessageSquare size={40} className="text-vibrant-blue" />
            </div>
            <h3>Team Collaboration</h3>
            <p>
              Built-in communication tools allow team members to discuss tasks directly within the context of the
              project. Comment threads, @mentions, and file sharing keep conversations organized and accessible.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FileText size={40} className="text-vibrant-blue" />
            </div>
            <h3>Document Management</h3>
            <p>
              Store and organize all project-related documents in one central location. Version control, access
              permissions, and search functionality make finding and managing files effortless.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Target size={40} className="text-vibrant-blue" />
            </div>
            <h3>Goal Tracking</h3>
            <p>
              Set and track project goals with measurable KPIs. Monitor progress in real-time and adjust strategies as
              needed to ensure successful project completion and team accountability.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Database size={40} className="text-vibrant-blue" />
            </div>
            <h3>Resource Management</h3>
            <p>
              Allocate and monitor team resources efficiently. Prevent bottlenecks and overallocation with visual
              resource calendars and workload balancing tools that optimize team productivity.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Cpu size={40} className="text-vibrant-blue" />
            </div>
            <h3>AI Automation</h3>
            <p>
              Leverage intelligent automation to streamline repetitive tasks. AI-powered suggestions help optimize
              workflows, predict project timelines, and identify potential risks before they impact your deadlines.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <MessageSquare size={40} className="text-vibrant-blue" />
            </div>
            <h3>Text-to-Speech Integration</h3>
            <p>
              Convert project notes and task descriptions to audio with built-in text-to-speech functionality. Enable
              hands-free project updates and improve accessibility for all team members.
            </p>
          </div>
        </div>
      </section>

      <section id="benefits" className="benefits">
        <h2>Why Choose Our System</h2>
        <div className="benefits-content">
          <div className="benefits-text">
            <p>
              What sets this system apart is its flexibility. It works equally well for agile startups, remote teams, or
              large enterprises. Marketing teams can track campaign launches phase-by-phase, developers can manage
              sprints with clear task ownership, and executives can monitor company-wide initiatives without getting
              lost in details.
            </p>
            <p>
              Already, teams using the system report faster project completion, fewer miscommunications, and less time
              spent on administrative tasks. One user shared, &quot;We cut weekly check-in meetings by half because everyone
              knows their role and progress is visible to all.&quot;
            </p>
          </div>
          <div className="testimonial">
            <blockquote>&quot;Finally replaced our messy mix of apps with one platform that actually works.&quot;</blockquote>
            <cite>— Satisfied Customer</cite>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Mveledziso</h2>
            <p>Phanda nga Tshumelo</p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#overview">Overview</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#benefits">Benefits</a>
              </li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Email: info@mveledziso.com</p>
            <p>Phone: +27 123 456 789</p>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Mveledziso. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
