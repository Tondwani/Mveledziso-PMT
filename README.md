# Mveledziso PMT 🚀

A modern project management tool built with Next.js and ASP.NET Core.
## 📋 Project Overview

Mveledziso PMT is a full-stack project management tool designed to streamline project tracking, team collaboration, and task management. The application features a modern, responsive UI built with Next.js and a robust backend powered by ASP.NET Core.

## 🛠️ Tech Stack

### Frontend
- ⚛️ Next.js 14
- 📝 TypeScript
- 🎨 Ant Design
- ⚡ React
- 💅 CSS

### Backend
- 🔷 ASP.NET Core
- 🗄️ Entity Framework Core
-   C#

 ### Database
- 💾 Postgresql

### Containerization
 - Docker

### Domain Model 

https://lucid.app/lucidchart/54ce8af1-4d34-48f8-a9c8-628e6d2a1000/edit?viewport_loc=617%2C946%2C484%2C380%2C0_0&invitationId=inv_53cbc48f-ff39-45ac-ba72-6b76294cc339



## 📁 Project Structure

```
Mveledziso PMT/
├── aspnet-core/       # Backend ASP.NET Core application
│   ├── src/          # Source code
│   ├── test/         # Test projects
│   └── build/        # Build configuration
├── FrontEnd/         # Frontend Next.js application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Dependencies
└── 
```

## ✨ Key Features

- 📊 **Project Management**
  - Create and manage projects
  - Assign team members
  - Track project progress
  - Set deadlines and priorities

- 👥 **Team Collaboration**
  - Team management
  - Role-based access control
  - Task assignment
  - Progress tracking

- ✅ **Task Management**
  - Task creation and tracking
  - Priority levels
  - Status updates
  - Deadline management

## 🔒 Security

- Role-based authentication
- Protected routes
  - Admin menu for project management
  - User menu for task management
- Secure API communication

## AI Tools

Google Gemini API 
Model gemini-1.5-flash

## 🚀 Getting Started

### Prerequisites

- 📦 Node.js (v18 or higher)
- 🔷 .NET 8 SDK
- 💾 Postgresql
- 📦 npm or yarn

### Installation

🌐 Frontend Setup

📁 Navigate to the Frontend Folder
cd frontend
Or right-click the frontend folder in Visual Studio Code and select "Open in Integrated Terminal".

📦 Install Dependencies
npm i
▶️ Run the Frontend
Make sure the frontend project is opened in Visual Studio Code, then run:

npm run dev
Open your browser and navigate to the link provided (usually http://localhost:3000).

🔧 Backend Setup

📁 Navigate to Backend Solution
Open backend/HealthAp/src/HealthAp.Web.Host/Mveledziso.sln in Visual Studio.
Set Mveledziso.Web.Host as the Startup Project (right-click > Set as Startup Project).

⚙️ Set Up Database

Open Package Manager Console (Tools > NuGet Package Manager > PMC).
Run the following commands:
Add-Migration InitialCreate

Update-Database
▶️ Run the Backend
Click the Run button (green play icon) or press F5 in Visual Studio to start the backend.

4. Set up environment variables
5. Run the development servers

